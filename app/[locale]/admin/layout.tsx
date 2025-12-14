import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";
import { RoleGuard } from "@/components/auth/role-guard";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard allowedRoles={['admin', 'staff']}>
            <div className="min-h-screen bg-background flex text-foreground">
                <AdminSidebar />
                <div className="flex-1 flex flex-col ml-64 transition-all duration-300">
                    <AdminTopbar />
                    <main className="flex-1 p-6 overflow-y-auto bg-sidebar/20">
                        {children}
                    </main>
                </div>
            </div>
        </RoleGuard>
    );
}
