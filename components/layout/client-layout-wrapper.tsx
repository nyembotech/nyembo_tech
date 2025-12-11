"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <Sidebar />
            <main className="flex-1 pl-28 lg:pl-32 pr-4 lg:pr-8 pt-6">
                {children}
            </main>
            <Footer />
        </>
    );
}
