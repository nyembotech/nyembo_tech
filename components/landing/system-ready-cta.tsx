"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

export function SystemReadyCta() {
    const t = useTranslations("Landing.cta");
    const params = useParams();
    const locale = (params.locale as string) || "en";

    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background aurora */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] animate-aurora-pulse"
                    style={{
                        background:
                            "radial-gradient(ellipse at center, rgba(249,168,37,0.1) 0%, transparent 60%)",
                    }}
                />
            </div>

            <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white">
                    {t("titleLine1")}
                    <br />
                    <span className="text-nyembo-gold text-glow-orange">{t("titleLine2")}</span>
                </h2>
                <p className="mt-6 text-base sm:text-lg text-white/40 max-w-xl mx-auto">
                    {t("subtitle")}
                </p>

                {/* Terminal mockup */}
                <div className="mt-10 mx-auto max-w-md rounded-xl border border-white/10 bg-black/80 overflow-hidden">
                    <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <div className="p-4 font-mono text-sm text-white/60">
                        <span className="text-nyembo-gold">{t("terminalLine")}</span>
                        <span className="ml-1 inline-block h-4 w-2 bg-nyembo-gold animate-terminal-blink" />
                    </div>
                </div>

                {/* CTA button */}
                <div className="mt-10">
                    <Link
                        href={`/${locale}/login`}
                        className="group inline-flex items-center gap-2 rounded-lg bg-nyembo-gold px-8 py-4 text-sm font-bold uppercase tracking-widest text-black transition-all hover:bg-nyembo-gold/90 hover:shadow-[0_0_40px_rgba(249,168,37,0.4)]"
                    >
                        {t("buttonText")}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
