import Image from "next/image";
import Link from "next/link";
import { Menu, User, Aperture, X, Home, Info, Briefcase, Mail, Layers, GraduationCap, Building2, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroLanding() {
    return (
        <div className="w-full p-4">
            <div className="relative bg-gradient-to-br from-[#F0F2F5] via-[#E0E7FF] to-[#F3E8FF] rounded-[3rem] overflow-hidden min-h-[800px] flex shadow-2xl border-4 border-white/50">
                {/* Main Content Area */}
                <div className="flex-1 relative">
                    {/* Top Menu Button (Optional, keeping as secondary or removing if strictly replaced) */}
                    <div className="absolute top-8 right-8 z-30">
                        <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform shadow-xl hover:bg-gray-900">
                            <Menu className="w-6 h-6" />
                        </div>
                    </div>

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
                                        className="object-cover w-full h-full opacity-80 mix-blend-overlay"
                                    />
                                </div>
                                <p className="text-[10px] leading-relaxed font-medium text-gray-800">
                                    Experience The Latest Technology That Immerses In A Live-Action Battlefield Like Never Seen Before
                                </p>
                            </div>

                            {/* Timeline */}
                            <div className="space-y-8 pl-4 border-l-2 border-gray-300/50 my-8 lg:my-12">
                                <div className="relative group cursor-pointer">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-gray-400 group-hover:bg-nyembo-sky transition-colors shadow-[0_0_10px_rgba(0,0,0,0.1)]" />
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-widest group-hover:text-nyembo-sky transition-colors">04- Launching</p>
                                </div>
                                <div className="relative group cursor-pointer">
                                    <div className="absolute -left-[23px] top-0 w-4 h-4 rounded-full bg-black border-2 border-[#F0F2F5] group-hover:scale-125 transition-transform shadow-lg" />
                                    <p className="text-xs font-bold text-black uppercase tracking-widest">03- Beta Stage</p>
                                </div>
                            </div>

                            {/* Pills */}
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
                                    INTRODUCING OUR GROUNDBREAKING AI FEATURE THAT TRANSFORMS THE WAY YOU INTERACT WITH TECHNOLOGY.
                                </p>

                                <div>
                                    <p className="text-2xl font-bold text-gray-400 mb-2">AI</p>
                                    <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-[#1A1A1A] leading-[0.9] tracking-tighter drop-shadow-sm">
                                        Futuristic <X className="inline-block w-8 h-8 text-nyembo-sky stroke-[4] animate-pulse" /> <br />
                                        technologies
                                    </h1>
                                </div>
                            </div>
                        </div>

                        {/* Right Image Column */}
                        <div className="relative h-[500px] lg:h-auto overflow-hidden lg:overflow-visible">
                            {/* Background Graphics */}
                            <div className="absolute inset-0 overflow-hidden lg:rounded-bl-[100px] lg:rounded-tr-[3rem] bg-gradient-to-br from-gray-100 to-white/50 backdrop-blur-sm border-l border-white/50">
                                <div className="absolute top-0 right-0 w-full h-full bg-[url('/assets/grid-pattern.png')] opacity-20 mix-blend-multiply" />
                                {/* Decorative Elements */}
                                <div className="absolute top-20 left-10 text-xs font-bold tracking-widest text-black/20 -rotate-90 origin-bottom-left hidden lg:block">
                                    BRYAN WAN <br /> SEASON THREE 2021
                                </div>
                                <div className="absolute bottom-10 right-10 flex flex-col items-end gap-4 z-20">
                                    <div className="bg-[#FF3B30] p-4 w-48 text-black font-bold font-mono text-xs relative overflow-hidden group shadow-xl cursor-pointer hover:scale-105 transition-transform">
                                        <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform" />
                                        <div className="relative z-10 flex justify-between items-end">
                                            <span className="text-2xl italic font-black">COSMOS</span>
                                            <span>00031</span>
                                        </div>
                                        <div className="flex gap-1 mt-2">
                                            <div className="w-2 h-2 bg-black rounded-full" />
                                            <div className="w-2 h-2 bg-black rounded-full" />
                                            <div className="w-2 h-2 bg-black rounded-full" />
                                        </div>
                                    </div>

                                    <div className="bg-white border border-black p-2 w-32 font-mono text-[10px] flex justify-between items-center shadow-lg hover:shadow-xl transition-shadow">
                                        <span>BRYNWKP</span>
                                        <X className="w-4 h-4" />
                                    </div>
                                </div>

                                {/* Barcode */}
                                <div className="absolute right-8 top-1/2 -translate-y-1/2 writing-vertical-rl text-[10px] font-mono tracking-widest opacity-40 hidden lg:block">
                                    009//213
                                    <div className="w-4 h-32 bg-current mt-2 barcode-pattern" />
                                </div>
                            </div>

                            {/* Hero Image */}
                            <div className="absolute inset-0 flex items-end justify-center lg:items-center lg:justify-center pt-10 pointer-events-none">
                                <div className="relative w-full h-[90%] lg:h-[110%] max-w-2xl">
                                    <Image
                                        src="/assets/images/hero-section/hero.png"
                                        alt="Futuristic Cyborg"
                                        fill
                                        className="object-contain object-bottom lg:object-center scale-100 lg:scale-110 lg:translate-x-10 drop-shadow-2xl"
                                        priority
                                    />
                                </div>
                            </div>

                            {/* Red Diamond Accent */}
                            <div className="absolute bottom-32 left-10 w-12 h-12 bg-[#FF3B30] transform rotate-45 hidden lg:block shadow-lg animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
