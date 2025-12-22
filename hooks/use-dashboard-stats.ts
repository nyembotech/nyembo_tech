"use client";

import { useProjects } from "@/hooks/firestore/use-projects";
import { useAllTickets } from "@/hooks/firestore/use-tickets";
import { useActivity } from "@/hooks/firestore/use-activity";
import { useMemo } from "react";

export interface DashboardStats {
    activeProjects: number;
    openTickets: number;
    recentActivity: number;
    projectsByStatus: Record<string, number>;
}

/**
 * Hook to fetch real-time dashboard statistics from Firestore.
 * Uses org-scoped queries via the underlying hooks.
 */
export function useDashboardStats() {
    const { projects, loading: projectsLoading } = useProjects();
    const { tickets, loading: ticketsLoading } = useAllTickets();
    const { activities, loading: activityLoading } = useActivity({}, { enabled: true });

    const loading = projectsLoading || ticketsLoading || activityLoading;

    const stats = useMemo<DashboardStats>(() => {
        const activeProjects = projects.filter(p =>
            p.status === 'in-progress' || p.status === 'review'
        ).length;

        const openTickets = tickets.filter(t =>
            t.status === 'open' || t.status === 'in-progress'
        ).length;

        const projectsByStatus = projects.reduce((acc, p) => {
            acc[p.status] = (acc[p.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            activeProjects,
            openTickets,
            recentActivity: activities.length,
            projectsByStatus,
        };
    }, [projects, tickets, activities]);

    return {
        stats,
        projects,
        tickets,
        activities,
        loading,
    };
}

/**
 * Format relative time for display
 */
export function formatRelativeTime(date: Date | { toDate: () => Date } | undefined): string {
    if (!date) return 'Unknown';

    const d = 'toDate' in date ? date.toDate() : date;
    const now = new Date();
    const diff = now.getTime() - d.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return d.toLocaleDateString();
}
