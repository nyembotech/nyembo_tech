"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Project, Customer } from "@/types/firestore";
import { Trash2 } from "lucide-react";

interface ProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project?: Project | null; // If null, creating new
    customers: Customer[];
    onSubmit: (data: any) => Promise<void>;
    onDelete?: (id: string) => void;
}

export function ProjectDialog({ open, onOpenChange, project, customers, onSubmit, onDelete }: ProjectDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        customerId: "",
        status: "planning",
        progress: "0"
    });

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title,
                customerId: project.customerId,
                status: project.status,
                progress: project.progress.toString()
            });
        } else {
            setFormData({
                title: "",
                customerId: "",
                status: "planning",
                progress: "0"
            });
        }
    }, [project, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({
                ...formData,
                progress: parseInt(formData.progress) || 0,
            });
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        if (project && onDelete) {
            onDelete(project.id);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#121214] border-white/10 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{project ? "Edit Project" : "New Project"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Project Title</Label>
                        <Input
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="bg-black/40 border-white/10 focus-visible:ring-[#bef264]/50 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Customer</Label>
                        <Select
                            value={formData.customerId}
                            onValueChange={(val) => setFormData({ ...formData, customerId: val })}
                        >
                            <SelectTrigger className="bg-black/40 border-white/10 text-white">
                                <SelectValue placeholder="Select a customer" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#121214] border-white/10 text-white">
                                {customers.map(c => (
                                    <SelectItem key={c.id} value={c.id}>{c.name} ({c.companyName || 'Personal'})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(val) => setFormData({ ...formData, status: val })}
                            >
                                <SelectTrigger className="bg-black/40 border-white/10 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#121214] border-white/10 text-white">
                                    <SelectItem value="planning">Planning</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="review">Review</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Progress (%)</Label>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.progress}
                                onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                                className="bg-black/40 border-white/10 focus-visible:ring-[#bef264]/50 text-white"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-between gap-2">
                        <div>
                            {project && onDelete && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button type="submit" disabled={loading} className="bg-[#bef264] text-black hover:bg-[#a3e635]">
                                {loading ? "Saving..." : "Save Project"}
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
