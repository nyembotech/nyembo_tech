import { RoleGuard } from "@/components/auth/role-guard";
import { CustomerSidebar } from "@/components/portal/sidebar";
import { SupportAgentWrapper } from "@/components/ai/support-agent-wrapper";
import { PortalErrorBoundary } from "@/components/app-error-boundary";

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard allowedRoles={["customer", "admin"]}>
            <div className="flex min-h-screen bg-[#030711]">
                <CustomerSidebar />
                <main className="flex-1 ml-64 p-6 overflow-y-auto">
                    <PortalErrorBoundary>
                        {children}
                    </PortalErrorBoundary>
                    <SupportAgentWrapper />
                </main>
            </div>
        </RoleGuard>
    );
}
