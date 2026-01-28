"use client";

import { useTranslations } from "next-intl";
import { Cloud, Wifi, GitBranch, Globe, Check } from "lucide-react";

const categories = [
    { key: "cloud", icon: Cloud, active: true },
    { key: "edge", icon: Wifi, active: false },
    { key: "hybrid", icon: GitBranch, active: false },
    { key: "multiRegion", icon: Globe, active: false },
];

const featureKeys = ["multiCloud", "autoScaling", "disasterRecovery", "costOptimization"] as const;

export function DeploymentScenarios() {
    const t = useTranslations("Landing.deployment");

    return (
        <section id="deployment" className="relative py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="mb-16">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-nyembo-gold">
                        {t("label")}
                    </span>
                    <h2 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white">
                        {t("title")}
                    </h2>
                </div>

                {/* Two column layout */}
                <div className="grid lg:grid-cols-[300px_1fr] gap-8">
                    {/* Left - category list */}
                    <div className="space-y-2">
                        {categories.map((cat) => (
                            <div
                                key={cat.key}
                                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all cursor-pointer ${
                                    cat.active
                                        ? "border border-nyembo-gold/20 bg-nyembo-gold/5 text-nyembo-gold"
                                        : "border border-transparent text-white/40 hover:text-white/60 hover:bg-white/[0.02]"
                                }`}
                            >
                                <cat.icon className="h-4 w-4" />
                                <span className="font-medium">{t(`categories.${cat.key}`)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Right - detail card */}
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-8">
                        <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-nyembo-gold mb-4">
                            {t("cloudTitle")}
                        </h3>
                        <p className="text-base text-white/50 leading-relaxed max-w-2xl mb-8">
                            {t("cloudDescription")}
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {featureKeys.map((fk) => (
                                <div key={fk} className="flex items-center gap-3">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-nyembo-gold/10">
                                        <Check className="h-3 w-3 text-nyembo-gold" />
                                    </div>
                                    <span className="text-sm text-white/70">{t(`features.${fk}`)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
