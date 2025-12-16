"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { LayoutDashboard, Folder, MessageSquare, CreditCard, Settings, LifeBuoy, Bell, Building2, BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
    { name: "Dashboard", href: "/portal", icon: LayoutDashboard },
    { name: "Projects", href: "/portal/projects", icon: Folder },
    { name: "Tickets", href: "/portal/tickets", icon: MessageSquare },
    { name: "Smart Spaces", href: "/portal/smart-spaces", icon: Building2 },
    { name: "Knowledge Hub", href: "/knowledge", icon: BookOpen },
    { name: "Billing", href: "/portal/billing", icon: CreditCard },
    { name: "Support", href: "/portal/support", icon: LifeBuoy },
    { name: "Settings", href: "/portal/settings", icon: Settings },
];

export function CustomerSidebar() {
    const pathname = usePathname();
    const { user, signOut } = useAuth();

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 glass-neumo m-4 mb-4 rounded-2xl border-r-0 flex flex-col z-40 bg-black/40 backdrop-blur-xl border border-white/10">
            {/* Header / Logo */}
            <div className="h-24 flex items-center justify-center border-b border-white/5 mx-4 mb-2">
                <Link href="/portal" className="flex items-center gap-2 group">
                    <Logo className="scale-90 origin-center transition-transform group-hover:scale-100" />
                    <div className="flex flex-col">
                        <span className="font-bold text-white tracking-widest text-sm">PORTAL</span>
                        <span className="text-[10px] text-nyembo-sky tracking-widest uppercase">Customer</span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/portal" && pathname?.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "bg-nyembo-sky/10 text-nyembo-sky shadow-sm border border-nyembo-sky/20"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-nyembo-sky shadow-[0_0_10px_#38bdf8]" />
                            )}

                            <item.icon className={cn(
                                "w-5 h-5 transition-all duration-300 z-10",
                                isActive ? "text-nyembo-sky drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" : "group-hover:text-white"
                            )} />
                            <span className="z-10">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile / Footer */}
            <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-black/40 border border-white/10 p-1 overflow-hidden relative">
                        <img
                            src="/assets/images/auth/futuristic_ai_robot_icon.png"
                            alt="User"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                            {user?.displayName || "Valued Customer"}
                        </p>
                        <button
                            onClick={() => signOut()}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 mt-0.5"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </aside >
    );
}
