"use client";

import { FuturisticPanel } from "@/components/ui/futuristic-panel";
import { Bot, Cloud, LayoutTemplate, Building2 } from "lucide-react";

const solutions = [
    {
        title: "AI Agents",
        subtitle: "Autonomous digital workers that handle complex workflows, customer support, and data analysis 24/7.",
        icon: Bot,
        variant: "primary" as const,
    },
    {
        title: "Cloud Modernization",
        subtitle: "Migrate legacy systems to scalable, serverless architectures optimized for performance and cost.",
        icon: Cloud,
        variant: "ghost" as const,
    },
    {
        title: "Modern Workplaces",
        subtitle: "Unified collaboration platforms and internal tools that empower your workforce to do their best work.",
        icon: LayoutTemplate,
        variant: "ghost" as const,
    },
    {
        title: "Smart Spaces",
        subtitle: "IoT integration for intelligent buildings that optimize energy, security, and occupant comfort.",
        icon: Building2,
        variant: "accent" as const,
    },
];

export function SolutionsGrid() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Our Core Pillars</h2>
                    <p className="text-muted-foreground text-lg">
                        Comprehensive technology solutions designed to propel African enterprises into the future.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {solutions.map((solution, index) => (
                        <FuturisticPanel
                            key={index}
                            title={solution.title}
                            subtitle={solution.subtitle}
                            icon={solution.icon}
                            variant={solution.variant}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
