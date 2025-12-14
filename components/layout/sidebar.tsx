"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Aperture, Home, Info, Briefcase, Mail, Layers, GraduationCap, Building2, Lightbulb, Menu } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function Sidebar() {
    const { user } = useAuth();
    const navItems = [
        { icon: Home, label: "Home", href: "/", colorClasses: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10 shadow-cyan-400/20" },
        { icon: Lightbulb, label: "Solutions", href: "/solutions", colorClasses: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10 shadow-yellow-400/20" },
        { icon: Layers, label: "Industries", href: "/industries", colorClasses: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10 shadow-cyan-400/20" },
        { icon: Building2, label: "Smart Spaces", href: "/smart-spaces", colorClasses: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10 shadow-yellow-400/20" },
        { icon: GraduationCap, label: "Academy", href: "/academy", colorClasses: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10 shadow-cyan-400/20" },
        { icon: Info, label: "About", href: "/about", colorClasses: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10 shadow-yellow-400/20" },
        { icon: Mail, label: "Contact", href: "/contact", colorClasses: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10 shadow-cyan-400/20" }
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
                <Link href="/" className="h-20 w-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-110 transition-transform duration-300 border border-white/20 pointer-events-auto">
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
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xs font-bold text-white">
                                        {(user.displayName || user.email || "U").substring(0, 2).toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </Link>
                    ) : (
                        <Link href="/login?returnUrl=/portal">
                            <div className="h-10 w-10 rounded-full bg-white/5 overflow-hidden border-2 border-white/10 hover:scale-110 transition-transform cursor-pointer shadow-lg ring-2 ring-transparent hover:ring-nyembo-sky flex items-center justify-center group">
                                <div className="w-full h-full flex items-center justify-center group-hover:bg-nyembo-sky group-hover:text-black text-white transition-colors duration-300">
                                    <Aperture className="w-5 h-5" />
                                </div>
                            </div>
                        </Link>
                    )}
                </div>
            </div>

            {/* FUTRISTIC MOBILE BOTTOM DOCK (Small Screens) */}
            <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] z-[9999] pointer-events-auto">
                {/* Glass Dock Container */}
                <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-[0_10px_50px_rgba(0,0,0,0.5)] flex items-center justify-between overflow-x-auto relative">
                    {/* Glowing Accent Line */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-nyembo-sky/50 to-transparent" />

                    {/* Primary Nav Items (Limit to 4-5 for mobile space) */}
                    {navItems.slice(0, 5).map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className={`relative flex-1 min-w-[3.5rem] h-12 flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-300 hover:bg-white/5 active:scale-95 group`}
                        >
                            {/* Icon */}
                            <item.icon className={`w-5 h-5 transition-colors duration-300 ${item.colorClasses.split(' ')[0].replace('text-', 'group-hover:text-')}`} />

                            {/* Active Indicator Dot */}
                            <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-nyembo-sky transition-colors" />

                            {/* Label (Hidden but accessible?) - Removed for cleaner look on mobile, or could be tooltip */}
                        </Link>
                    ))}

                    {/* Mobile Menu Trigger for overflow items */}
                    <button className="flex-1 min-w-[3.5rem] h-12 flex flex-col items-center justify-center gap-1 rounded-xl hover:bg-white/5 active:scale-95 text-white/70 hover:text-white transition-colors">
                        <Menu className="w-5 h-5" />
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                    </button>
                </div>
            </div>
        </>
    );
}
