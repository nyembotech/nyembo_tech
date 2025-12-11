"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Task, Priority, Status } from "@/types/kanban";

interface NewTaskDialogProps {
    onAddTask: (task: Omit<Task, "id">) => void;
}

export function NewTaskDialog({ onAddTask }: NewTaskDialogProps) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [projectName, setProjectName] = useState("");
    const [priority, setPriority] = useState<Priority>("Medium");
    const [status, setStatus] = useState<Status>("Backlog");
    const [assigneeInitials, setAssigneeInitials] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddTask({
            title,
            projectName,
            priority,
            status,
            assigneeInitials: assigneeInitials.toUpperCase().slice(0, 2),
            progress: 0,
        });
        setOpen(false);
        // Reset form
        setTitle("");
        setProjectName("");
        setPriority("Medium");
        setStatus("Backlog");
        setAssigneeInitials("");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-nyembo-sky text-black hover:bg-nyembo-sky/90 shadow-[0_0_15px_rgba(53,203,248,0.3)]">
                    <Plus className="w-4 h-4 mr-2" />
                    New Task
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/90 border-white/10 backdrop-blur-xl text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Task Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-white/5 border-white/10 text-white"
                            placeholder="e.g. Implement Auth Flow"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="project">Project Name</Label>
                        <Input
                            id="project"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="bg-white/5 border-white/10 text-white"
                            placeholder="e.g. Project Phoenix"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-white/10 text-white">
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-white/10 text-white">
                                    <SelectItem value="Backlog">Backlog</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Blocked">Blocked</SelectItem>
                                    <SelectItem value="Done">Done</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="assignee">Assignee Initials</Label>
                        <Input
                            id="assignee"
                            value={assigneeInitials}
                            onChange={(e) => setAssigneeInitials(e.target.value)}
                            className="bg-white/5 border-white/10 text-white"
                            placeholder="e.g. JD"
                            maxLength={2}
                            required
                        />
                    </div>
                    <div className="pt-4 flex justify-end">
                        <Button type="submit" className="bg-nyembo-sky text-black hover:bg-nyembo-sky/90">
                            Create Task
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
