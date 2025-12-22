"use client";

import { useState, useEffect } from "react";
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
import { Task, Column, Status } from "@/types/kanban";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const initialColumns: Column[] = [
    { id: "Backlog", title: "Backlog" },
    { id: "In Progress", title: "In Progress" },
    { id: "Blocked", title: "Blocked" },
    { id: "Done", title: "Done" },
];

const defaultTasks: Task[] = [
    {
        id: "1",
        title: "Implement Auth Flow",
        status: "In Progress",
        projectName: "Project Phoenix",
        assigneeInitials: "JD",
        priority: "High",
        progress: 65,
    },
    {
        id: "2",
        title: "Design System Update",
        status: "Backlog",
        projectName: "UI Kit",
        assigneeInitials: "AL",
        priority: "Medium",
        progress: 0,
    },
    {
        id: "3",
        title: "Fix API Latency",
        status: "Blocked",
        projectName: "Backend",
        assigneeInitials: "MK",
        priority: "Critical",
        progress: 30,
    },
    {
        id: "4",
        title: "User Onboarding",
        status: "Done",
        projectName: "Project Phoenix",
        assigneeInitials: "JD",
        priority: "High",
        progress: 100,
    },
];

interface KanbanBoardProps {
    initialTasks?: Task[];
    isReadOnly?: boolean;
    title?: string;
    description?: string;
    className?: string;
}

export function KanbanBoard({
    initialTasks = defaultTasks,
    isReadOnly = false,
    title = "Cyber Command Board",
    description = "Tactical operational workflow management.",
    className
}: KanbanBoardProps) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    // Update internal state if props change (optional, but good for data loading)
    useEffect(() => {
        if (initialTasks && initialTasks !== defaultTasks) {
            setTasks(initialTasks);
        }
    }, [initialTasks]);

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
        if (isReadOnly) return;
        const { active } = event;
        const task = tasks.find((t) => t.id === active.id);
        if (task) setActiveTask(task);
    };

    const handleDragOver = (event: DragOverEvent) => {
        if (isReadOnly) return;
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveTask = active.data.current?.type === "Task";
        const isOverTask = over.data.current?.type === "Task";
        const isOverColumn = over.data.current?.type === "Column";

        if (!isActiveTask) return;

        if (isActiveTask && isOverTask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);

                if (tasks[activeIndex].status !== tasks[overIndex].status) {
                    tasks[activeIndex].status = tasks[overIndex].status;
                }

                return arrayMove(tasks, activeIndex, overIndex);
            });
        }

        if (isActiveTask && isOverColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                tasks[activeIndex].status = overId as Status;
                return arrayMove(tasks, activeIndex, activeIndex);
            });
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        if (isReadOnly) return;
        setActiveTask(null);
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveTask = active.data.current?.type === "Task";
        const isOverTask = over.data.current?.type === "Task";

        if (isActiveTask && isOverTask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);
                return arrayMove(tasks, activeIndex, overIndex);
            });
        }
    };

    const handleAddTask = (newTask: Omit<Task, "id">) => {
        const task: Task = {
            ...newTask,
            id: Math.random().toString(36).substr(2, 9),
        };
        setTasks([...tasks, task]);
    };

    return (
        <div className={cn("h-full flex flex-col", className)}>
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 tracking-tight mb-2 drop-shadow-sm">
                        {title}
                    </h1>
                    <p className="text-muted-foreground/80 text-sm">{description}</p>
                </div>
                {!isReadOnly && <NewTaskDialog onAddTask={handleAddTask} />}
            </div>

            <DndContext
                sensors={isReadOnly ? [] : sensors} // Disable sensors if read-only
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                {/* 
                  FIX: Enable horizontal scrolling for columns 
                  - h-full: Fill available height
                  - overflow-x-auto: Allow scroll
                  - flex-nowrap: Don't stack columns
                  - gap-6: Spacing
                  - pb-8: Padding for scrollbar clearance
                */}
                <div className="flex gap-6 h-full overflow-x-auto overflow-y-hidden pb-4 items-start scrollbar-thin scrollbar-thumb-sky-500/20 scrollbar-track-transparent">
                    {initialColumns.map((col) => (
                        <div key={col.id} className="min-w-[320px] h-full"> {/* Enforce Width */}
                            <KanbanColumn
                                column={col}
                                tasks={tasks.filter((t) => t.status === col.id)}
                            />
                        </div>
                    ))}
                    {/* Spacer for right aesthetic */}
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
        </div>
    );
}
