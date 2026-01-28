"use client";

import { useTranslations } from "next-intl";
import { Database, Cpu, Shield, BarChart3 } from "lucide-react";

const primitives = [
    { key: "dataIngestion", icon: Database, color: "text-blue-400", borderHover: "hover:border-blue-400/30" },
    { key: "coreProcessing", icon: Cpu, color: "text-nyembo-gold", borderHover: "hover:border-nyembo-gold/30" },
    { key: "securityMesh", icon: Shield, color: "text-emerald-400", borderHover: "hover:border-emerald-400/30" },
    { key: "telemetry", icon: BarChart3, color: "text-purple-400", borderHover: "hover:border-purple-400/30" },
];

export function InfrastructurePrimitives() {
    const t = useTranslations("Landing.primitives");

    return (
        <section id="infrastructure" className="relative py-24">
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

                {/* 4-card grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {primitives.map((p) => (
                        <div
                            key={p.key}
                            className={`group rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 ${p.borderHover} hover:bg-white/[0.04]`}
                        >
                            <div className={`inline-flex rounded-lg border border-white/10 bg-white/[0.03] p-3 ${p.color}`}>
                                <p.icon className="h-5 w-5" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-white">
                                {t(`${p.key}.title`)}
                            </h3>
                            <p className="mt-2 text-sm text-white/40 leading-relaxed">
                                {t(`${p.key}.description`)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
