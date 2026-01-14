"use client";

import { useState, useMemo } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "./column";
import { KanbanCard } from "./card";
import { NewTaskDialog } from "./new-task-dialog";
import { Column } from "@/types/kanban";
import { Task } from "@/types/firestore";
import { createPortal } from "react-dom";
import { useTasks, TaskStatus } from "@/hooks/firestore/use-tasks";
import { useProjects } from "@/hooks/firestore/use-projects";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

// Map Firestore status to Display Title
const columns: Column[] = [
    { id: "todo", title: "Backlog" },
    { id: "in-progress", title: "In Progress" },
    { id: "review", title: "Review" },
    { id: "done", title: "Done" },
];

export function KanbanBoard() {
    // 1. Project Filter State
    const [selectedProjectId, setSelectedProjectId] = useState<string>("all");
    const { projects, loading: projectsLoading } = useProjects();

    // 2. Fetch Tasks based on filter
    const queryProjectId = selectedProjectId === "all" ? undefined : selectedProjectId;
    const { tasks: firestoreTasks, loading: tasksLoading, updateTask, addTask: addFirestoreTask, calculateProjectProgress } = useTasks(queryProjectId);

    // Local state for optimistic UI updates (initially synced with Firestore)
    // Note: Ideally we sync local state with firestoreTasks whenever firestoreTasks changes.
    // However, dnd-kit needs stable local state to avoid flickering during optimistic updates.
    // For simplicity in this iteration, we'll derive "displayTasks" from Firestore directly 
    // but we can't easily drag-sort without local state if we rely solely on subscription.
    // Let's rely on Firestore subscription updates for now, but handle 'DragEnd' carefully.

    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const task = firestoreTasks.find((t) => t.id === active.id);
        if (task) setActiveTask(task);
    };

    const handleDragOver = (event: DragOverEvent) => {
        // We skip complex drag-over reordering for now to rely on simple status changes
        // or we can implement it if we want visual sorting within columns.
        // For functionality "Park Place", status change is the priority.
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const activeId = active.id as string;
        // The over.id is likely the Column ID if dropped on a column, or Task ID if dropped on a task.
        // We need to determine the new status.

        let newStatus: TaskStatus | undefined;

        // Check if dropped on a Column
        if (columns.some(c => c.id === over.id)) {
            newStatus = over.id as TaskStatus;
        }
        // Check if dropped on another Task (find its status)
        else {
            const overTask = firestoreTasks.find(t => t.id === over.id);
            if (overTask) {
                newStatus = overTask.status;
            }
        }

        if (newStatus) {
            const currentTask = firestoreTasks.find(t => t.id === activeId);
            if (currentTask && currentTask.status !== newStatus) {
                // 1. Optimistic Update (optional, but dnd-kit might snap back if we don't update local state instantly. 
                // Since we rely on Firestore hook, there might be a slight delay.
                // We'll proceed with the API call.)

                // 2. API Call
                await updateTask(activeId, { status: newStatus });

                // 3. Dynamic Progress Calculation
                // If moving TO 'done' or FROM 'done', pass projectId to recalc
                if ((newStatus === 'done' || currentTask.status === 'done') && currentTask.projectId) {
                    // Update the project progress
                    await calculateProjectProgress(currentTask.projectId);
                }
            }
        }
    };

    const handleAddTask = async (newTaskData: any) => {
        // If a project is selected in filter, auto-assign it (if not already set in dialog)
        // The dialog handles the internal "new task" object creation.
        // We just verify projectId is set if possible.
        try {
            await addFirestoreTask({
                ...newTaskData,
                projectId: newTaskData.projectId || (selectedProjectId !== 'all' ? selectedProjectId : '')
            });
        } catch (e) {
            console.error("Error creating task", e);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 shrink-0 gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 tracking-tight mb-2 drop-shadow-sm">
                        Cyber Command Board
                    </h1>
                    <p className="text-muted-foreground/80 text-sm">
                        {selectedProjectId === 'all'
                            ? "Aggregated view of all active operations (Park Place)."
                            : "Filtering operations for specific mission."}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Project Filter */}
                    <div className="w-[200px]">
                        <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                            <SelectTrigger className="bg-black/20 border-white/10 text-white backdrop-blur-md">
                                <SelectValue placeholder="Filter by Project" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#121214] border-white/10 text-white">
                                <SelectItem value="all">All Projects (Park Place)</SelectItem>
                                {projects.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <NewTaskDialog onAddTask={handleAddTask} selectedProjectId={selectedProjectId === 'all' ? undefined : selectedProjectId} projects={projects} />
                </div>
            </div>

            {/* Loading State */}
            {tasksLoading && (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
                </div>
            )}

            {!tasksLoading && (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex gap-6 h-full overflow-x-auto overflow-y-hidden pb-4 items-start scrollbar-thin scrollbar-thumb-sky-500/20 scrollbar-track-transparent">
                        {columns.map((col) => (
                            <div key={col.id} className="min-w-[320px] h-full">
                                <KanbanColumn
                                    column={col}
                                    tasks={firestoreTasks.filter((t) => t.status === col.id)}
                                />
                            </div>
                        ))}
                        <div className="min-w-[20px]" />
                    </div>

                    {createPortal(
                        <DragOverlay>
                            {activeTask && (
                                <div className="rotate-2 scale-105 shadow-[0_0_30px_rgba(56,189,248,0.4)]">
                                    <KanbanCard task={activeTask} />
                                </div>
                            )}
                        </DragOverlay>,
                        document.body
                    )}
                </DndContext>
            )}
        </div>
    );
}
