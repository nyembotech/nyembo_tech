import Link from "next/link";
import { Aperture, Home, Info, Briefcase, Mail, Layers, GraduationCap, Building2, Lightbulb } from "lucide-react";

export function Sidebar() {
    return (
        <div className="fixed left-0 top-0 h-screen w-24 bg-transparent flex flex-col items-center justify-between py-8 z-[9999] pointer-events-none">
            <Link href="/" className="h-12 w-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-110 transition-transform duration-300 border border-white/20 pointer-events-auto">
                <Aperture className="w-6 h-6 text-white" />
            </Link>

            {/* 3D Animated Navigation Icons */}
            <div className="flex flex-col gap-4">
                {[
                    { icon: Home, label: "Home", href: "/", baseColor: "cyan-400" },
                    { icon: Lightbulb, label: "Solutions", href: "/solutions", baseColor: "yellow-400" },
                    { icon: Layers, label: "Industries", href: "/industries", baseColor: "cyan-400" },
                    { icon: Building2, label: "Smart Spaces", href: "/smart-spaces", baseColor: "yellow-400" },
                    { icon: GraduationCap, label: "Academy", href: "/academy", baseColor: "cyan-400" },
                    { icon: Info, label: "About", href: "/about", baseColor: "yellow-400" },
                    { icon: Mail, label: "Contact", href: "/contact", baseColor: "cyan-400" }
                ].map((item, index) => (
                    <Link
                        key={index}
                        href={item.href}
                        className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 border backdrop-blur-md shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] pointer-events-auto
                        text-${item.baseColor} border-${item.baseColor}/30 bg-${item.baseColor}/10 shadow-${item.baseColor}/20
                        hover:text-red-500 hover:border-red-500 hover:bg-red-500/10 hover:shadow-red-500/20
                        active:text-red-500 active:border-red-500 active:bg-red-500/10 active:shadow-red-500/20`}
                    >
                        <item.icon className="w-5 h-5 relative z-10" />

                        {/* Hover Label */}
                        <span className={`absolute left-14 bg-black/80 backdrop-blur-md text-${item.baseColor} text-xs font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-white/10 translate-x-2 group-hover:translate-x-0 duration-300 z-50`}>
                            {item.label}
                        </span>
                    </Link>
                ))}
            </div>

            <div className="flex flex-col items-center gap-8 pointer-events-auto">
                <div className="writing-vertical-lr rotate-180 text-white/30 text-xs tracking-[0.3em] font-medium">
                    PROFILE
                </div>
                <div className="h-10 w-10 rounded-full bg-gray-600 overflow-hidden border-2 border-white/10 hover:scale-110 transition-transform cursor-pointer shadow-lg ring-2 ring-transparent hover:ring-nyembo-sky">
                    {/* Placeholder for profile pic */}
                    <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600" />
                </div>
            </div>
        </div>
    );
}
