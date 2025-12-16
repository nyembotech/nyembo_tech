import { streamText, type CoreMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { getAgentContext, AgentType } from "@/services/ai/context";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export const maxDuration = 30;

export async function POST(req: Request) {
    // Check for OpenAI Key
    // If no key is found, return a mock response
    if (!process.env.OPENAI_API_KEY) {
        const { messages, agentType, userId, projectId, language, sessionId } = await req.json();

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
        const { messages, agentType, userId, projectId, language, sessionId } = await req.json();

        // Validate basic inputs
        if (!agentType) {
            return new Response("Agent Type required", { status: 400 });
        }

        // Ensure session exists
        const sessionRef = adminDb.collection("agent_sessions").doc(sessionId || "unknown_session");
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
                agentType, // Update agent type if changed (unlikely/optional)
                updatedAt: FieldValue.serverTimestamp()
            }, { merge: true });
        }

        const systemContext = await getAgentContext(agentType as AgentType, { userId, projectId, language });

        const result = await streamText({
            model: openai("gpt-4o-mini"),
            messages: [
                { role: "system", content: systemContext },
                ...(messages as CoreMessage[])
            ],
            onFinish: async ({ text, ...completion }) => {
                console.log("Generated text length:", text.length);

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
                    console.log("Logged agent session messages to Firestore.");
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
