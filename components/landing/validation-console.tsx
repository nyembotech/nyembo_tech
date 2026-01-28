"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const lineKeys = ["init", "check", "deploy", "mesh", "telemetry", "ready", "latency"] as const;

export function ValidationConsole() {
    const t = useTranslations("Landing.validation");
    const [visibleLines, setVisibleLines] = useState(0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    let count = 0;
                    const interval = setInterval(() => {
                        count++;
                        setVisibleLines(count);
                        if (count >= lineKeys.length) clearInterval(interval);
                    }, 400);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );

        const el = document.getElementById("validation-console");
        if (el) observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section className="relative py-24">
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

                {/* Terminal */}
                <div
                    id="validation-console"
                    className="rounded-xl border border-white/10 bg-black/80 overflow-hidden"
                >
                    {/* Terminal header */}
                    <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
                        <div className="h-3 w-3 rounded-full bg-red-500/80" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                        <div className="h-3 w-3 rounded-full bg-green-500/80" />
                        <span className="ml-3 font-mono text-[11px] text-white/30">terminal — nyembo-cli</span>
                    </div>

                    {/* Terminal body */}
                    <div className="p-6 font-mono text-sm space-y-2 min-h-[280px]">
                        {lineKeys.map((key, index) => {
                            const line = t(`lines.${key}`);
                            const isCommand = line.startsWith("$");
                            const isSuccess = line.startsWith("✓");
                            const isInfo = line.startsWith("→");

                            return (
                                <div
                                    key={key}
                                    className={`transition-all duration-300 ${
                                        index < visibleLines ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                                    }`}
                                >
                                    <span
                                        className={
                                            isCommand
                                                ? "text-white"
                                                : isSuccess
                                                ? "text-emerald-400"
                                                : isInfo
                                                ? "text-nyembo-gold"
                                                : "text-white/50"
                                        }
                                    >
                                        {line}
                                    </span>
                                </div>
                            );
                        })}
                        {/* Blinking cursor */}
                        {visibleLines >= lineKeys.length && (
                            <div className="flex items-center gap-1 mt-2">
                                <span className="text-white/40">$</span>
                                <span className="h-4 w-2 bg-nyembo-gold animate-terminal-blink" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
