"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Task } from "@/types/firestore";
import { Project } from "@/types/firestore";
import { TaskStatus } from "@/hooks/firestore/use-tasks";

interface NewTaskDialogProps {
    onAddTask: (task: Partial<Task>) => void;
    selectedProjectId?: string;
    projects: Project[];
}

export function NewTaskDialog({ onAddTask, selectedProjectId, projects }: NewTaskDialogProps) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [projectId, setProjectId] = useState(selectedProjectId || "");
    const [priority, setPriority] = useState<"low" | "medium" | "high" | "critical">("medium");
    const [status, setStatus] = useState<TaskStatus>("todo");
    // const [assigneeInitials, setAssigneeInitials] = useState(""); // TODO: Link to real users later

    // Update projectId if prop changes
    useEffect(() => {
        if (selectedProjectId) {
            setProjectId(selectedProjectId);
        } else {
            setProjectId("");
        }
    }, [selectedProjectId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const project = projects.find(p => p.id === projectId);

        onAddTask({
            title,
            projectId,
            // epicId, 
            status,
            priority,
            // assigneeId,
            type: "task",
            // Helper fields for UI that aren't strict in Firestore Task type but useful if we extend it or rely on joins logic
            // putting them in 'any' or just standard fields
        });

        setOpen(false);
        // Reset form
        setTitle("");
        if (!selectedProjectId) setProjectId("");
        setPriority("medium");
        setStatus("todo");
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

                    {!selectedProjectId && (
                        <div className="space-y-2">
                            <Label>Project</Label>
                            <Select value={projectId} onValueChange={setProjectId} required>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue placeholder="Select Project" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-white/10 text-white">
                                    {projects.map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-white/10 text-white">
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-white/10 text-white">
                                    <SelectItem value="todo">Backlog</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="review">Review</SelectItem>
                                    <SelectItem value="done">Done</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {/* Assignee field temporarily removed or needs mapping to Users list */}

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
