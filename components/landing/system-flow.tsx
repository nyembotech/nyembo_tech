"use client";

import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

const sourceKeys = ["api", "stream", "batch", "webhook"] as const;
const orchKeys = ["routing", "loadBalancing", "failover", "caching"] as const;
const telKeys = ["metrics", "traces", "logs", "alerts"] as const;

export function SystemFlow() {
    const t = useTranslations("Landing.systemFlow");

    return (
        <section className="relative py-24 overflow-hidden">
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

                {/* Flow diagram - 3 columns */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Data Ingestion */}
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
                        <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-blue-400 mb-6">
                            {t("ingestionTitle")}
                        </h3>
                        <div className="space-y-3">
                            {sourceKeys.map((key) => (
                                <div
                                    key={key}
                                    className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3 font-mono text-sm text-white/60"
                                >
                                    <span>{t(`sources.${key}`)}</span>
                                    <ArrowRight className="h-3 w-3 text-white/20" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Orchestration Engine */}
                    <div className="rounded-xl border border-nyembo-gold/20 bg-nyembo-gold/[0.02] p-6">
                        <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-nyembo-gold mb-6">
                            {t("orchestrationTitle")}
                        </h3>
                        <div className="space-y-3">
                            {orchKeys.map((key) => (
                                <div
                                    key={key}
                                    className="flex items-center gap-3 rounded-lg border border-nyembo-gold/10 bg-nyembo-gold/[0.03] px-4 py-3 font-mono text-sm text-nyembo-gold/70"
                                >
                                    <div className="h-1.5 w-1.5 rounded-full bg-nyembo-gold" />
                                    <span>{t(`orchestrationItems.${key}`)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Telemetry Output */}
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
                        <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400 mb-6">
                            {t("telemetryTitle")}
                        </h3>
                        <div className="space-y-3">
                            {telKeys.map((key) => (
                                <div
                                    key={key}
                                    className="flex items-center gap-3 rounded-lg border border-emerald-500/10 bg-emerald-500/[0.02] px-4 py-3 font-mono text-sm text-emerald-400/70"
                                >
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                    <span>{t(`telemetryItems.${key}`)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
