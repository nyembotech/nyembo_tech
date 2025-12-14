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
        <aside className="fixed left-0 top-0 bottom-0 w-64 glass-neumo m-4 mb-4 rounded-2xl border-r-0 flex flex-col z-40">
            <div className="relative h-24 flex items-center justify-center -mt-6 -ml-6 mb-4">
                <div className="absolute top-4 left-4 z-50 transition-transform duration-300 hover:scale-105">
                    <Logo className="scale-125 origin-center drop-shadow-[0_0_15px_rgba(190,242,100,0.3)]" />
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "bg-[#bef264]/10 text-[#bef264] shadow-sm border border-[#bef264]/20"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#bef264] shadow-[0_0_10px_#bef264]" />
                            )}

                            <item.icon className={cn(
                                "w-5 h-5 transition-all duration-300 z-10",
                                isActive ? "text-[#bef264] drop-shadow-[0_0_8px_rgba(190,242,100,0.5)]" : "group-hover:text-white"
                            )} />
                            <span className="z-10">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5">
                <div className="neumo-concave p-4">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-bold">System Status</p>
                    <div className="flex items-center gap-2 text-xs font-medium text-[#bef264]">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#bef264] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#bef264]"></span>
                        </span>
                        System Online
                    </div>
                </div>
            </div>
        </aside >
    );
}
