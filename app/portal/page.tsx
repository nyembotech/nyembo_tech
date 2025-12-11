"use client";

import { usePortalData } from "@/hooks/use-portal-data";
import { HeroPanel } from "@/components/portal/hero-panel";
import { ProjectsCard } from "@/components/portal/projects-card";
import { TicketsCard } from "@/components/portal/tickets-card";
import { MilestonesCard } from "@/components/portal/milestones-card";
import { InsightDeck } from "@/components/portal/insight-deck";
import { Loader2 } from "lucide-react";

export default function PortalPage() {
    const { data, loading } = usePortalData();

    if (loading || !data) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-nyembo-sky" />
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Hero Panel */}
            <HeroPanel customerName={data.customerName} />

            {/* Main Floating Cards */}
            <div className="grid md:grid-cols-3 gap-8">
                <ProjectsCard projects={data.projects} />
                <TicketsCard tickets={data.tickets} openCount={data.openTicketCount} />
                <MilestonesCard milestones={data.milestones} />
            </div>

            {/* Insight Cards (Horizontal Scroll) */}
            <InsightDeck insights={data.insights} />
        </div>
    );
}
