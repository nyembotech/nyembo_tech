"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { OrgSwitcher } from "@/components/admin/org-switcher";
import {
    LayoutDashboard, FileText, Folder, Users, CheckSquare, GraduationCap,
    Building2, Settings, BrainCircuit, Bot, Activity, BookOpen, FlaskConical, Globe,
    ChevronDown, Map as MapIcon
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type NavGroup = {
    title: string;
    items: {
        name: string;
        href: string;
        icon: any;
    }[];
};

const navGroups: NavGroup[] = [
    {
        title: "Overview",
        items: [
            { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        ]
    },
    {
        title: "Intelligence",
        items: [
            { name: "Agents", href: "/admin/agents", icon: Bot },
            { name: "Navigator", href: "/admin/navigator", icon: MapIcon },
            { name: "AI Architect", href: "/admin/ai-architect", icon: BrainCircuit },
            { name: "Translation", href: "/admin/translate", icon: Globe },
            { name: "Knowledge Hub", href: "/admin/knowledge", icon: BookOpen },
        ]
    },
    {
        title: "Operations",
        items: [
            { name: "Projects", href: "/admin/projects", icon: Folder },
            { name: "Tasks", href: "/admin/tasks", icon: CheckSquare },
            { name: "Customers", href: "/admin/customers", icon: Users },
            { name: "Academy", href: "/admin/academy", icon: GraduationCap },
            { name: "Smart Spaces", href: "/admin/smart-spaces", icon: Building2 },
            { name: "Content CMS", href: "/admin/content", icon: FileText },
        ]
    },
    {
        title: "System",
        items: [
            { name: "System Health", href: "/admin/system", icon: Activity },
            { name: "Labs", href: "/admin/labs", icon: FlaskConical },
            { name: "Settings", href: "/admin/settings", icon: Settings },
        ]
    }
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [expandedGroup, setExpandedGroup] = useState<string | null>(() => {
        const currentGroup = navGroups.find(group =>
            group.items.some(item => pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href)))
        );
        return currentGroup ? currentGroup.title : navGroups[0].title;
    });

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 glass-neumo m-4 mb-4 rounded-2xl border-r-0 flex flex-col z-50 overflow-hidden shadow-2xl shadow-sky-900/20 backdrop-blur-xl bg-black/40 border border-white/10">
            {/* Logo Section - Fixed Overflow */}
            <div className="relative h-20 flex items-center justify-center border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                <div className="transform hover:scale-105 transition-transform duration-500">
                    {/* Constrain Logo Size explicitly */}
                    <div className="w-40 h-16 relative flex items-center justify-center">
                        <Logo className="scale-75" showText={true} />
                    </div>
                </div>
            </div>

            <div className="px-4 py-4">
                <OrgSwitcher />
            </div>

            <nav className="flex-1 overflow-y-auto px-3 space-y-2 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {navGroups.map((group) => {
                    const isExpanded = expandedGroup === group.title;
                    const isActiveGroup = group.items.some(item => pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href)));

                    return (
                        <div key={group.title} className="overflow-hidden">
                            <button
                                onClick={() => setExpandedGroup(isExpanded ? null : group.title)}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-3 text-[10px] uppercase tracking-[0.2em] font-bold mb-1 font-mono transition-colors duration-200 group/header",
                                    isExpanded || isActiveGroup ? "text-sky-400" : "text-gray-500 hover:text-sky-400/70"
                                )}
                            >
                                {group.title}
                                <ChevronDown
                                    className={cn(
                                        "w-3 h-3 transition-transform duration-300",
                                        isExpanded ? "rotate-180 text-sky-400" : "text-gray-600 group-hover/header:text-sky-400/50"
                                    )}
                                />
                            </button>

                            <AnimatePresence initial={false}>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="space-y-1 pb-2">
                                            {group.items.map((item) => {
                                                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className={cn(
                                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                                                            isActive
                                                                ? "bg-gradient-to-r from-sky-500/20 to-transparent text-sky-300 border-l-2 border-sky-400"
                                                                : "text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                                                        )}
                                                    >
                                                        <item.icon className={cn(
                                                            "w-4 h-4 transition-all duration-300 z-10",
                                                            isActive ? "text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" : "group-hover:text-white group-hover:scale-110"
                                                        )} />
                                                        <span className="z-10">{item.name}</span>

                                                        {isActive && (
                                                            <div className="absolute inset-0 bg-sky-400/5 z-0" />
                                                        )}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5 bg-black/20">
                <div className="neumo-concave p-3 rounded-xl border border-white/5 bg-black/40">
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 font-bold flex items-center justify-between">
                        System Status
                        <span className="animate-pulse w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    </p>
                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-400/80 font-mono">
                        Operational
                    </div>
                </div>
            </div>
        </aside >
    );
}
