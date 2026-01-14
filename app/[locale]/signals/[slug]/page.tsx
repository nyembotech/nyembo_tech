"use client";

import { useRef, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight, Clock, ShieldCheck, Activity, Users, Zap, TrendingUp, Lock } from "lucide-react";
import { useScroll, useTransform, motion } from "framer-motion";

// --- Types ---
type ProjectItem = {
    id: string;
    title: string;
    client: string;
    status: "Completed" | "In Progress" | "Live";
    metric: string;
    date: string;
};

type SignalConfig = {
    title: string;
    subtitle: string;
    description: string;
    icon: React.ElementType; // Lucide icon
    image: string;
    color: string;
    accent: string;
    stats: { label: string; value: string }[];
    projects: ProjectItem[];
};

// --- Mock Data ---
const SIGNALS_DATA: Record<string, SignalConfig> = {
    "ai-usage": {
        title: "AI Usage",
        subtitle: "Enterprise Applications",
        description: "Over 50% of critical application flows are now handled autonomously by our AI agents, reducing latency and error rates.",
        icon: Zap,
        image: "/assets/images/signals/ai-usage.png",
        color: "text-fuchsia-400",
        accent: "bg-fuchsia-500",
        stats: [
            { label: "Flows Autom.", value: "54%" },
            { label: "Daily Ops", value: "12k+" },
            { label: "Accuracy", value: "99.9%" },
        ],
        projects: [
            { id: "1", title: "Smart Logistics Routing", client: "TransGlobal", status: "Live", metric: "30% faster delivery", date: "Oct 2025" },
            { id: "2", title: "Customer Support L1 Agent", client: "FinTech Corp", status: "Live", metric: "80% ticket deflection", date: "Sep 2025" },
            { id: "3", title: "Predictive Maintainance", client: "EnergyCo", status: "In Progress", metric: "Est. $2M savings", date: "Nov 2025" },
        ]
    },
    "automation": {
        title: "Automation",
        subtitle: "Workflow Efficiency",
        description: "Seamless orchestration of repetitive tasks across your infrastructure. Our bots handle the mundane so your team handles the extraordinary.",
        icon: Activity,
        image: "/assets/images/signals/automation.png",
        color: "text-cyan-400",
        accent: "bg-cyan-500",
        stats: [
            { label: "Processes", value: "70%" },
            { label: "Man-hours Saved", value: "40k/mo" },
            { label: "ROI", value: "14x" },
        ],
        projects: [
            { id: "4", title: "Invoice Processing Pipeline", client: "Global Retail", status: "Completed", metric: "99.8% precision", date: "Aug 2025" },
            { id: "5", title: "Employee Onboarding Flow", client: "TechGiant", status: "Live", metric: "2 day reduction", date: "Dec 2025" },
            { id: "6", title: "Data Reconciliation Bot", client: "BankTrust", status: "Completed", metric: "0 manual errors", date: "July 2025" },
        ]
    },
    "satisfaction": {
        title: "Satisfaction",
        subtitle: "User Love Score",
        description: "We measure success by the smiles of our users. Our shipped products consistently rank in the top percentile for user experience.",
        icon: Users,
        image: "/assets/images/signals/satisfaction.png",
        color: "text-pink-400",
        accent: "bg-pink-500",
        stats: [
            { label: "Love Score", value: "92%" },
            { label: "NPS", value: "+78" },
            { label: "Retention", value: "98%" },
        ],
        projects: [
            { id: "7", title: "Mobile App Redesign", client: "NeoBank", status: "Published", metric: "4.9 App Store Rating", date: "Oct 2025" },
            { id: "8", title: "Self-Service Portal", client: "TelecomX", status: "Live", metric: "45% less complaints", date: "Nov 2025" },
            { id: "9", title: "Agent Dashboard", client: "ServiceHub", status: "Published", metric: "User choice award", date: "Aug 2025" },
        ]
    },
    "reliability": {
        title: "Reliability",
        subtitle: "Platform Uptime",
        description: "Mission-critical stability is non-negotiable. Our managed platforms maintain an industry-leading 99.8% uptime SLA.",
        icon: ShieldCheck,
        image: "/assets/images/signals/reliability.png",
        color: "text-emerald-400",
        accent: "bg-emerald-500",
        stats: [
            { label: "Uptime", value: "99.8%" },
            { label: "Incidents", value: "0 Major" },
            { label: "Response", value: "<15ms" },
        ],
        projects: [
            { id: "10", title: "Core Banking Migration", client: "Regional Bank", status: "Completed", metric: "0 downtime", date: "Jan 2026" },
            { id: "11", title: "Cloud Scale-Out", client: "StreamingSvc", status: "Live", metric: "10M+ concurrent", date: "Dec 2025" },
            { id: "12", title: "Security Audit Upgrade", client: "GovTech", status: "Completed", metric: "ISO 27001 Certified", date: "Sep 2025" },
        ]
    }
};

export default function SignalPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const data = SIGNALS_DATA[slug as string] || SIGNALS_DATA["ai-usage"]; // Fallback or handle 404

    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    return (
        <main ref={containerRef} className="relative min-h-screen bg-[#030912] text-white overflow-hidden selection:bg-white/20">
            {/* Background Effects */}
            <div className={`pointer-events-none absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b ${data.color.replace('text-', 'from-')}/10 to-transparent blur-3xl opacity-30`} />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-24">
                {/* Header */}
                <header className="mb-16">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-8 group">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Back to Command Center
                    </Link>

                    <div className="flex flex-col lg:flex-row gap-8 lg:items-end justify-between">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-4 mb-4">
                                <span className={`inline-flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 ${data.color}`}>
                                    <data.icon className="w-6 h-6" />
                                </span>
                                <span className={`text-sm font-bold tracking-widest uppercase ${data.color}`}>{data.subtitle}</span>
                            </div>
                            <h1 className="text-4xl lg:text-7xl font-bold tracking-tight text-white mb-6">
                                {data.title} <span className="text-white/20">Signals</span>
                            </h1>
                            <p className="text-xl text-white/60 leading-relaxed max-w-xl">
                                {data.description}
                            </p>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full" />
                            <Image
                                src={data.image}
                                alt={data.title}
                                width={180}
                                height={180}
                                className="relative z-10 w-40 h-40 lg:w-48 lg:h-48 object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
                    {data.stats.map((stat, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                            <p className="text-white/40 text-sm font-medium uppercase tracking-wider mb-1">{stat.label}</p>
                            <p className="text-3xl lg:text-4xl font-bold text-white">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Projects Section */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-semibold text-white">Recent Projects</h2>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="hidden sm:flex border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10">
                                Filter by Date
                            </Button>
                            <Button size="sm" className={`${data.accent} text-white border-none hover:opacity-90`}>
                                <Plus className="w-4 h-4 mr-2" /> New Entry
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {data.projects.map((project) => (
                            <div key={project.id} className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-full bg-white/5 ${data.color} mt-1 sm:mt-0`}>
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white group-hover:text-white/90 transition-colors">{project.title}</h3>
                                        <p className="text-sm text-white/50">Client: {project.client} • {project.date}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pl-14 sm:pl-0">
                                    <div className="flex flex-col sm:items-end">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${project.status === 'Live' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${project.status === 'Live' ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'}`} />
                                            {project.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-col sm:items-end min-w-[120px]">
                                        <p className="text-sm font-medium text-white/80">{project.metric}</p>
                                        <p className="text-xs text-white/40">Key Result</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-white/40 hover:text-white hover:bg-white/10 rounded-full">
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}

// Importing Button locally if strictly needed or assume standard UI
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from 'react';
