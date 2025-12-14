
import { useState, useEffect } from "react";
import { Epic, Task, BaseEntity } from "@/types/firestore";
import { subscribeToCollection } from "@/services/firebase/database";
import { where, orderBy } from "firebase/firestore";

export function useEpics(projectId?: string) {
    const [epics, setEpics] = useState<Epic[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!projectId) {
            setEpics([]);
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToCollection<Epic>(
            "epics",
            [
                where("projectId", "==", projectId),
                orderBy("createdAt", "desc")
            ],
            (data) => {
                setEpics(data);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching epics:", err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [projectId]);

    return { epics, loading };
}

export function useProjectStories(projectId?: string) {
    const [stories, setStories] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!projectId) {
            setStories([]);
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToCollection<Task>(
            "tasks",
            [
                where("projectId", "==", projectId),
                where("type", "==", "story"),
                orderBy("createdAt", "desc")
            ],
            (data) => {
                setStories(data);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching stories:", err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [projectId]);

    return { stories, loading };
}
