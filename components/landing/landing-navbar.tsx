"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";

const navLinks = [
    { key: "infrastructure", href: "#infrastructure" },
    { key: "deployment", href: "#deployment" },
    { key: "enterprise", href: "#enterprise" },
    { key: "pricing", href: "#pricing" },
    { key: "docs", href: "/docs" },
];

export function LandingNavbar() {
    const t = useTranslations("Landing.navbar");
    const params = useParams();
    const locale = (params.locale as string) || "en";
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#030305]/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href={`/${locale}`} className="flex items-center gap-2">
                    <Image
                        src="/assets/images/logo/logo.png"
                        alt="Nyembotech"
                        width={36}
                        height={36}
                        className="h-9 w-9 object-contain"
                    />
                    <span className="text-sm font-bold tracking-wider text-white">
                        NYEMBO<span className="text-nyembo-gold">TECH</span>
                    </span>
                </Link>

                {/* Center links - desktop */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.key}
                            href={link.href}
                            className="text-xs font-medium uppercase tracking-widest text-white/50 transition-colors hover:text-white"
                        >
                            {t(link.key)}
                        </a>
                    ))}
                </div>

                {/* Right side - desktop */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        href={`/${locale}/login`}
                        className="text-xs font-medium uppercase tracking-widest text-white/50 transition-colors hover:text-white"
                    >
                        {t("login")}
                    </Link>
                    <Link
                        href={`/${locale}/login`}
                        className="rounded-lg bg-nyembo-gold px-4 py-2 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-nyembo-gold/90 hover:shadow-[0_0_20px_rgba(249,168,37,0.3)]"
                    >
                        {t("startBuilding")}
                    </Link>
                </div>

                {/* Mobile toggle */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden p-2 text-white/60 hover:text-white"
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-white/5 bg-[#030305]/95 backdrop-blur-xl px-4 py-6 space-y-4">
                    {navLinks.map((link) => (
                        <a
                            key={link.key}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="block text-sm font-medium uppercase tracking-widest text-white/60 hover:text-white py-2"
                        >
                            {t(link.key)}
                        </a>
                    ))}
                    <div className="pt-4 border-t border-white/10 space-y-3">
                        <Link
                            href={`/${locale}/login`}
                            className="block text-sm font-medium uppercase tracking-widest text-white/60 hover:text-white py-2"
                        >
                            {t("login")}
                        </Link>
                        <Link
                            href={`/${locale}/login`}
                            className="block w-full rounded-lg bg-nyembo-gold px-4 py-3 text-center text-sm font-bold uppercase tracking-widest text-black"
                        >
                            {t("startBuilding")}
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
