import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSpineScene } from "@/components/ui/hero-spine-scene";

import { usePathname, useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from 'next-intl';

export function HeroLanding() {
    const t = useTranslations('Home');
    const pathname = usePathname();
    const router = useRouter();
    const params = useParams();
    const currentLocale = (params.locale as string) || "en";

    const switchLanguage = (locale: string) => {
        const pathSegments = pathname.split('/');
        // pathSegments[1] is the locale
        if (['en', 'sw', 'de'].includes(pathSegments[1])) {
            pathSegments[1] = locale;
        } else {
            pathSegments.splice(1, 0, locale);
        }
        const newPath = pathSegments.join('/') || '/';
        router.push(newPath);
    };

    return (
        <div className="w-full p-4">
            <div className="relative bg-gradient-to-br from-[#F0F2F5] via-[#E0E7FF] to-[#F3E8FF] rounded-[3rem] overflow-hidden min-h-[800px] flex shadow-2xl border-4 border-white/50">
                {/* Main Content Area */}
                <div className="flex-1 relative">
                    {/* Content omitted for brevity, keeping only relevant changes */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                        {/* Left Content Column */}
                        <div className="p-8 lg:p-12 flex flex-col justify-between relative z-10">

                            {/* Top Notification Card */}
                            <div className="bg-white/60 p-4 rounded-3xl flex gap-4 max-w-sm backdrop-blur-md shadow-lg border border-white/40 hover:scale-105 transition-transform duration-300">
                                <div className="w-16 h-16 rounded-2xl bg-gray-300 overflow-hidden shrink-0 shadow-inner">
                                    <Image
                                        src="/assets/images/hero-section/hero.png"
                                        alt="Thumbnail"
                                        width={64}
                                        height={64}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <p className="text-[10px] leading-relaxed font-medium text-gray-800">
                                    {t.raw('heroSubtitle')}
                                </p>
                            </div>

                            {/* Language Switcher Timeline */}
                            <div className="space-y-8 pl-4 border-l-2 border-gray-300/50 my-8 lg:my-12">
                                {/* Swahili Option */}
                                <div
                                    className="relative group cursor-pointer"
                                    onClick={() => switchLanguage('sw')}
                                >
                                    <div className={cn(
                                        "absolute transition-all duration-300 shadow-lg",
                                        currentLocale === 'sw'
                                            ? "-left-[23px] top-0 w-4 h-4 rounded-full bg-black border-2 border-[#F0F2F5] scale-125"
                                            : "-left-[21px] top-1 w-3 h-3 rounded-full bg-gray-400 group-hover:bg-nyembo-sky"
                                    )} />
                                    <p className={cn(
                                        "text-xs uppercase tracking-widest transition-colors",
                                        currentLocale === 'sw'
                                            ? "font-bold text-black"
                                            : "font-medium text-gray-500 group-hover:text-nyembo-sky"
                                    )}>
                                        02- Kiswahili
                                    </p>
                                </div>

                                {/* English Option */}
                                <div
                                    className="relative group cursor-pointer"
                                    onClick={() => switchLanguage('en')}
                                >
                                    <div className={cn(
                                        "absolute transition-all duration-300 shadow-lg",
                                        currentLocale === 'en'
                                            ? "-left-[23px] top-0 w-4 h-4 rounded-full bg-black border-2 border-[#F0F2F5] scale-125"
                                            : "-left-[21px] top-1 w-3 h-3 rounded-full bg-gray-400 group-hover:bg-nyembo-sky"
                                    )} />
                                    <p className={cn(
                                        "text-xs uppercase tracking-widest transition-colors",
                                        currentLocale === 'en'
                                            ? "font-bold text-black"
                                            : "font-medium text-gray-500 group-hover:text-nyembo-sky"
                                    )}>
                                        01- English
                                    </p>
                                </div>
                            </div>

                            {/* Pills omitted */}
                            <div className="flex flex-wrap gap-3 mb-8">
                                {[
                                    { label: "Artificial Intelligence", color: "hover:bg-blue-500 hover:border-blue-500" },
                                    { label: "Cyborg", color: "hover:bg-purple-500 hover:border-purple-500" },
                                    { label: "Art", color: "hover:bg-pink-500 hover:border-pink-500" },
                                    { label: "Technology", color: "hover:bg-cyan-500 hover:border-cyan-500" },
                                    { label: "Game", color: "hover:bg-yellow-500 hover:border-yellow-500" }
                                ].map((tag) => (
                                    <span key={tag.label} className={`px-4 py-2 rounded-full border border-black/80 text-[10px] font-bold uppercase tracking-wider text-black hover:text-white transition-all hover:scale-105 cursor-pointer shadow-sm hover:shadow-lg ${tag.color}`}>
                                        {tag.label}
                                    </span>
                                ))}
                            </div>

                            {/* Main Text */}
                            <div className="space-y-6">
                                <p className="text-[10px] max-w-xs text-gray-600 font-bold leading-relaxed tracking-wide">
                                    {t('heroSubtitle').toUpperCase()}
                                </p>

                                <div>
                                    <p className="text-2xl font-bold text-gray-400 mb-2">AI</p>
                                    <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-[#1A1A1A] leading-[0.9] tracking-tighter drop-shadow-sm">
                                        {t('heroTitle')}
                                    </h1>
                                </div>
                            </div>
                        </div>


                        {/* Right Image Column */}
                        <div className="relative h-[500px] lg:h-auto overflow-hidden lg:overflow-visible">
                            {/* Background Graphics & Image */}
                            <div className="absolute inset-0 overflow-hidden lg:rounded-bl-[100px] lg:rounded-tr-[3rem] border-l border-white/50 bg-gradient-to-br from-gray-100/20 to-white/10 backdrop-blur-[1px]">
                                <HeroSpineScene variant="console-orbit" className="h-[120%] -translate-y-[10%]" />

                                <div className="absolute top-0 right-0 w-full h-full bg-[url('/assets/grid-pattern.png')] opacity-20 mix-blend-multiply z-0 pointer-events-none" />

                                {/* Decorative Elements */}
                                <div className="absolute top-20 left-10 text-xs font-bold tracking-widest text-black/20 -rotate-90 origin-bottom-left hidden lg:block z-10 pointer-events-none">
                                    NYEMBOTECH <br /> SYSTEM STATUS
                                </div>
                                <div className="absolute bottom-10 right-10 flex flex-col items-end gap-4 z-20 pointer-events-none">
                                    <div className="bg-[#FF3B30] p-4 w-48 text-black font-bold font-mono text-xs relative overflow-hidden group shadow-xl">
                                        <div className="relative z-10 flex justify-between items-end">
                                            <span className="text-2xl italic font-black">CORE</span>
                                            <span>ONLINE</span>
                                        </div>
                                        <div className="flex gap-1 mt-2">
                                            <div className="w-2 h-2 bg-black rounded-full animate-bounce" />
                                            <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-100" />
                                            <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-200" />
                                        </div>
                                    </div>

                                    <div className="bg-white border border-black p-2 w-32 font-mono text-[10px] flex justify-between items-center shadow-lg">
                                        <span>ACTIVE</span>
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    </div>
                                </div>

                                {/* Barcode */}
                                <div className="absolute right-8 top-1/2 -translate-y-1/2 writing-vertical-rl text-[10px] font-mono tracking-widest opacity-40 hidden lg:block z-10 pointer-events-none">
                                    009//213
                                    <div className="w-4 h-32 bg-current mt-2 barcode-pattern" />
                                </div>
                            </div>

                            {/* Red Diamond Accent */}
                            <div className="absolute bottom-32 left-10 w-12 h-12 bg-[#FF3B30] transform rotate-45 hidden lg:block shadow-lg animate-pulse z-20 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
