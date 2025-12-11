"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Task {
    id: string;
    title: string;
    status: string;
    projectName: string;
    assigneeInitials: string;
    priority: "Low" | "Medium" | "High";
}

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
                className="opacity-30 bg-sidebar-primary/20 border-2 border-sidebar-primary rounded-xl h-[150px]"
            />
        );
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card className="bg-card/50 border-sidebar-border shadow-neumo hover:border-sidebar-primary/50 hover:-translate-y-1 transition-all cursor-grab active:cursor-grabbing group">
                <CardHeader className="p-4 pb-2 space-y-0">
                    <div className="flex justify-between items-start gap-2">
                        <Badge variant="outline" className="text-[10px] border-sidebar-border text-muted-foreground group-hover:border-sidebar-primary/30 group-hover:text-sidebar-primary transition-colors">
                            {task.projectName}
                        </Badge>
                        <Badge
                            className={cn(
                                "text-[10px] px-1.5 py-0.5",
                                task.priority === "High" ? "bg-nyembo-red text-white hover:bg-nyembo-red/90" :
                                    task.priority === "Medium" ? "bg-nyembo-gold text-black hover:bg-nyembo-gold/90" :
                                        "bg-nyembo-sky text-black hover:bg-nyembo-sky/90"
                            )}
                        >
                            {task.priority}
                        </Badge>
                    </div>
                    <CardTitle className="text-sm font-medium text-white pt-2 leading-tight">
                        {task.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                    <div className="flex items-center justify-between mt-2">
                        <Avatar className="h-6 w-6 border border-sidebar-border">
                            <AvatarFallback className="text-[10px] bg-sidebar-accent text-sidebar-foreground">
                                {task.assigneeInitials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="h-1 w-16 bg-sidebar-border rounded-full overflow-hidden">
                            <div className="h-full bg-sidebar-primary w-[60%]" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
