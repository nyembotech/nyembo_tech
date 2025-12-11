export type Status = "Backlog" | "In Progress" | "Blocked" | "Done";
export type Priority = "Low" | "Medium" | "High" | "Critical";

export interface Task {
    id: string;
    title: string;
    status: Status;
    projectName: string;
    assigneeInitials: string;
    priority: Priority;
    progress: number; // 0 to 100
}

export interface Column {
    id: Status;
    title: string;
}
