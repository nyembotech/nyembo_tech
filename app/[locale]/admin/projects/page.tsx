"use client";

import { useEffect, useState } from "react";
import { useProjects, useProject } from "@/hooks/firestore/use-projects";
import { useCustomers } from "@/hooks/firestore/use-customers";
import { Project3DCard } from "@/components/admin/projects/project-3d-card";
import { Project, Customer } from "@/types/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProjectDialog } from "@/components/admin/projects/project-dialog";
import { GradientListItem } from "@/components/ui/gradient-list-item";
import { updateDocument } from "@/services/firebase/database";
import { Search, Filter, Plus, LayoutGrid, List } from "lucide-react";

export default function AdminProjectsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const { projects, loading: projectsLoading, addProject, deleteProject } = useProjects();
    const { updateProject } = useProject(editingProject?.id);
    const { customers, loading: customersLoading } = useCustomers();
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    useEffect(() => {
        if (projects) {
            setFilteredProjects(
                projects.filter(p =>
                    p.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }
    }, [projects, searchQuery]);

    const getCustomer = (customerId: string) => {
        return customers?.find(c => c.id === customerId);
    };

    const handleSave = async (data: any) => {
        if (editingProject) {
            // Update
            // @ts-ignore
            await updateDocument("projects", editingProject.id, data);
        } else {
            // Create
            await addProject(data);
        }
        setIsDialogOpen(false);
        setEditingProject(null);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this project?")) {
            await deleteProject(id);
        }
    };

    const openNew = () => {
        setEditingProject(null);
        setIsDialogOpen(true);
    };

    const openEdit = (project: Project) => {
        setEditingProject(project);
        setIsDialogOpen(true);
    };

    if (projectsLoading || customersLoading) {
        return <div className="p-8 text-white">Loading...</div>;
    }

    return (
        <div className="p-6 space-y-8 min-h-screen">
            <ProjectDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                project={editingProject}
                customers={customers}
                onSubmit={handleSave}
            />

            {/* Header / Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">My Projects</h1>
                    <p className="text-muted-foreground">Manage and track ongoing missions.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* View Toggle */}
                    <div className="bg-[#121214] border border-white/10 rounded-lg p-1 flex">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode("grid")}
                            className={viewMode === "grid" ? "bg-white/10 text-white" : "text-muted-foreground"}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode("list")}
                            className={viewMode === "list" ? "bg-white/10 text-white" : "text-muted-foreground"}
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search projects..."
                            className="pl-9 bg-[#121214] border-white/10 text-white rounded-xl focus-visible:ring-[#bef264]/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <Button
                        onClick={openNew}
                        className="bg-gradient-to-r from-[#bef264] to-emerald-500 text-black font-bold hover:shadow-[0_0_20px_rgba(190,242,100,0.4)] transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Project
                    </Button>
                </div>
            </div>

            {/* Content */}
            {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                    {filteredProjects.map((project) => (
                        <div key={project.id} onClick={() => openEdit(project)}>
                            {/* Wrap with div to handle click for edit, or pass onEdit to card */}
                            <Project3DCard
                                project={project}
                                customer={getCustomer(project.customerId)}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-2">
                    {filteredProjects.map((project) => {
                        const customer = getCustomer(project.customerId);
                        return (
                            <GradientListItem
                                key={project.id}
                                variant={project.status === 'in-progress' ? 'green' : project.status === 'review' ? 'orange' : 'purple'}
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10`}>
                                        <span className="font-bold text-xs">{project.progress}%</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{project.title}</h3>
                                        {customer && <p className="text-muted-foreground text-sm">{customer.companyName || customer.name}</p>}
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 mr-4">
                                    <div className="hidden md:block text-right">
                                        <div className="text-xs text-muted-foreground uppercase">Status</div>
                                        <div className="font-medium text-white capitalize">{project.status}</div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => openEdit(project)} className="hover:text-[#bef264]">
                                            <span className="sr-only">Edit</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }} className="hover:text-red-500">
                                            <span className="sr-only">Delete</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                        </Button>
                                    </div>
                                </div>
                            </GradientListItem>
                        );
                    })}
                </div>
            )}

            {filteredProjects.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-muted-foreground">No projects found.</p>
                </div>
            )}
        </div>
    );
}
