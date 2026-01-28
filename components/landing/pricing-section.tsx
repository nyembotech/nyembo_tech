"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";

const tiers = [
    { key: "developer", highlighted: false },
    { key: "professional", highlighted: true },
    { key: "enterprise", highlighted: false },
] as const;

export function PricingSection() {
    const t = useTranslations("Landing.pricing");
    const params = useParams();
    const locale = (params.locale as string) || "en";

    return (
        <section id="pricing" className="relative py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="mb-16 text-center">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-nyembo-gold">
                        {t("label")}
                    </span>
                    <h2 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white">
                        {t("title")}
                    </h2>
                    <p className="mt-4 max-w-xl mx-auto text-base text-white/40">
                        {t("subtitle")}
                    </p>
                </div>

                {/* Pricing cards */}
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {tiers.map((tier) => {
                        const features: string[] = t.raw(`${tier.key}.features`);
                        const hasBadge = tier.key === "professional";

                        return (
                            <div
                                key={tier.key}
                                className={`relative rounded-xl border p-8 flex flex-col transition-all ${
                                    tier.highlighted
                                        ? "border-nyembo-gold/30 bg-nyembo-gold/[0.03]"
                                        : "border-white/10 bg-white/[0.02]"
                                }`}
                            >
                                {hasBadge && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="rounded-full bg-nyembo-gold px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black">
                                            {t("professional.badge")}
                                        </span>
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-white">
                                        {t(`${tier.key}.name`)}
                                    </h3>
                                    <p className="mt-1 text-sm text-white/40">
                                        {t(`${tier.key}.description`)}
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <span className="text-4xl font-black text-white">
                                        {t(`${tier.key}.price`)}
                                    </span>
                                    {t(`${tier.key}.period`) && (
                                        <span className="text-sm text-white/40 ml-1">
                                            {t(`${tier.key}.period`)}
                                        </span>
                                    )}
                                </div>

                                <ul className="space-y-3 mb-8 flex-1">
                                    {features.map((feature: string) => (
                                        <li key={feature} className="flex items-center gap-3">
                                            <div className={`flex h-5 w-5 items-center justify-center rounded-full ${
                                                tier.highlighted ? "bg-nyembo-gold/10" : "bg-white/5"
                                            }`}>
                                                <Check className={`h-3 w-3 ${
                                                    tier.highlighted ? "text-nyembo-gold" : "text-white/40"
                                                }`} />
                                            </div>
                                            <span className="text-sm text-white/60">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={`/${locale}/login`}
                                    className={`block w-full rounded-lg py-3 text-center text-xs font-bold uppercase tracking-widest transition-all ${
                                        tier.highlighted
                                            ? "bg-nyembo-gold text-black hover:bg-nyembo-gold/90 hover:shadow-[0_0_20px_rgba(249,168,37,0.3)]"
                                            : "border border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                                    }`}
                                >
                                    {t(`${tier.key}.cta`)}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
