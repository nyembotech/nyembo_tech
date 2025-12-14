"use client";

import { useAuth } from "@/hooks/use-auth";
import { useProjects } from "@/hooks/firestore/use-projects";
import { useTicketsForCustomer } from "@/hooks/firestore/use-tickets";
import { useCustomer } from "@/hooks/firestore/use-customers";
import { HeroPanel } from "@/components/portal/hero-panel";
import { ProjectsCard } from "@/components/portal/projects-card";
import { TicketsCard } from "@/components/portal/tickets-card";
import { MilestonesCard } from "@/components/portal/milestones-card";
import { InsightDeck } from "@/components/portal/insight-deck"; // Keep this mocked for now or implement if needed
import { Loader2 } from "lucide-react";
import { WelcomeTour } from "@/components/portal/welcome-tour";
import { RecentActivityFeed } from "@/components/portal/recent-activity";

export default function PortalPage() {
    const { user, profile } = useAuth();

    // We assume profile.customerId is set for customer users
    const customerId = profile?.customerId;

    const { customer, loading: customerLoading } = useCustomer(customerId);
    const { projects, loading: projectsLoading } = useProjects({ customerId }, { enabled: !!customerId });
    const { tickets, loading: ticketsLoading } = useTicketsForCustomer(customerId);

    const loading = customerLoading || projectsLoading || ticketsLoading;

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-nyembo-sky" />
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <WelcomeTour />

            {/* Hero Panel */}
            <HeroPanel customerName={customer?.name || "Valued Customer"} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content - 3 cols */}
                <div className="lg:col-span-3 grid md:grid-cols-3 gap-8">
                    <ProjectsCard projects={projects} />
                    <TicketsCard tickets={tickets} openCount={tickets.filter(t => t.status !== 'resolved' && t.status !== 'closed').length} />
                    <MilestonesCard milestones={[]} />
                </div>

                {/* Sidebar - 1 col */}
                <div className="space-y-8">
                    <RecentActivityFeed customerId={customerId} />
                </div>
            </div>

            {/* Insight Cards (Horizontal Scroll) - Mocked for now */}
            <InsightDeck insights={[
                { id: 1, title: "Efficiency Up", statistic: "+15%", description: "System optimization results" },
                { id: 2, title: "Response Time", statistic: "1.2h", description: "Average support response" },
            ]} />
        </div>
    );
}
