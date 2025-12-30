import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSpineScene } from "@/components/ui/hero-spine-scene";
import { HeroCardStack } from "@/components/ui/hero-card-stack";

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
            <div className="relative bg-slate-50 bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 rounded-[3rem] overflow-hidden min-h-[800px] flex shadow-2xl border-4 border-white/50">
                {/* Main Content Area */}
                <div className="flex-1 relative">
                    {/* Content omitted for brevity, keeping only relevant changes */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                        {/* Left Content Column */}
                        <div className="p-8 lg:p-12 flex flex-col justify-between relative z-10">

                            {/* Top Notification Card - With Animated Gradient Border */}
                            <div className="relative group max-w-sm hover:scale-105 transition-transform duration-300">
                                {/* Blinking/Pulsing Gradient Border */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#58ffff] via-[#ffff6c] to-[#F54633] rounded-[28px] animate-pulse blur-[1px]" />

                                <div className="relative bg-white/85 p-4 rounded-3xl flex gap-4 backdrop-blur-md shadow-lg border border-white/40">
                                    <div className="w-16 h-16 rounded-2xl bg-gray-300 overflow-hidden shrink-0 shadow-inner px-0 py-0 flex items-center justify-center">
                                        <Image
                                            src="/assets/images/hero-section/hero.png"
                                            alt="Thumbnail"
                                            width={64}
                                            height={64}
                                            className="object-cover w-full h-full"
                                            priority
                                        />
                                    </div>
                                    <p className="text-[10px] leading-relaxed font-medium text-gray-800">
                                        {t.raw('heroSubtitle')}
                                    </p>
                                </div>
                            </div>

                            {/* Language Switcher Timeline */}
                            <div className="space-y-6 pl-4 border-l-2 border-gray-300/50 my-8 lg:my-10">
                                {[
                                    { code: 'de', label: 'Deutsch', flag: '🇩🇪', color: 'bg-yellow-500', number: '03' },
                                    { code: 'sw', label: 'Kiswahili', flag: '🇹🇿', color: 'bg-green-600', number: '02' },
                                    { code: 'en', label: 'English', flag: '🇺🇸', color: 'bg-blue-600', number: '01' }
                                ].map((lang) => (
                                    <div
                                        key={lang.code}
                                        className="relative group cursor-pointer flex items-center gap-3"
                                        onClick={() => switchLanguage(lang.code)}
                                    >
                                        {/* Timeline Dot */}
                                        <div className={cn(
                                            "absolute -left-[23px] transition-all duration-300 shadow-sm",
                                            currentLocale === lang.code
                                                ? `w-5 h-5 rounded-full border-4 border-white scale-110 ${lang.color} shadow-md`
                                                : "w-3 h-3 left-[2px] rounded-full bg-gray-300 group-hover:scale-125 group-hover:bg-gray-400"
                                        )} />

                                        {/* Content */}
                                        <div className={cn(
                                            "flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300",
                                            currentLocale === lang.code
                                                ? "bg-white shadow-md scale-105"
                                                : "hover:bg-white/50 hover:pl-6"
                                        )}>
                                            <span className={cn(
                                                "text-xl drop-shadow-sm transition-all",
                                                currentLocale === lang.code ? "" : "grayscale hover:grayscale-0"
                                            )}>{lang.flag}</span>
                                            <div className="flex flex-col">
                                                <span className={cn(
                                                    "text-[10px] font-bold tracking-widest uppercase transition-colors",
                                                    currentLocale === lang.code ? "text-black" : "text-gray-400 group-hover:text-gray-600"
                                                )}>
                                                    {lang.number}- {lang.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
                                <p className="text-[10px] max-w-xs text-slate-600 font-bold leading-relaxed tracking-wide">
                                    {t('heroSubtitle').toUpperCase()}
                                </p>

                                <div>
                                    <p className="text-2xl font-bold text-slate-400 mb-2">AI</p>
                                    <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 leading-[0.9] tracking-tighter drop-shadow-sm">
                                        {t('heroTitle')}
                                    </h1>
                                </div>
                            </div>
                        </div>


                        {/* Right Image Column */}
                        <div className="relative h-[700px] lg:h-auto overflow-hidden">
                            {/* Background Graphics & Image */}
                            <div className="absolute inset-0 overflow-hidden lg:rounded-bl-[100px] lg:rounded-tr-[3rem] border-l border-white/20 bg-white/5 backdrop-blur-sm shadow-[0_0_50px_rgba(255,255,255,0.05)] flex items-center justify-center">
                                {/* BACKGROUND GRID */}
                                <div className="absolute top-0 right-0 w-full h-full bg-[url('/assets/grid-pattern.svg')] opacity-60 mix-blend-multiply z-0 pointer-events-none" />

                                {/* NEW BACKGROUND PRODUCT IMAGE */}
                                <div className="absolute inset-0 hidden lg:flex items-center justify-center z-0 pointer-events-none opacity-[0.95]">
                                    <Image
                                        src="/assets/images/hero-section/products.png"
                                        alt="Products Background"
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        className="object-contain lg:object-cover"
                                        priority
                                    />
                                </div>



                                {/* NEW HERO CARD STACK */}
                                <div className="relative z-20 w-full h-full p-4 flex flex-col items-center justify-start pt-32 lg:pt-10 lg:justify-center">
                                    <HeroCardStack />

                                    {/* HEAVY CTA BUTTON */}
                                    <div className="relative mt-8 lg:absolute lg:mt-0 lg:bottom-10 left-0 right-0 z-30 flex justify-center px-4 pointer-events-auto">
                                        <Link href="/contact" className="w-full max-w-md">
                                            <div className="group relative bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-2xl hover:bg-white/20 transition-all duration-300">
                                                <div className="absolute inset-0 bg-gradient-to-r from-nyembo-sky/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                <Button
                                                    className="w-full h-16 text-lg md:text-xl font-black uppercase tracking-widest bg-nyembo-sky hover:bg-white text-black hover:text-black border-2 border-transparent hover:border-nyembo-sky transition-all shadow-xl hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] active:scale-95 rounded-xl flex items-center justify-between px-8"
                                                >
                                                    <span>Start Project</span>
                                                    <span className="flex items-center text-xs font-bold bg-black/10 px-3 py-1 rounded-full">
                                                        GET ESTIMATION <ArrowRight className="ml-2 w-4 h-4" />
                                                    </span>
                                                </Button>
                                            </div>
                                        </Link>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
