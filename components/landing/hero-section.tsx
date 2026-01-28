"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, Activity } from "lucide-react";

export function HeroSection() {
    const t = useTranslations("Landing.hero");
    const params = useParams();
    const locale = (params.locale as string) || "en";

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
            {/* Background aurora effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute top-0 right-0 w-[800px] h-[800px] animate-aurora-pulse"
                    style={{
                        background: "radial-gradient(ellipse at 70% 30%, rgba(249,168,37,0.15) 0%, transparent 60%)",
                    }}
                />
                <div
                    className="absolute bottom-0 left-0 w-[600px] h-[600px] animate-aurora-pulse"
                    style={{
                        background: "radial-gradient(ellipse at 30% 70%, rgba(59,130,246,0.1) 0%, transparent 60%)",
                        animationDelay: "3s",
                    }}
                />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 w-full">
                <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
                    {/* Left column */}
                    <div className="space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-nyembo-gold/20 bg-nyembo-gold/5 px-4 py-1.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-nyembo-gold animate-pulse" />
                            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-nyembo-gold">
                                {t("badge")}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="space-y-1">
                            <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tight text-white">
                                {t("titleLine1")}
                            </span>
                            <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tight text-white">
                                {t("titleLine2")}
                            </span>
                            <span
                                className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black uppercase tracking-tight text-glow-orange"
                                style={{ fontFamily: "var(--font-playfair), serif", color: "#F9A825" }}
                            >
                                {t("titleLine3")}
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="max-w-lg text-base sm:text-lg text-white/50 leading-relaxed">
                            {t("subtitle")}
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-wrap items-center gap-4">
                            <Link
                                href={`/${locale}/login`}
                                className="group inline-flex items-center gap-2 rounded-lg bg-nyembo-gold px-6 py-3 text-sm font-bold uppercase tracking-widest text-black transition-all hover:bg-nyembo-gold/90 hover:shadow-[0_0_30px_rgba(249,168,37,0.4)]"
                            >
                                {t("cta")}
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <a
                                href="#infrastructure"
                                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-6 py-3 text-sm font-medium uppercase tracking-widest text-white/60 transition-all hover:border-white/30 hover:text-white"
                            >
                                {t("secondaryCta")}
                            </a>
                        </div>

                        {/* Status badges */}
                        <div className="flex flex-wrap items-center gap-3 pt-4">
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400">
                                    {t("statusOperational")}
                                </span>
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1">
                                <Activity className="h-3 w-3 text-white/40" />
                                <span className="font-mono text-[10px] text-white/40">
                                    {t("requestsValue")} {t("requestsLabel").toLowerCase()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right column - Uptime card */}
                    <div className="relative">
                        <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm">
                            {/* Glow */}
                            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-nyembo-gold/10 via-transparent to-blue-500/10 pointer-events-none" />

                            <div className="relative space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                                        {t("uptimeLabel")}
                                    </span>
                                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                </div>

                                <div className="text-center py-8">
                                    <span className="text-6xl sm:text-7xl font-black text-white tracking-tight">
                                        {t("uptimeValue")}
                                    </span>
                                    <span className="block mt-2 text-lg text-nyembo-gold font-medium">%</span>
                                </div>

                                {/* Mini stats */}
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                    <div>
                                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                                            {t("requestsLabel")}
                                        </p>
                                        <p className="mt-1 text-lg font-bold text-white">{t("requestsValue")}</p>
                                    </div>
                                    <div>
                                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                                            {t("latencyLabel")}
                                        </p>
                                        <p className="mt-1 text-lg font-bold text-white">{t("latencyValue")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
