"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types/kanban";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { GripVertical, Clock, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface KanbanCardProps {
    task: Task;
}

export function KanbanCard({ task }: KanbanCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id, data: { type: "Task", task } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-50 bg-sky-500/10 border-2 border-sky-400 rounded-xl h-[160px] w-full shadow-[0_0_30px_rgba(56,189,248,0.3)] animate-pulse"
            />
        );
    }

    const priorityColors: Record<string, string> = {
        Low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        Medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        High: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        Critical: "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse-slow",
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="h-full touch-none group">
            <div className="h-full transform transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]">
                <Card className="h-full bg-gradient-to-b from-white/10 to-white/5 border-white/10 group-hover:border-sky-500/40 shadow-lg group-hover:shadow-sky-500/20 backdrop-blur-xl relative overflow-hidden">
                    {/* Top Glare */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                        <Badge variant="outline" className="bg-black/20 border-white/5 text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                            {task.projectName}
                        </Badge>
                        <button className="text-gray-500 hover:text-white transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </CardHeader>

                    <CardContent className="p-4 pt-1 space-y-4">
                        <div>
                            <h4 className="font-semibold text-white/90 leading-snug group-hover:text-sky-300 transition-colors">
                                {task.title}
                            </h4>
                            <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>2 days left</span>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                                <span>PROGRESS</span>
                                <span className={cn(task.progress === 100 ? "text-emerald-400" : "text-sky-400")}>
                                    {task.progress}%
                                </span>
                            </div>
                            <Progress
                                value={task.progress}
                                className="h-1.5 bg-black/40 border border-white/5 rounded-full"
                                indicatorClassName={cn(
                                    "rounded-full shadow-[0_0_10px_currentColor]",
                                    task.progress === 100 ? "bg-emerald-500 text-emerald-500" :
                                        task.priority === 'Critical' ? "bg-red-500 text-red-500" : "bg-sky-500 text-sky-500"
                                )}
                            />
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-white/5 mt-2">
                            <div className="flex -space-x-2">
                                <Avatar className="h-6 w-6 border-2 border-black bg-black">
                                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-[9px] text-white font-bold">
                                        {task.assigneeInitials}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <Badge variant="outline" className={cn("text-[10px] px-2 py-0.5 border backdrop-blur-md", priorityColors[task.priority])}>
                                {task.priority}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
