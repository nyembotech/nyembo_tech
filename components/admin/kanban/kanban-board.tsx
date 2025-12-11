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
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard, Task } from "./kanban-card";
import { createPortal } from "react-dom";

const initialTasks: Task[] = [
    { id: "1", title: "Design System Audit", status: "Backlog", projectName: "Core", assigneeInitials: "JD", priority: "Medium" },
    { id: "2", title: "Implement Auth Flow", status: "In Progress", projectName: "Platform", assigneeInitials: "AS", priority: "High" },
    { id: "3", title: "Fix Navigation Bug", status: "Blocked", projectName: "Marketing", assigneeInitials: "MK", priority: "Low" },
    { id: "4", title: "Deploy to Staging", status: "Done", projectName: "DevOps", assigneeInitials: "JD", priority: "High" },
    { id: "5", title: "Update Documentation", status: "Backlog", projectName: "Docs", assigneeInitials: "AS", priority: "Low" },
];

const columns = [
    { id: "Backlog", title: "Backlog" },
    { id: "In Progress", title: "In Progress" },
    { id: "Blocked", title: "Blocked" },
    { id: "Done", title: "Done" },
];

export function KanbanBoard() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Require slight movement to start drag
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
        }
    }

    function onDragOver(event: DragOverEvent) {
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
                    const newTasks = [...tasks];
                    newTasks[activeIndex].status = tasks[overIndex].status;
                    return newTasks;
                }
                return tasks;
            });
        }

        // Dropping a Task over a Column
        if (isActiveTask && isOverColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                if (tasks[activeIndex].status !== overId) {
                    const newTasks = [...tasks];
                    newTasks[activeIndex].status = String(overId);
                    return newTasks;
                }
                return tasks;
            });
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveTask(null);
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
                {columns.map((col) => (
                    <KanbanColumn
                        key={col.id}
                        id={col.id}
                        title={col.title}
                        tasks={tasks.filter((t) => t.status === col.id)}
                    />
                ))}
            </div>

            {mounted && createPortal(
                <DragOverlay>
                    {activeTask && <KanbanCard task={activeTask} />}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    );
}
