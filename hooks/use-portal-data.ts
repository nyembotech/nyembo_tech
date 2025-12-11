"use client";

import { useState, useEffect } from "react";

export interface Project {
    id: number;
    name: string;
    status: "Discovery" | "Build" | "Testing" | "Launch";
    progress: number;
    milestone: string;
}

export interface Ticket {
    id: string;
    title: string;
    status: "In Progress" | "Resolved" | "Open";
}

export interface Milestone {
    id: number;
    title: string;
    date: string;
    isCompleted: boolean;
}

export interface Insight {
    id: number;
    title: string;
    description: string;
    statistic: string;
}

export function usePortalData() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{
        customerName: string;
        projects: Project[];
        tickets: Ticket[];
        openTicketCount: number;
        milestones: Milestone[];
        insights: Insight[];
    } | null>(null);

    useEffect(() => {
        // Simulate API fetch
        const timer = setTimeout(() => {
            setData({
                customerName: "Alex",
                projects: [
                    {
                        id: 1,
                        name: "Project Phoenix",
                        status: "Build",
                        progress: 65,
                        milestone: "Core API Integration",
                    },
                ],
                tickets: [
                    { id: "#1024", title: "API Latency", status: "In Progress" },
                    { id: "#1021", title: "User Auth", status: "Resolved" },
                ],
                openTicketCount: 2,
                milestones: [
                    { id: 1, title: "Beta Launch", date: "Nov 15, 2025", isCompleted: true },
                    { id: 2, title: "Full Release", date: "Dec 01, 2025", isCompleted: false },
                ],
                insights: [
                    {
                        id: 1,
                        title: "AI Efficiency",
                        description: "Saved approx. 12 hours of human time.",
                        statistic: "AI agent deflected 73% of support chats this week.",
                    },
                    {
                        id: 2,
                        title: "System Uptime",
                        description: "No downtime recorded in the last 30 days.",
                        statistic: "99.99% operational status maintained.",
                    },
                    {
                        id: 3,
                        title: "User Growth",
                        description: "New user signups are trending upwards.",
                        statistic: "+15% increase in active users this month.",
                    },
                ],
            });
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return { data, loading };
}
