import { useState, useEffect } from "react";
import { Task } from "@/types/firestore";
import { subscribeToCollection, createDocument, updateDocument, deleteDocument, fetchCollection } from "@/services/firebase/database";
import { where, orderBy, QueryConstraint } from "firebase/firestore";

export type TaskStatus = "todo" | "in-progress" | "review" | "done";

export function useTasks(projectId?: string) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];

        if (projectId && projectId !== "all") {
            constraints = [
                where("projectId", "==", projectId),
                orderBy("createdAt", "desc")
            ];
        }

        const unsubscribe = subscribeToCollection<Task>(
            "tasks",
            constraints,
            (data) => {
                setTasks(data);
                setLoading(false);
            },
            (err) => {
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [projectId]);

    const calculateProjectProgress = async (targetProjectId: string) => {
        try {
            // 1. Fetch all tasks for this project
            const projectTasks = await fetchCollection<Task>("tasks", [
                where("projectId", "==", targetProjectId)
            ]);

            if (projectTasks.length === 0) return;

            // 2. Calculate progress
            const total = projectTasks.length;
            const done = projectTasks.filter(t => t.status === "done").length;
            const progress = Math.round((done / total) * 100);

            // 3. Update project
            await updateDocument("projects", targetProjectId, { progress });
            console.log(`Updated project ${targetProjectId} progress to ${progress}%`);

        } catch (err) {
            console.error("Failed to calculate project progress", err);
        }
    };

    const addTask = async (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
        try {
            const result = await createDocument("tasks", data);
            // Recalculate progress for the project
            if (data.projectId) {
                await calculateProjectProgress(data.projectId);
            }
            return result;
        } catch (err) {
            console.error("Failed to add task", err);
            throw err;
        }
    };

    const updateTask = async (id: string, data: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>) => {
        try {
            await updateDocument("tasks", id, data);

            // If status changed or project changed, recalculate
            // We need the task's projectId. Since we might only have partial data, 
            // the safest bet is to rely on the calling component to pass the projectId 
            // or fetch the task first. 
            // For efficiency, let's assume if the caller is moving a task, 
            // they might want to trigger a recalc explicitly or we do a best effort here.

            // NOTE: In a real app, we might want to do this via a Cloud Function trigger.
            // For now, we will expose calculateProjectProgress so the UI can call it.
        } catch (err) {
            console.error("Failed to update task", err);
            throw err;
        }
    };

    const deleteTask = async (id: string, projectId?: string) => {
        try {
            await deleteDocument("tasks", id);
            if (projectId) {
                await calculateProjectProgress(projectId);
            }
        } catch (err) {
            console.error("Failed to delete task", err);
            throw err;
        }
    };

    return {
        tasks,
        loading,
        error,
        addTask,
        updateTask,
        deleteTask,
        calculateProjectProgress
    };
}
