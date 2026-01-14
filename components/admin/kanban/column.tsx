"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Column } from "@/types/kanban";
import { Task } from "@/types/firestore";
import { KanbanCard } from "./card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
    column: Column;
    tasks: Task[];
}

export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: column.id,
        data: { type: "Column", column },
    });

    const statusStyles: Record<string, string> = {
        "todo": "border-t-gray-500 shadow-gray-500/10",
        "in-progress": "border-t-sky-500 shadow-sky-500/20 bg-sky-500/5",
        "review": "border-t-yellow-500 shadow-yellow-500/20 bg-yellow-500/5",
        "done": "border-t-emerald-500 shadow-emerald-500/20",
    };

    const headerColors: Record<string, string> = {
        "todo": "text-gray-400",
        "in-progress": "text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.3)]",
        "review": "text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.4)]",
        "done": "text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]",
    };

    return (
        <div
            className={cn(
                "flex flex-col h-full rounded-2xl border border-white/5 backdrop-blur-2xl p-1 transition-colors duration-300 relative overflow-hidden bg-black/20",
                "border-t-4 shadow-xl",
                statusStyles[column.id] || "border-t-gray-500",
                isOver ? "bg-white/5 border-white/20" : ""
            )}
        >
            {/* Background Texture/Grid (Optional visual flair) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-2 p-3 z-10">
                <div className={cn("text-sm font-bold uppercase tracking-widest flex items-center gap-2", headerColors[column.id])}>
                    <span className="w-2 h-2 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
                    {column.title}
                </div>
                <div className="text-[10px] font-mono bg-black/40 border border-white/10 px-2 py-0.5 rounded text-gray-400">
                    {tasks.length} TASKS
                </div>
            </div>

            {/* Droppable Area */}
            <ScrollArea className="flex-1 -mr-3 pr-3 z-10">
                <div ref={setNodeRef} className="space-y-3 min-h-[150px] pb-4 px-2">
                    <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                        {tasks.map((task) => (
                            <KanbanCard key={task.id} task={task} />
                        ))}
                    </SortableContext>

                    {tasks.length === 0 && (
                        <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl text-gray-600 text-xs">
                            <span className="opacity-50">Drop tasks here</span>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
