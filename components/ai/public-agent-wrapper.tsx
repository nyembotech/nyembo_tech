
"use client";

import { usePathname } from "next/navigation";
import { AgentChatWidget } from "@/components/ai/agent-chat-widget";

export function PublicAgentWrapper() {
    const pathname = usePathname();

    // Don't show Sales Agent on Admin or Portal pages
    if (pathname?.includes("/admin") || pathname?.includes("/portal")) {
        return null;
    }

    return <AgentChatWidget agentType="sales" />;
}
