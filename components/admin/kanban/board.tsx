"use client";

import { useState } from "react";
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

const initialColumns: Column[] = [
    { id: "Backlog", title: "Backlog" },
    { id: "In Progress", title: "In Progress" },
    { id: "Blocked", title: "Blocked" },
    { id: "Done", title: "Done" },
];

const initialTasks: Task[] = [
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

export function KanbanBoard() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Require slight movement to start drag (prevents accidental clicks)
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const task = tasks.find((t) => t.id === active.id);
        if (task) setActiveTask(task);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveTask = active.data.current?.type === "Task";
        const isOverTask = over.data.current?.type === "Task";
        const isOverColumn = over.data.current?.type === "Column";

        if (!isActiveTask) return;

        // Dropping a Task over another Task
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

        // Dropping a Task over a Column
        if (isActiveTask && isOverColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                tasks[activeIndex].status = overId as Status;
                return arrayMove(tasks, activeIndex, activeIndex); // Trigger re-render
            });
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
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
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Tasks Board</h1>
                    <p className="text-muted-foreground">Manage internal tasks and project workflows.</p>
                </div>
                <NewTaskDialog onAddTask={handleAddTask} />
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-6 h-full overflow-x-auto pb-4 items-start">
                    {initialColumns.map((col) => (
                        <KanbanColumn
                            key={col.id}
                            column={col}
                            tasks={tasks.filter((t) => t.status === col.id)}
                        />
                    ))}
                </div>

                {createPortal(
                    <DragOverlay>
                        {activeTask && <KanbanCard task={activeTask} />}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    );
}
