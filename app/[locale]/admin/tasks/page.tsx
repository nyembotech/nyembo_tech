import { KanbanBoard } from "@/components/admin/kanban/board";

export default function TasksPage() {
    return (
        <div className="h-[calc(100vh-120px)]">
            <KanbanBoard />
        </div>
    );
}
