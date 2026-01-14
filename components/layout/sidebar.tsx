"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Aperture, Home, Info, Briefcase, Mail, Layers, GraduationCap, Building2, Lightbulb, Menu, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

export function Sidebar() {
    const { user } = useAuth();
    const navItems = [
        { icon: Home, label: "Home", href: "/", colorClasses: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10 shadow-cyan-400/20" },
        { icon: Lightbulb, label: "Solutions", href: "/solutions", colorClasses: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10 shadow-yellow-400/20" },
        { icon: Layers, label: "Industries", href: "/industries", colorClasses: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10 shadow-cyan-400/20" },
        { icon: Building2, label: "Smart Spaces", href: "/smart-spaces", colorClasses: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10 shadow-yellow-400/20" },
        { icon: GraduationCap, label: "Academy", href: "/academy", colorClasses: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10 shadow-cyan-400/20" },
        { icon: BookOpen, label: "Knowledge", href: "/knowledge", colorClasses: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10 shadow-yellow-400/20" },
        { icon: Info, label: "About", href: "/about", colorClasses: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10 shadow-cyan-400/20" }
    ];

    const pathname = usePathname();
    const isAdmin = pathname?.includes("/admin");

    if (isAdmin) {
        return null;
    }

    return (
        <>
            {/* HERNYEMBO'S DESKTOP SIDEBAR (MD+) */}
            <div className="hidden md:flex fixed left-0 top-0 h-screen w-24 bg-transparent flex-col items-center justify-between py-8 z-[9999] pointer-events-none">
                <Link href="/" className="h-20 w-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-110 transition-transform duration-300 pointer-events-auto">
                    <Image
                        src="/assets/images/logo/logo.png"
                        alt="Nyembotech"
                        width={80}
                        height={80}
                        className="w-full h-full object-contain p-1"
                    />
                </Link>

                <div className="flex flex-col gap-4">
                    {navItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 border backdrop-blur-md shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] pointer-events-auto
                            ${item.colorClasses}
                            hover:text-red-500 hover:border-red-500 hover:bg-red-500/10 hover:shadow-red-500/20
                            active:text-red-500 active:border-red-500 active:bg-red-500/10 active:shadow-red-500/20`}
                        >
                            <item.icon className="w-5 h-5 relative z-10" />

                            <span className={`absolute left-14 bg-black/80 backdrop-blur-md ${item.colorClasses.split(' ')[0]} text-xs font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-white/10 translate-x-2 group-hover:translate-x-0 duration-300 z-50`}>
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-8 pointer-events-auto">
                    <div className="writing-vertical-lr rotate-180 text-transparent bg-clip-text bg-gradient-to-b from-nyembo-sky via-white to-nyembo-gold text-xs tracking-[0.3em] font-extrabold animate-bounce">
                        CUSTOMER
                    </div>

                    {user ? (
                        <Link href="/portal">
                            <div className="h-10 w-10 rounded-full bg-gray-600 overflow-hidden border-2 border-white/10 hover:scale-110 transition-transform cursor-pointer shadow-lg ring-2 ring-transparent hover:ring-nyembo-sky flex items-center justify-center relative">
                                <img
                                    src="/assets/images/auth/futuristic_ai_robot_icon.png"
                                    alt="Customer Portal"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </Link>
                    ) : (
                        <Link href="/login?view=portal&hideToggle=true">
                            <div className="h-10 w-10 rounded-full bg-white/5 overflow-hidden border-2 border-white/10 hover:scale-110 transition-transform cursor-pointer shadow-lg ring-2 ring-transparent hover:ring-nyembo-sky flex items-center justify-center group">
                                <div className="w-full h-full flex items-center justify-center group-hover:bg-nyembo-sky group-hover:text-black text-white transition-colors duration-300">
                                    <img
                                        src="/assets/images/auth/futuristic_ai_robot_icon.png"
                                        alt="Login"
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                </div>
                            </div>
                        </Link>
                    )}
                </div>
            </div>

            {/* FUTRISTIC MOBILE BOTTOM DOCK (Small Screens) */}
            <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[420px] z-[9999] pointer-events-auto">
                <div className="bg-[#0f1115]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center justify-between gap-1 overflow-x-auto scrollbar-hide">
                    {/* Top Glow Line */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none" />

                    {navItems.map((item, index) => {
                        // Normalize pathname to handle locales (e.g., /en/solutions -> /solutions)
                        const normalizedPath = pathname?.replace(/^\/[a-z]{2}(\/|$)/, "/") || "/";
                        const isActive = normalizedPath === item.href;
                        // Extract base color from colorClasses (e.g., text-cyan-400 or text-yellow-400)
                        const baseColor = item.colorClasses.match(/text-\w+-\d+/)?.[0] || 'text-white';
                        const dotColor = baseColor.replace('text-', 'bg-');
                        const shadowColor = baseColor.includes('cyan') ? 'rgba(34,211,238,0.8)' : 'rgba(250,204,21,0.8)';

                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className="relative flex-shrink-0 flex items-center justify-center w-12 h-12 z-10"
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="mobile-nav-active"
                                        className="absolute inset-0 bg-[#1c1f2e] rounded-2xl -z-10"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}

                                <div className="flex flex-col items-center gap-1">
                                    <item.icon
                                        className={`w-6 h-6 transition-all duration-300 ${baseColor} ${isActive ? 'opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'opacity-50'}`}
                                        strokeWidth={1.5}
                                    />
                                    {isActive && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className={`w-1 h-1 rounded-full ${dotColor}`}
                                            style={{ boxShadow: `0 0 8px ${shadowColor}` }}
                                        />
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
