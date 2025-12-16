"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useProjects } from "@/hooks/firestore/use-projects";
import { ProjectHierarchyView } from "@/components/admin/projects/project-hierarchy-view";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DocumentVault } from "@/components/projects/document-vault";

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

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">{project.title}</h1>
                    <p className="text-muted-foreground">{project.customerName}</p>
                </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-white/5 border border-white/10 p-1">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="documents">
                        Secure Vault <Badge className="ml-2 bg-nyembo-sky/20 text-nyembo-sky border-0">NEW</Badge>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                    <ProjectHierarchyView project={project} />
                </TabsContent>

                <TabsContent value="documents" className="mt-6">
                    <DocumentVault
                        projectId={params.id as string}
                        customerId={project.customerId || ""}
                        userRole="admin"
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
