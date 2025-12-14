"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useProjects } from "@/hooks/firestore/use-projects";
import { ProjectHierarchyView } from "@/components/admin/projects/project-hierarchy-view";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function ProjectDetailsPage() {
    const params = useParams();
    const projectId = params?.id as string;
    const { projects, loading } = useProjects();

    // In a real app we'd fetch a single doc, but useProjects caches so this is fine for now
    const project = projects?.find(p => p.id === projectId);

    if (loading) return <div className="p-8 text-white">Loading Mission Data...</div>;
    if (!project) return <div className="p-8 text-white">Project not found or access denied.</div>;

    return (
        <div className="p-6 space-y-6 min-h-screen">
            <Link href="/admin/projects" className="inline-flex items-center text-sm text-muted-foreground hover:text-white transition-colors mb-4">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Projects
            </Link>

            <ProjectHierarchyView project={project} />
        </div>
    );
}
