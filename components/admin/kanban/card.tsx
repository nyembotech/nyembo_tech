"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types/kanban";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { GripVertical } from "lucide-react";

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
                className="opacity-30 bg-nyembo-sky/20 border-2 border-nyembo-sky rounded-xl h-[150px] w-full"
            />
        );
    }

    const priorityColors = {
        Low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        High: "bg-orange-500/20 text-orange-400 border-orange-500/30",
        Critical: "bg-red-500/20 text-red-400 border-red-500/30",
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card className="bg-card/40 border-white/5 hover:border-nyembo-sky/50 transition-all duration-300 group cursor-grab active:cursor-grabbing shadow-neumo hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] backdrop-blur-md">
                <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                    <Badge variant="outline" className="bg-white/5 border-white/10 text-xs font-normal text-muted-foreground">
                        {task.projectName}
                    </Badge>
                    <GripVertical className="w-4 h-4 text-muted-foreground/30 group-hover:text-nyembo-sky transition-colors" />
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3">
                    <h4 className="font-medium text-white leading-tight">{task.title}</h4>

                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>Progress</span>
                            <span>{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-1 bg-white/10" indicatorClassName="bg-nyembo-sky" />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 border border-white/10">
                                <AvatarFallback className="bg-nyembo-sky/10 text-[10px] text-nyembo-sky font-bold">
                                    {task.assigneeInitials}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <Badge variant="outline" className={`text-[10px] px-2 py-0.5 border ${priorityColors[task.priority]}`}>
                            {task.priority}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
