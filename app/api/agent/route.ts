import { streamText, type CoreMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { getAgentContext, AgentType } from "@/services/ai/context";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { AgentRequestSchema } from "@/lib/schemas";

export const maxDuration = 30;

export async function POST(req: Request) {
    // Check for OpenAI Key
    // If no key is found, return a mock response
    if (!process.env.OPENAI_API_KEY) {
        // Validation for Mock Mode as well to ensure type safety
        const body = await req.json();
        const parseResult = AgentRequestSchema.safeParse(body);

        if (!parseResult.success) {
            console.warn("Invalid agent request in mock mode", parseResult.error);
            // Proceeding with fallback values if strict validation fails in mock mode might is safer for debugging, 
            // but stricter is better. Let's use the parsed data if valid, or just simple internal fallback if not critical?
            // Actually, sticking to strict validation even in mock is better practice.
            return new Response(JSON.stringify({ error: "Invalid Request", details: parseResult.error.format() }), { status: 400 });
        }

        const { messages, agentType, userId, projectId, language, sessionId } = parseResult.data;

        // Ensure session exists
        const sessionRef = adminDb.collection("agent_sessions").doc(sessionId || "unknown_session");
        const sessionSnap = await sessionRef.get();
        if (!sessionSnap.exists) {
            await sessionRef.set({
                userId: userId || "anonymous",
                agentType,
                projectId: projectId || null,
                createdAt: FieldValue.serverTimestamp(),
                language: language || "en"
            });
        }

        const stream = new ReadableStream({
            async start(controller) {
                const mockMessage = `[MOCK] This is a simulated response because OPENAI_API_KEY is missing.\nContext: ${agentType} agent for user ${userId || 'anonymous'}.`;
                const tokens = mockMessage.split(/(\s+)/);

                for (const token of tokens) {
                    const data = `0:${JSON.stringify(token)}\n`;
                    controller.enqueue(new TextEncoder().encode(data));
                    await new Promise((r) => setTimeout(r, 50));
                }

                try {
                    const lastUserMessage = messages[messages.length - 1];
                    // Log User Message
                    await sessionRef.collection("messages").add({
                        role: "user",
                        content: lastUserMessage?.content || "",
                        createdAt: FieldValue.serverTimestamp()
                    });
                    // Log Assistant Message
                    await sessionRef.collection("messages").add({
                        role: "assistant",
                        content: mockMessage,
                        metadata: { isMock: true },
                        createdAt: FieldValue.serverTimestamp()
                    });
                } catch (e) {
                    console.error("Mock log failed", e);
                }

                controller.close();
            },
        });
        return new Response(stream, {
            headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
    }

    try {
        const body = await req.json();
        const parseResult = AgentRequestSchema.safeParse(body);

        if (!parseResult.success) {
            return new Response(JSON.stringify({ error: "Invalid Request", details: parseResult.error.format() }), { status: 400 });
        }

        const { messages, agentType, userId, projectId, language, sessionId } = parseResult.data;
        let sessionRef: any = null;

        // Try to initialize session logging, but don't block chat if it fails (e.g. missing firebase creds)
        try {
            sessionRef = adminDb.collection("agent_sessions").doc(sessionId || "unknown_session");
            const sessionSnap = await sessionRef.get();
            if (!sessionSnap.exists) {
                await sessionRef.set({
                    userId: userId || "anonymous",
                    agentType,
                    projectId: projectId || null,
                    language: language || "en",
                    createdAt: FieldValue.serverTimestamp(),
                    updatedAt: FieldValue.serverTimestamp()
                });
            } else {
                await sessionRef.set({
                    updatedAt: FieldValue.serverTimestamp()
                }, { merge: true });
            }
        } catch (dbError) {
            console.error("Failed to init agent session in Firestore (non-fatal):", dbError);
            sessionRef = null;
        }

        const systemContext = await getAgentContext(agentType as AgentType, { userId: userId || undefined, projectId: projectId || undefined, language });

        const result = await streamText({
            model: openai("gpt-4o-mini"),
            messages: [
                { role: "system", content: systemContext },
                ...(messages as CoreMessage[])
            ],
            onFinish: async ({ text, ...completion }) => {
                if (!sessionRef) return;

                try {
                    const lastUserMessage = messages[messages.length - 1];

                    // Log User Message
                    if (lastUserMessage) {
                        await sessionRef.collection("messages").add({
                            role: "user",
                            content: lastUserMessage.content,
                            createdAt: FieldValue.serverTimestamp()
                        });
                    }

                    // Log Assistant Message
                    await sessionRef.collection("messages").add({
                        role: "assistant",
                        content: text,
                        metadata: {
                            completionTokens: (completion.usage as any)?.completionTokens || 0,
                            promptTokens: (completion.usage as any)?.promptTokens || 0,
                            totalTokens: (completion.usage as any)?.totalTokens || 0,
                        },
                        createdAt: FieldValue.serverTimestamp(),
                    });
                } catch (logError) {
                    console.error("Failed to log agent session:", logError);
                }
            }
        });

        return result.toTextStreamResponse();
    } catch (error: any) {
        console.error("Agent API Error:", error);
        return new Response(`Internal Server Error: ${error?.message || String(error)}`, { status: 500 });
    }
}
