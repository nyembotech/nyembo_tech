"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Column, Task } from "@/types/kanban";
import { KanbanCard } from "./card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface KanbanColumnProps {
    column: Column;
    tasks: Task[];
}

export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({
        id: column.id,
        data: { type: "Column", column },
    });

    const statusColors = {
        "Backlog": "bg-gray-500/10 text-gray-400 border-gray-500/20",
        "In Progress": "bg-nyembo-sky/10 text-nyembo-sky border-nyembo-sky/20 shadow-[0_0_15px_rgba(53,203,248,0.1)]",
        "Blocked": "bg-red-500/10 text-red-400 border-red-500/20",
        "Done": "bg-green-500/10 text-green-400 border-green-500/20",
    };

    return (
        <div className="flex flex-col h-full min-w-[300px] w-[350px] bg-black/20 rounded-3xl border border-white/5 backdrop-blur-sm p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-2">
                <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider ${statusColors[column.id]}`}>
                    {column.title}
                </div>
                <div className="text-xs text-muted-foreground font-mono bg-white/5 px-2 py-1 rounded-md">
                    {tasks.length}
                </div>
            </div>

            {/* Droppable Area */}
            <ScrollArea className="flex-1 pr-3 -mr-3">
                <div ref={setNodeRef} className="space-y-3 min-h-[150px] pb-4">
                    <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                        {tasks.map((task) => (
                            <KanbanCard key={task.id} task={task} />
                        ))}
                    </SortableContext>
                </div>
            </ScrollArea>
        </div>
    );
}
