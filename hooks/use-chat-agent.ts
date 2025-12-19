import { useState, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useAuth } from "@/context/auth-context";

// Define Message type to support both old (content) and new (parts) AI SDK formats
export interface Message {
    id: string;
    role: "function" | "system" | "user" | "assistant" | "data" | "tool";
    content?: string;
    parts?: Array<{ type: string; text?: string }>;
}

// Helper to extract text content from a message (supports both formats)
export function getMessageContent(message: Message): string {
    if (message.content) {
        return message.content;
    }
    if (message.parts) {
        return message.parts
            .filter(part => part.type === 'text' && part.text)
            .map(part => part.text)
            .join('');
    }
    return '';
}

type UseChatAgentProps = {
    agentType: "sales" | "support";
    projectId?: string;
    language?: string;
};

export function useChatAgent({ agentType, projectId, language = "en" }: UseChatAgentProps) {
    const { user } = useAuth();
    const [input, setInput] = useState("");
    // Generate a stable session ID for this chat instance
    const [sessionId] = useState(() => crypto.randomUUID());

    // Create transport with memoization to avoid recreating on every render
    const transport = useMemo(() => new DefaultChatTransport({
        api: "/api/agent",
        body: {
            agentType,
            sessionId,
            userId: user?.uid,
            projectId,
            language,
        },
    }), [agentType, sessionId, user?.uid, projectId, language]);

    const chat: any = useChat({
        transport,
        onError: (err: Error) => {
            console.error("Chat Agent Error:", err);
        },
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Use sendMessage for newer AI SDK versions, fallback to append for older versions
        if (chat.sendMessage) {
            chat.sendMessage({ text: input });
        } else if (chat.append) {
            chat.append({ role: "user", content: input });
        }

        setInput("");
    };

    // Helper function to send a message programmatically
    const sendMessage = (content: string) => {
        if (chat.sendMessage) {
            chat.sendMessage({ text: content });
        } else if (chat.append) {
            chat.append({ role: "user", content });
        }
    };

    const isLoading = chat.status === "streaming" || chat.status === "submitted";

    return {
        ...chat,
        messages: chat.messages as unknown as Message[],
        sendMessage,
        // Keep append for backward compatibility (maps to sendMessage)
        append: sendMessage,
        input,
        setInput,
        handleInputChange,
        handleSubmit,
        isLoading,
        isReady: agentType === "sales" || (agentType === "support" && !!user),
    };
}
