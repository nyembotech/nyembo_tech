"use client";

import { use, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KanbanBoard } from "@/components/admin/kanban/board";
import { ApprovalsList } from "@/components/portal/approvals-list";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrapping params properly for Next.js 15+
    const unwrappedParams = use(params);
    const projectId = unwrappedParams.id;

    // In a real implementation, fetch project data here using the ID
    // const { project } = useProject(projectId);

    // Mock Project Data
    const project = {
        id: projectId,
        title: "Platform Migration v2",
        status: "active",
        progress: 65,
        dueDate: "Dec 30, 2024",
        description: "Migration of legacy monolith to microservices architecture with Next.js frontend."
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">{project.title}</h1>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20">
                            {project.status.toUpperCase()}
                        </Badge>
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" /> Due: {project.dueDate}
                        </span>
                    </div>
                </div>
                <div className="text-right hidden md:block">
                    <div className="text-2xl font-bold text-nyembo-sky">{project.progress}%</div>
                    <div className="text-xs text-muted-foreground">Completion</div>
                </div>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="progress" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-[400px] mb-8 bg-white/5 border border-white/10">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="progress">Progress</TabsTrigger>
                    <TabsTrigger value="approvals">Approvals</TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-6">
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle>Project Scope</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                {project.description}
                            </p>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-blue-400" /> Recent Updates
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="border-l-2 border-white/10 pl-4 py-1">
                                    <p className="text-sm text-white font-medium">Phase 1 Complete</p>
                                    <p className="text-xs text-muted-foreground">2 days ago</p>
                                </div>
                                <div className="border-l-2 border-white/10 pl-4 py-1">
                                    <p className="text-sm text-white font-medium">Design Mockups Uploaded</p>
                                    <p className="text-xs text-muted-foreground">4 days ago</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-yellow-400" /> Attention Items
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                                    <li>Review homepage copy</li>
                                    <li>Confirm stripe credentials</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* PROGRESS TAB (KANBAN) */}
                <TabsContent value="progress" className="h-[600px]">
                    <KanbanBoard
                        isReadOnly={true}
                        title="Live Project Board"
                        description="Real-time view of development tasks."
                        className="bg-transparent"
                    />
                </TabsContent>

                {/* APPROVALS TAB */}
                <TabsContent value="approvals">
                    <div className="max-w-3xl">
                        <h3 className="text-xl font-semibold mb-4 text-white">Pending Approvals</h3>
                        <ApprovalsList />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
