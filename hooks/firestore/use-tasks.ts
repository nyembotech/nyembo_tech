import { useState, useEffect } from "react";
import { Task } from "@/types/firestore";
import { subscribeToCollection, createDocument, updateDocument, deleteDocument } from "@/services/firebase/database";
import { where, orderBy } from "firebase/firestore";

export function useTasksByProject(projectId?: string) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!projectId) {
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToCollection<Task>(
            "tasks",
            [
                where("projectId", "==", projectId),
                orderBy("createdAt", "desc")
            ],
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

    const addTask = async (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
        try {
            return await createDocument("tasks", data);
        } catch (err) {
            console.error("Failed to add task", err);
            throw err;
        }
    };

    const updateTask = async (id: string, data: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>) => {
        try {
            await updateDocument("tasks", id, data);
        } catch (err) {
            console.error("Failed to update task", err);
            throw err;
        }
    };

    const deleteTask = async (id: string) => {
        try {
            await deleteDocument("tasks", id);
        } catch (err) {
            console.error("Failed to delete task", err);
            throw err;
        }
    };

    return { tasks, loading, error, addTask, updateTask, deleteTask };
}
