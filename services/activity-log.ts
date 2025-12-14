import { createDocument } from "@/services/firebase/database";
import { ActivityLog } from "@/types/firestore";

export type LogActivityParams = Omit<ActivityLog, "id" | "createdAt" | "updatedAt">;

/**
 * Logs an activity to the 'activity_log' collection.
 * 
 * @param params - The activity details.
 */
export async function logActivity(params: LogActivityParams) {
    try {
        await createDocument("activity_log", params);
    } catch (error) {
        console.error("Failed to log activity:", error);
        // We generally don't want to throw here to avoid blocking the main action
        // if logging fails, but in a production app you might want better handling.
    }
}
