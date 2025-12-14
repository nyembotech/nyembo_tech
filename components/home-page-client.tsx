"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    ArrowUpRight,
    Bell,
    Camera,
    ChevronRight,
    Heart,
    LogOut,
    Maximize2,
    Menu,
    Mic,
    Plus,
    RefreshCcw,
    Search,
    Settings,
    ShieldCheck,
    Wallet,
} from "lucide-react";
import { HeroLanding } from "@/components/sections/hero-landing";

const navItems = [
    { label: "Menu" },
    { label: "Home", active: true },
    { label: "Image" },
    { label: "Save" },
    { label: "About" },
    { label: "Account" },
];

const knowledgeCards = [
    {
        tag: "Perbedaan",
        title: "Nyembotech unifies European rigor with African product velocity.",
        copy: "From data residency controls to AI assurance, every stack is tuned for multi-market collaboration without extra bureaucracy.",
        cta: "Case studies",
    },
    {
        tag: "Green Pea",
        title: "Delivery squads that move from sketch to production in weeks.",
        copy: "Green Pea pilots are intentionally small, vivid launches that illuminate the path for full deployments.",
        cta: "Next mission",
    },
];

const quickSignals = [
    { label: "Accounting", value: "Automated", icon: Wallet },
    { label: "Engagement", value: "92% love score", icon: Heart },
    { label: "Security", value: "ISO + SOC II", icon: ShieldCheck },
    { label: "Performance", value: "99.9% Uptime", icon: Camera }, // Added missing item to match previous grid count if needed or just 3
];

const galleryShots = [
    {
        title: "Nebula Console",
        description: "Observability for Lagos, Kigali and Nairobi mission rooms.",
        accent: "from-emerald-400/40 via-teal-300/30 to-slate-900/60",
    },
    {
        title: "Orbital Edge",
        description: "Deployments that survive shaky power and bandwidth.",
        accent: "from-sky-400/40 via-cyan-500/40 to-indigo-900/50",
    },
    {
        title: "Solar Streams",
        description: "Streaming intelligence for regulators and telcos.",
        accent: "from-nyembo-yellow/60 via-orange-500/40 to-rose-600/30",
    },
    {
        title: "Aurora Nodes",
        description: "Secure collaboration rooms for venture coalitions.",
        accent: "from-sky-200/30 via-blue-500/30 to-slate-900/70",
    },
];

const variationTabs = ["Its Type Variation", "Galaxy", "Green Pea"];

const surfaceClass = "neumo-surface bg-white/5 border-white/10";
const pillClass = "neumo-pill border-white/15 bg-white/10 text-white/70";
const chipClass = "inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-1 text-[0.65rem] uppercase tracking-[0.45em] text-white/60";

export function HomePageClient() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#030912] text-white">
            <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-nyembo-sky/10 blur-[180px]" />
            <div className="pointer-events-none absolute -bottom-40 left-0 h-[600px] w-[600px] rounded-full bg-nyembo-yellow/10 blur-[200px]" />

            <div className="relative mx-auto flex w-full flex-col gap-10 py-12">
                <HeroLanding />

                <section className="grid gap-6 lg:grid-cols-[1.5fr_0.5fr] p-4">
                    <div className="space-y-6">
                        <div className={`relative overflow-hidden p-8 shadow-[15px_20px_60px_rgba(3,7,12,0.8)] h-[850px] flex flex-col justify-between group`}>
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 z-0 bg-contain bg-no-repeat bg-center bg-[#0c131c] transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: "url('/assets/images/how-we-work.png')" }}
                            >
                                <div className="absolute inset-0 bg-black/40" /> {/* Overlay for readability */}
                            </div>

                            {/* Content Layer */}
                            <div className="relative z-10 flex items-center justify-between">
                                <span className={`${chipClass}`}>Mengenal Nyembotech / Orbit</span>
                                <button className={`${pillClass} border-white/20 bg-white/10 p-3 text-white/80`}>
                                    <Plus className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="relative z-10 mt-10 space-y-4">
                                <p className={`${pillClass} inline-flex items-center bg-black/40 px-4 py-1 text-[0.65rem] uppercase tracking-[0.4em] text-white/70`}>
                                    Future Range
                                </p>
                                {/* Text Removed as requested */}
                            </div>

                            <div className="relative z-10 mt-auto grid gap-4 sm:grid-cols-2">
                                <button className={`${surfaceClass} rounded-[2rem] border border-white/20 bg-white/5 px-5 py-4 text-left text-white transition hover:border-white/40 backdrop-blur-sm`}>
                                    <span className="text-sm text-white/60">Portal</span>
                                    <p className="text-lg font-semibold">Logout</p>
                                </button>
                                <button className={`${surfaceClass} rounded-[2rem] border border-white/20 bg-white/5 px-5 py-4 text-left text-white transition hover:border-white/40 backdrop-blur-sm`}>
                                    <span className="text-sm text-white/60">Finance view</span>
                                    <p className="text-lg font-semibold">Accounting</p>
                                </button>
                            </div>

                            <div className="relative z-10 mt-6 flex justify-center">
                                <div className={`${pillClass} border-white/20 px-6 py-3 text-center text-xs uppercase tracking-[0.4em] text-white/70`}>
                                    Skroll
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {knowledgeCards.map((card) => (
                                <div key={card.tag} className={`${surfaceClass} flex h-full flex-col p-6`}>
                                    <span className={`${chipClass}`}>{card.tag}</span>
                                    <h3 className="mt-4 text-xl font-semibold text-white">{card.title}</h3>
                                    <p className="mt-3 text-sm text-white/70">{card.copy}</p>
                                    <button className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-nyembo-sky">
                                        {card.cta}
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className={`${surfaceClass} p-6`}>
                            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Signals</p>
                            <div className="mt-6 space-y-5">
                                {quickSignals.map((signal) => (
                                    <div key={signal.label} className={`${surfaceClass} flex items-center justify-between gap-3 border-white/15 bg-black/20 px-4 py-3`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
                                                <signal.icon className="h-5 w-5" />
                                            </span>
                                            <div>
                                                <p className="text-sm text-white/60">{signal.label}</p>
                                                <p className="text-base font-semibold text-white">{signal.value}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-white/40" />
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="mt-6 w-full rounded-2xl border-white/30 text-white">
                                View reports
                            </Button>
                        </div>

                        <div className={`${surfaceClass} p-6`}>
                            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Favorite modules</p>
                            <div className="mt-5 grid grid-cols-2 gap-4">
                                <div className={`${surfaceClass} rounded-2xl border-white/15 bg-white/5 px-4 py-6 text-center`}>
                                    <Heart className="mx-auto h-6 w-6 text-nyembo-yellow" />
                                    <p className="mt-2 text-sm text-white/70">Community</p>
                                </div>
                                <div className={`${surfaceClass} rounded-2xl border-white/15 bg-white/5 px-4 py-6 text-center`}>
                                    <Settings className="mx-auto h-6 w-6 text-nyembo-sky" />
                                    <p className="mt-2 text-sm text-white/70">Automation</p>
                                </div>
                                <div className={`${surfaceClass} rounded-2xl border-white/15 bg-white/5 px-4 py-6 text-center`}>
                                    <LogOut className="mx-auto h-6 w-6 text-white" />
                                    <p className="mt-2 text-sm text-white/70">Portal</p>
                                </div>
                                <div className={`${surfaceClass} rounded-2xl border-white/15 bg-white/5 px-4 py-6 text-center`}>
                                    <ArrowRight className="mx-auto h-6 w-6 text-nyembo-yellow" />
                                    <p className="mt-2 text-sm text-white/70">Projects</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-8 p-8">
                    <div className="flex flex-col gap-6 xl:flex-row">
                        <div className="flex-1 grid gap-6 sm:grid-cols-2">
                            {galleryShots.slice(0, 2).map((shot) => (
                                <div
                                    key={shot.title}
                                    className={`${surfaceClass} relative overflow-hidden rounded-[2rem] border-white/15 bg-gradient-to-br ${shot.accent} p-6 text-white`}
                                >
                                    <p className="text-sm text-white/80">{shot.title}</p>
                                    <p className="mt-2 text-xs text-white/70">{shot.description}</p>
                                    <div className={`${pillClass} mt-6 inline-flex border-white/30 bg-white/10 p-3 text-white`}>
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex w-full items-stretch gap-4 xl:w-48 xl:flex-col">
                            <div className={`${surfaceClass} flex flex-1 flex-col items-center justify-center text-center`}>
                                <p className="text-xs uppercase tracking-[0.4em] text-white/60">Page</p>
                                <p className="text-base font-semibold">Gallery</p>
                            </div>
                            <div className={`${surfaceClass} flex flex-1 flex-col items-center justify-center text-center`}>
                                <p className="text-xs uppercase tracking-[0.4em] text-white/60">Skroll</p>
                                <ChevronRight className="mt-2 h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    <div className={`${surfaceClass} border-white/15 bg-gradient-to-br from-[#101c27] via-[#0c131c] to-[#06090f] p-6`}>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <Image
                                    src="/assets/images/logo/logo.png"
                                    alt="Nyembotech orbital mark"
                                    width={56}
                                    height={56}
                                    className="h-14 w-14 rounded-full border border-white/10 bg-white/5 object-contain"
                                />
                                <div>
                                    <p className="text-sm uppercase tracking-[0.3em] text-white/60">Special Collaboration</p>
                                    <p className="text-xl font-semibold text-white">Nyembotech Alliances</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {variationTabs.map((tab, index) => (
                                    <button
                                        key={tab}
                                        className={`${pillClass} px-4 py-2 text-sm ${index === 0 ? "bg-white/20 text-white" : "hover:text-white"}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 grid gap-5 md:grid-cols-3">
                            {galleryShots.slice(1).map((shot) => (
                                <div key={shot.title} className={`${surfaceClass} flex flex-col border-white/15 bg-white/5 p-4 text-white`}>
                                    <div className={`h-32 rounded-2xl bg-gradient-to-br ${shot.accent}`} />
                                    <div className="mt-4 flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-base font-semibold">{shot.title}</p>
                                            <p className="text-xs text-white/60">{shot.description}</p>
                                        </div>
                                        <span className={`${pillClass} border-white/20 bg-white/10 p-2 text-white`}>
                                            <ArrowRight className="h-4 w-4" />
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`${surfaceClass} flex flex-wrap items-center justify-between gap-4 bg-white/10 px-6 py-4`}>
                        <Button className="flex items-center gap-2 rounded-2xl bg-white text-black hover:bg-white/90">
                            <ArrowUpRight className="h-4 w-4" /> Visit site
                        </Button>
                        <div className="flex items-center gap-4">
                            <div className={`${surfaceClass} border-white/20 bg-white/10 p-3`}>
                                <Maximize2 className="h-5 w-5" />
                            </div>
                            <div className={`${surfaceClass} border-white/20 bg-white/10 p-3`}>
                                <RefreshCcw className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                            <span className="inline-flex h-3 w-3 rounded-full bg-nyembo-yellow" />
                            Tentang Nyembotech
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
