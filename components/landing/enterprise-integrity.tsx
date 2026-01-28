"use client";

import { useTranslations } from "next-intl";
import { Shield } from "lucide-react";

const statKeys = ["requests", "uptime", "latency"] as const;

export function EnterpriseIntegrity() {
    const t = useTranslations("Landing.enterprise");

    return (
        <section id="enterprise" className="relative py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="mb-16">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-nyembo-gold">
                        {t("label")}
                    </span>
                    <h2 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white">
                        {t("title")}
                    </h2>
                    <p className="mt-4 max-w-xl text-base text-white/40">
                        {t("subtitle")}
                    </p>
                </div>

                <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-start">
                    {/* Stats grid */}
                    <div className="grid sm:grid-cols-3 gap-6">
                        {statKeys.map((key) => (
                            <div
                                key={key}
                                className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center"
                            >
                                <p className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                                    {t(`stats.${key}.value`)}
                                </p>
                                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                                    {t(`stats.${key}.label`)}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Encryption badge */}
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-6 text-center min-w-[200px]">
                        <div className="inline-flex rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 mb-4">
                            <Shield className="h-6 w-6 text-emerald-400" />
                        </div>
                        <p className="text-xl font-bold text-white font-mono">{t("encryption")}</p>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                            {t("encryptionLabel")}
                        </p>
                        <p className="mt-4 text-xs text-white/30">
                            {t("compliance")}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
