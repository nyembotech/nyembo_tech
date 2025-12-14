import { useState, useEffect } from "react";
import { ActivityLog } from "@/types/firestore";
import { subscribeToCollection } from "@/services/firebase/database";
import { orderBy, where } from "firebase/firestore";

interface UseActivityFilters {
    customerId?: string;
    visibility?: "admin" | "customer"; // If undefined, gets all (for admin use mainly)
    targetId?: string;
    limit?: number;
}

export function useActivity(filters?: UseActivityFilters, options?: { enabled?: boolean }) {
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const constraints: any[] = [orderBy("createdAt", "desc")];

        if (options?.enabled === false) {
            setLoading(false);
            return;
        }

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

        // Note: 'limit' logic would be applied here, but subscribeToCollection helper currently just accepts general constraints.
        // If we need limit(), we should add it to the constraints array if supported by the helper's flexible args, 
        // or update helper. For now, we'll slice on client side if needed or rely on component to show only N items.

        const unsubscribe = subscribeToCollection<ActivityLog>(
            "activity_log",
            constraints,
            (data) => {
                // Client-side visual filtering for "admin" seeing everything or "customer" seeing 'customer'|'both' logic
                // if not handled purely by query.
                setActivities(data);
                setLoading(false);
            },
            (err) => {
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [filters?.customerId, filters?.visibility, filters?.targetId, options?.enabled]);

    return { activities, loading, error };
}
