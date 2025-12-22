import { useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { useAuth } from "@/context/auth-context";

// Define Message type to match runtime shape
export interface Message {
    id: string;
    role: "function" | "system" | "user" | "assistant" | "data" | "tool";
    content: string;
}

type UseChatAgentProps = any & {
    agentType: "sales" | "support";
    projectId?: string;
    language?: string;
};

export function useChatAgent({ agentType, projectId, language = "en", ...props }: UseChatAgentProps) {
    const { user } = useAuth();
    const [input, setInput] = useState("");
    // Generate a stable session ID for this chat instance
    const [sessionId] = useState(() => crypto.randomUUID());

    // Cast the hook return to 'any' to interact with it safely if types mismatch
    const chat: any = useChat({
        api: "/api/agent", // Revert to relative path
        body: {
            agentType,
            sessionId,
            userId: user?.uid,
            projectId,
            language,
        },
        onError: (err: Error) => {
            console.error("Chat Agent Error:", err);
        },
        ...props
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    // Helper to parse Vercel AI SDK stream format
    const parseStreamResponse = (raw: string) => {
        try {
            return raw
                .split('\n')
                .filter(line => line.startsWith('0:'))
                .map(line => {
                    try {
                        // 0:"text" -> text
                        // Remove prefix '0:' and parse JSON string
                        return JSON.parse(line.substring(2));
                    } catch { return ''; }
                })
                .join('');
        } catch (e) {
            console.error("Stream parse error:", e);
            return raw; // Fallback to raw if parse fails
        }
    };

    const safeAppend = async (message: { role: string; content: string }) => {
        // Construct absolute URL (proven to work) to bypass relative path issues
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const targetUrl = `${origin}/api/agent`;

        // Manual Fetch Logic (Bypasses SDK networking to ensure reliability)
        if (typeof chat.setMessages === 'function') {
            // A. Optimistic Update
            const userMsg = {
                id: crypto.randomUUID(),
                role: "user" as const,
                content: message.content,
                createdAt: new Date()
            };

            // Snapshot messages
            const payloadMessages = [...(chat.messages || []), userMsg];
            chat.setMessages(payloadMessages);

            try {
                const res = await fetch(targetUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        messages: payloadMessages,
                        agentType,
                        sessionId,
                        userId: user?.uid,
                        projectId,
                        language
                    })
                });

                if (!res.ok) throw new Error(`Server Error (${res.status})`);

                // B. Parse Stream Response
                // The AI SDK returns a stream format (e.g. 0:"Hello") which we must parse.
                const rawText = await res.text();
                const cleanText = parseStreamResponse(rawText);

                const assistantMsg = {
                    id: crypto.randomUUID(),
                    role: "assistant" as const,
                    content: cleanText || "...",
                    createdAt: new Date()
                };

                chat.setMessages((currentPrev: Message[]) => [...currentPrev, assistantMsg]);

            } catch (netError: any) {
                console.error("Chat network error:", netError);
                chat.setMessages((currentPrev: Message[]) => [
                    ...currentPrev,
                    {
                        id: crypto.randomUUID(),
                        role: "assistant",
                        content: "I'm having trouble connecting right now. Please try again.",
                        createdAt: new Date()
                    }
                ]);
            }
        }
        // Legacy fallback
        else if (typeof chat.sendMessage === 'function') {
            try {
                return await chat.sendMessage(message);
            } catch (e) { console.error(e); }
        }
        else {
            console.error("CRITICAL: Chat initialization failed (setMessages missing).");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        safeAppend({ role: "user", content: input });
        setInput("");
    };

    const isLoading = chat.status === "streaming" || chat.status === "submitted";

    return {
        ...chat,
        // Override append with our safe version
        append: safeAppend,
        messages: chat.messages as unknown as Message[],
        input,
        setInput,
        handleInputChange,
        handleSubmit,
        isLoading,
        isReady: agentType === "sales" || (agentType === "support" && !!user),
    };
}
