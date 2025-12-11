"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { LayoutDashboard, FileText, Folder, Users, CheckSquare, GraduationCap, Building2, Settings } from "lucide-react";

const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Content", href: "/admin/content", icon: FileText },
    { name: "Projects", href: "/admin/projects", icon: Folder },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Tasks", href: "/admin/tasks", icon: CheckSquare },
    { name: "Academy", href: "/admin/academy", icon: GraduationCap },
    { name: "Smart Spaces", href: "/admin/smart-spaces", icon: Building2 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-40">
            <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
                <Logo className="scale-50 origin-left" />
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                                isActive
                                    ? "bg-sidebar-primary/10 text-sidebar-primary shadow-[0_0_10px_rgba(246,227,15,0.1)]"
                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5 transition-colors",
                                isActive ? "text-sidebar-primary drop-shadow-[0_0_5px_rgba(246,227,15,0.5)]" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground"
                            )} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-sidebar-border">
                <div className="bg-sidebar-accent/50 rounded-xl p-4 border border-sidebar-border">
                    <p className="text-xs text-sidebar-foreground/50 mb-2">System Status</p>
                    <div className="flex items-center gap-2 text-xs font-medium text-green-400">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                        </span>
                        All Systems Operational
                    </div>
                </div>
            </div>
        </aside>
    );
}
