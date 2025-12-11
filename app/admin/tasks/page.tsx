"use client";

import { KanbanBoard } from "@/components/admin/kanban/kanban-board";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function TasksPage() {
    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Tasks</h1>
                    <p className="text-muted-foreground">Manage project tasks and sprints.</p>
                </div>
                <Button className="bg-nyembo-yellow text-black hover:bg-nyembo-gold shadow-neumo">
                    <Plus className="mr-2 h-4 w-4" /> New Task
                </Button>
            </div>

            <div className="flex-1 min-h-0">
                <KanbanBoard />
            </div>
        </div>
    );
}
