"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingFooter } from "@/components/landing/landing-footer";

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.includes("/admin");
    const isPortal = pathname?.includes("/portal");

    // Detect home page: /en, /sw, /de, or just /
    const isHome = pathname ? /^\/(en|sw|de)?\/?$/.test(pathname) : false;

    if (isAdmin || isPortal) {
        return <>{children}</>;
    }

    if (isHome) {
        return (
            <>
                <LandingNavbar />
                <main className="min-h-screen">{children}</main>
                <LandingFooter />
            </>
        );
    }

    return (
        <>
            <Sidebar />
            <div className="flex flex-col min-h-screen md:pl-28 lg:pl-32 transition-all duration-300">
                <main className="flex-1 pr-4 lg:pr-8 pt-6">
                    {children}
                </main>
                <Footer />
            </div>
        </>
    );
}
