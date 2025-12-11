"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { KanbanCard, Task } from "./kanban-card";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface KanbanColumnProps {
    id: string;
    title: string;
    tasks: Task[];
}

export function KanbanColumn({ id, title, tasks }: KanbanColumnProps) {
    const { setNodeRef } = useSortable({
        id: id,
        data: { type: "Column", column: { id, title } },
        disabled: true // Disable dragging columns for now, focus on tasks
    });

    return (
        <Card ref={setNodeRef} className="h-full bg-sidebar-accent/20 border-sidebar-border shadow-inner flex flex-col">
            <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-sidebar-foreground/70">
                        {title}
                    </CardTitle>
                    <span className="text-xs font-medium bg-sidebar-border px-2 py-0.5 rounded-full text-muted-foreground">
                        {tasks.length}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="p-2 flex-1 min-h-0">
                <ScrollArea className="h-full pr-2">
                    <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-3 p-1">
                            {tasks.map((task) => (
                                <KanbanCard key={task.id} task={task} />
                            ))}
                        </div>
                    </SortableContext>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
