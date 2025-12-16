import { RoleGuard } from "@/components/auth/role-guard";
import { Sidebar } from "@/components/layout/sidebar"; // Assuming we reuse sidebar or have a specific portal sidebar
import { AgentChatWidget } from "@/components/ai/agent-chat-widget";

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard allowedRoles={["customer"]}>
            {/* Portal might have a different layout structure, e.g. SideNav */}
            <div className="flex min-h-screen">
                {/* Portal Sidebar could go here if different from Admin */}
                <main className="flex-1">
                    {children}
                    <AgentChatWidget agentType="support" />
                </main>
            </div>
        </RoleGuard>
    );
}
