"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

// Lazy load the chat widget - it's a heavy component with AI SDK
const AgentChatWidget = dynamic(
    () => import("@/components/ai/agent-chat-widget").then(mod => ({ default: mod.AgentChatWidget })),
    {
        ssr: false,
        loading: () => (
            <div className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-sidebar-primary/50 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-white" />
            </div>
        )
    }
);

export function PublicAgentWrapper() {
    const pathname = usePathname();

    // Don't show Sales Agent on Admin or Portal pages
    if (pathname?.includes("/admin") || pathname?.includes("/portal")) {
        return null;
    }

    return <AgentChatWidget agentType="sales" />;
}
