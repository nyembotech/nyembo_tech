import { useState, useEffect } from "react";
import { ActivityLog } from "@/types/firestore";
import { subscribeToCollection } from "@/services/firebase/database";
import { orderBy, where, QueryConstraint, limit as firestoreLimit } from "firebase/firestore";
import { useAuth } from "@/context/auth-context";

interface UseActivityFilters {
    customerId?: string;
    visibility?: "admin" | "customer"; // If undefined, gets all (for admin use mainly)
    targetId?: string;
    limit?: number;
}

export function useActivity(filters?: UseActivityFilters, options?: { enabled?: boolean }) {
    const { organization } = useAuth();
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (options?.enabled === false) {
            setLoading(false);
            return;
        }

        if (!organization?.id) {
            setLoading(false);
            return;
        }

        const constraints: QueryConstraint[] = [
            where('organizationId', '==', organization.id),
            orderBy("createdAt", "desc")
        ];

        if (filters?.visibility) {
            if (filters.visibility === "customer") {
                constraints.push(where("visibility", "in", ["customer", "both"]));
            } else {
                constraints.push(where("visibility", "==", filters.visibility));
            }
        }

        if (filters?.customerId) {
            constraints.push(where("customerId", "==", filters.customerId));
        }

        if (filters?.targetId) {
            constraints.push(where("targetId", "==", filters.targetId));
        }

        if (filters?.limit) {
            constraints.push(firestoreLimit(filters.limit));
        }

        const unsubscribe = subscribeToCollection<ActivityLog>(
            "activity_log",
            constraints,
            (data) => {
                setActivities(data);
                setLoading(false);
            },
            (err) => {
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [filters?.customerId, filters?.visibility, filters?.targetId, filters?.limit, options?.enabled, organization?.id]);

    return { activities, loading, error };
}
