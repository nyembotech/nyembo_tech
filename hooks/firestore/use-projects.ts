import { useState, useEffect } from "react";
import { Project } from "@/types/firestore";
import { subscribeToCollection, subscribeToDocument, createDocument, updateDocument, deleteDocument } from "@/services/firebase/database";
import { where, orderBy, QueryConstraint } from "firebase/firestore";
import { logActivity } from "@/services/activity-log";

interface UseProjectsFilters {
    customerId?: string;
    status?: Project["status"];
    managerId?: string;
}

export function useProjects(filters?: UseProjectsFilters, options?: { enabled?: boolean }) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const constraints: QueryConstraint[] = [orderBy("updatedAt", "desc")];

        if (options?.enabled === false) {
            setLoading(false);
            return;
        }

        if (filters?.customerId) {
            constraints.push(where("customerId", "==", filters.customerId));
        }
        if (filters?.status) {
            constraints.push(where("status", "==", filters.status));
        }
        if (filters?.managerId) {
            constraints.push(where("managerId", "==", filters.managerId));
        }

        const unsubscribe = subscribeToCollection<Project>(
            "projects",
            constraints,
            (data) => {
                setProjects(data);
                setLoading(false);
            },
            (err) => {
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [filters?.customerId, filters?.status, filters?.managerId, options?.enabled]);

    // ... existing imports


    // ... existing imports

    // Inside useProjects ...

    const addProject = async (data: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
        try {
            const id = await createDocument("projects", data);

            // Log Creation
            await logActivity({
                type: "success",
                actorId: "admin", // Placeholder
                targetType: "project",
                targetId: id,
                message: `Project Initialized: ${data.title}`,
                visibility: "both",
                customerId: data.customerId,
                metadata: { status: data.status }
            });

            return id;
        } catch (err) {
            console.error("Failed to add project", err);
            throw err;
        }
    };

    // ... inside useProject ...



    const deleteProject = async (id: string) => {
        try {
            await deleteDocument("projects", id);

            await logActivity({
                type: "warning",
                actorId: "admin",
                targetType: "project",
                targetId: id,
                message: `Project Deleted`,
                visibility: "admin",
                metadata: { projectId: id }
            });
        } catch (err) {
            console.error("Failed to delete project", err);
            throw err;
        }
    };

    return { projects, loading, error, addProject, deleteProject };
}

export function useProject(id?: string) {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToDocument<Project>(
            "projects",
            id,
            (data) => {
                setProject(data);
                setLoading(false);
            },
            (err) => {
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [id]);

    const updateProject = async (data: Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>) => {
        if (!id) return;
        try {
            await updateDocument("projects", id, data);

            // Simple logging for status or progress changes
            if (data.status || data.progress) {
                await logActivity({
                    type: "info",
                    actorId: "admin",
                    targetType: "project",
                    targetId: id,
                    message: data.status
                        ? `Project Status updated to ${data.status}`
                        : `Project Progress updated to ${data.progress}%`,
                    visibility: "both",
                    customerId: project?.customerId,
                    metadata: data
                });
            }

        } catch (err) {
            console.error("Failed to update project", err);
            throw err;
        }
    };

    return { project, loading, error, updateProject };
}
