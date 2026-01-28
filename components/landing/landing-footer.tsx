"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export function LandingFooter() {
    const t = useTranslations("Landing.footer");
    const params = useParams();
    const locale = (params.locale as string) || "en";

    const columns = [
        {
            title: t("product"),
            links: [
                { label: t("productLinks.infrastructure"), href: "#infrastructure" },
                { label: t("productLinks.deployment"), href: "#deployment" },
                { label: t("productLinks.security"), href: "#enterprise" },
                { label: t("productLinks.telemetry"), href: "#enterprise" },
            ],
        },
        {
            title: t("developers"),
            links: [
                { label: t("developerLinks.docs"), href: `/${locale}/docs` },
                { label: t("developerLinks.api"), href: `/${locale}/docs` },
                { label: t("developerLinks.sdks"), href: `/${locale}/docs` },
                { label: t("developerLinks.status"), href: `/${locale}/status` },
            ],
        },
        {
            title: t("company"),
            links: [
                { label: t("companyLinks.about"), href: `/${locale}/about` },
                { label: t("companyLinks.careers"), href: `/${locale}/about` },
                { label: t("companyLinks.blog"), href: `/${locale}/knowledge` },
                { label: t("companyLinks.contact"), href: `/${locale}/about` },
            ],
        },
        {
            title: t("legal"),
            links: [
                { label: t("legalLinks.privacy"), href: `/${locale}/privacy` },
                { label: t("legalLinks.terms"), href: `/${locale}/terms` },
                { label: t("legalLinks.security"), href: `/${locale}/security` },
            ],
        },
    ];

    return (
        <footer className="relative border-t border-white/5 bg-[#030305]">
            {/* Top CTA bar */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <Image
                        src="/assets/images/logo/logo.png"
                        alt="Nyembotech"
                        width={32}
                        height={32}
                        className="h-8 w-8 object-contain"
                    />
                    <span className="text-sm font-bold tracking-wider text-white">
                        NYEMBO<span className="text-nyembo-gold">TECH</span>
                    </span>
                </div>
                <Link
                    href={`/${locale}/login`}
                    className="rounded-lg bg-nyembo-gold px-6 py-3 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-nyembo-gold/90 hover:shadow-[0_0_20px_rgba(249,168,37,0.3)]"
                >
                    {t("startBuilding")}
                </Link>
            </div>

            {/* Link columns */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                {columns.map((col) => (
                    <div key={col.title}>
                        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">
                            {col.title}
                        </p>
                        <ul className="space-y-3">
                            {col.links.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/50 transition-colors hover:text-white"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Bottom bar */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-white/30">{t("copyright")}</p>
                <p className="text-xs text-white/30 font-mono tracking-widest">{t("tagline")}</p>
            </div>
        </footer>
    );
}
