"use client";

import { useEffect, useState } from "react";
import { Project, Epic, Task } from "@/types/firestore";
import { useEpics, useProjectStories } from "@/hooks/firestore/use-hierarchy"; // Hypothetical hooks I need to create
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, CircleDashed, AlertCircle } from "lucide-react";

interface ProjectHierarchyViewProps {
    project: Project;
}

export function ProjectHierarchyView({ project }: ProjectHierarchyViewProps) {
    // This component assumes we have hooks to fetch Epics and Stories for a specific project.
    // I will need to implement these hooks or fetch logic here.
    // For now, I'll mock the hook usage pattern.

    // FETCHING LOGIC PLACEHOLDER
    // const { epics } = useEpics(project.id);
    // const { stories } = useProjectStories(project.id);

    // MOCK DATA for now to visualize structure
    const epics: Epic[] = [
        { id: "e1", title: "Phase 1: Core", status: "completed", priority: "high", projectId: project.id } as Epic,
        { id: "e2", title: "Phase 2: AI", status: "in-progress", priority: "critical", projectId: project.id } as Epic,
        { id: "e3", title: "Phase 3: Frontend", status: "planning", priority: "medium", projectId: project.id } as Epic,
    ];

    const stories: Task[] = [
        { id: "s1", title: "Setup Auth", status: "done", epicId: "e1", type: "story", storyPoints: 5 } as Task,
        { id: "s2", title: "Database Schema", status: "done", epicId: "e1", type: "task", storyPoints: 3 } as Task,
        { id: "s3", title: "Connect OpenAI", status: "in-progress", epicId: "e2", type: "story", storyPoints: 8 } as Task,
        { id: "s4", title: "Design Login Page", status: "todo", epicId: "e3", type: "story", storyPoints: 3 } as Task,
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        {project.title}
                        <Badge variant="outline" className="border-nyembo-gold text-nyembo-gold">
                            {project.status}
                        </Badge>
                    </h2>
                    <p className="text-muted-foreground">{project.description}</p>
                </div>
            </div>

            {/* EPICS ROW (Horizontal Scroll) */}
            <ScrollArea className="w-full whitespace-nowrap rounded-md pb-4">
                <div className="flex space-x-6 p-1">
                    {epics.map((epic) => (
                        <div key={epic.id} className="w-[350px] shrink-0">
                            {/* EPIC CARD */}
                            <div className="glass-neumo rounded-xl p-4 min-h-[400px] flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-lg text-white whitespace-normal">{epic.title}</h3>
                                    <Badge className={cn(
                                        "capitalize",
                                        epic.status === "in-progress" ? "bg-emerald-500/20 text-emerald-400" :
                                            epic.status === "completed" ? "bg-purple-500/20 text-purple-400" :
                                                "bg-blue-500/20 text-blue-400"
                                    )}>
                                        {epic.status}
                                    </Badge>
                                </div>

                                {/* STORIES LIST (Nested) */}
                                <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                                    {stories.filter(s => s.epicId === epic.id).map((story) => (
                                        <div key={story.id} className="bg-[#121214] p-3 rounded-lg border border-white/5 hover:border-nyembo-gold/30 transition-colors group cursor-pointer shadow-sm">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm text-gray-200 font-medium whitespace-normal">{story.title}</p>
                                                {story.storyPoints && (
                                                    <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-gray-400">
                                                        {story.storyPoints}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-1.5">
                                                    {story.status === "done" ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> :
                                                        story.status === "in-progress" ? <CircleDashed className="w-3 h-3 text-blue-400 animate-spin-slow" /> :
                                                            <AlertCircle className="w-3 h-3 text-gray-500" />}
                                                    <span className="text-[10px] text-muted-foreground uppercase">{story.status}</span>
                                                </div>
                                                <span className={cn(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    story.type === "bug" ? "bg-red-500" :
                                                        story.type === "story" ? "bg-green-500" : "bg-blue-500"
                                                )} />
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add Story Button Placeholder */}
                                    <button className="w-full py-2 border border-dashed border-white/20 rounded-lg text-xs text-muted-foreground hover:bg-white/5 hover:text-white transition-colors">
                                        + Add User Story
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" className="bg-white/5" />
            </ScrollArea>
        </div>
    );
}
