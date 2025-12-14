"use client";

import { useAcademyData } from "@/hooks/use-academy-data";
import { AcademyHero } from "@/components/academy/hero";
import { ProgramTabs } from "@/components/academy/program-tabs";
import { CTARibbon } from "@/components/academy/cta-ribbon";
import { Loader2 } from "lucide-react";

export default function AcademyPage() {
    const { programs, loading } = useAcademyData();

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-nyembo-sky animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-black pb-32">
            <AcademyHero />
            <ProgramTabs programs={programs} />
            <CTARibbon />
        </main>
    );
}
