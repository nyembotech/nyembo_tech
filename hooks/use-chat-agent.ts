import { useState } from "react";
import { useChat, UseChatOptions } from "@ai-sdk/react";
import { useAuth } from "@/context/auth-context";

// Define Message type to match runtime shape (since 'ai' v5 types are strict/changed)
export interface Message {
    id: string;
    role: "function" | "system" | "user" | "assistant" | "data" | "tool";
    content: string;
}

type UseChatAgentProps = UseChatOptions<any> & {
    agentType: "sales" | "support";
    projectId?: string;
};

export function useChatAgent({ agentType, projectId, ...props }: UseChatAgentProps) {
    const { user } = useAuth();
    const [input, setInput] = useState("");

    const chat: any = useChat({
        api: "/api/agent",
        body: {
            agentType,
            userId: user?.uid,
            projectId,
        },
        onError: (err: Error) => {
            console.error("Chat Agent Error:", err);
        },
        ...props
    } as any);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        chat.append({ role: "user", content: input });

        setInput("");
    };

    const isLoading = chat.status === "streaming" || chat.status === "submitted";

    return {
        ...chat,
        messages: chat.messages as unknown as Message[],
        append: chat.append,
        input,
        setInput,
        handleInputChange,
        handleSubmit,
        isLoading,
        isReady: agentType === "sales" || (agentType === "support" && !!user),
    };
}
