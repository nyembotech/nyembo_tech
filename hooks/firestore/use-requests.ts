import { useState, useEffect } from "react";
import { BaseEntity } from "@/types/firestore";
import { subscribeToCollection, subscribeToDocument, createDocument, updateDocument } from "@/services/firebase/database";
import { where, orderBy, Timestamp } from "firebase/firestore";
import { logActivity } from "@/services/activity-log";

export interface ProjectRequest extends BaseEntity {
    requestCode: string;
    contactInfo: {
        name: string;
        email: string;
        company: string;
        country: string;
    };
    details: {
        problem: string;
        solutionType: "web-app" | "mobile-app" | "ai-integration" | "consulting" | "other";
        timeline: "urgent" | "1-3-months" | "3-6-months" | "flexible";
        budget: "under-5k" | "5k-10k" | "10k-25k" | "25k+";
    };
    status: "new" | "in-review" | "converted" | "rejected";
    adminNotes?: string;
    publicStatus?: string;
    publicNotes?: string;
    projectId?: string;
}

export function useProjectRequests(statusFilter?: ProjectRequest["status"]) {
    const [requests, setRequests] = useState<ProjectRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const constraints: any[] = [orderBy("createdAt", "desc")];

        if (statusFilter) {
            constraints.push(where("status", "==", statusFilter));
        }

        const unsubscribe = subscribeToCollection<ProjectRequest>(
            "project_requests",
            constraints,
            (data) => {
                setRequests(data);
                setLoading(false);
            },
            (err) => {
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [statusFilter]);

    const updateRequestStatus = async (id: string, status: ProjectRequest["status"], notes?: string, additionalData?: Partial<ProjectRequest>) => {
        try {
            const data: any = { status, ...additionalData };
            if (notes !== undefined) data.adminNotes = notes;
            await updateDocument("project_requests", id, data);

            // Log Activity
            await logActivity({
                type: status === "rejected" ? "warning" : "success",
                actorId: "admin", // Ideally get current user ID
                targetType: "request",
                targetId: id,
                message: `Request status updated to ${status}`,
                visibility: status === "converted" ? "both" : "admin",
                metadata: { status, notes }
            });

        } catch (err) {
            console.error("Failed to update request status", err);
            throw err;
        }
    };

    return { requests, loading, error, updateRequestStatus };
}

export function useProjectRequestByCode(code?: string) {
    const [request, setRequest] = useState<ProjectRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!code) {
            setLoading(false);
            return;
        }

        // Since we can't query single doc by custom field easily with subscribeToDocument (which takes ID),
        // we use subscribeToCollection with a limit of 1.
        const unsubscribe = subscribeToCollection<ProjectRequest>(
            "project_requests",
            [where("requestCode", "==", code)],
            (data) => {
                if (data.length > 0) {
                    setRequest(data[0]);
                } else {
                    setRequest(null);
                }
                setLoading(false);
            },
            (err) => {
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [code]);

    return { request, loading, error };
}

export function useProjectRequestsByEmail(email?: string) {
    const [requests, setRequests] = useState<ProjectRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!email) {
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToCollection<ProjectRequest>(
            "project_requests",
            [where("contactInfo.email", "==", email)],
            (data) => {
                // Sort client-side to avoid needing a specific composite index for email + createdAt
                const sortedData = data.sort((a, b) => {
                    const timeA = a.createdAt?.seconds || 0;
                    const timeB = b.createdAt?.seconds || 0;
                    return timeB - timeA;
                });
                setRequests(sortedData);
                setLoading(false);
            },
            (err) => {
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [email]);

    return { requests, loading, error };
}

export async function submitProjectRequest(data: Omit<ProjectRequest, "id" | "createdAt" | "updatedAt" | "status" | "requestCode">) {
    // Generate Initials
    const nameParts = data.contactInfo.name.split(' ').filter(p => p.length > 0);
    let initials = "XX";
    if (nameParts.length >= 2) {
        initials = (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    } else if (nameParts.length === 1) {
        initials = nameParts[0].substring(0, 2).toUpperCase();
    }

    // Generate Random Suffix (4 chars)
    const randomSuffix = Math.random().toString(36).substr(2, 4).toUpperCase();

    // Format: REQ-INIT-RAND (REQ-JD-7X9Y) or REQ-INITRAND (REQ-JD7X9Y) based on user example REQ-ZKPC0P
    // User example REQ-ZKPC0P suggests REQ + Initials(2) + Random(4)
    const requestCode = `REQ-${initials}${randomSuffix}`;

    try {
        const id = await createDocument("project_requests", {
            ...data,
            requestCode,
            status: "new"
        });

        // Log Activity
        await logActivity({
            type: "info",
            actorId: "system",
            targetType: "request",
            targetId: id,
            message: `New Project Request: ${data.details.solutionType} for ${data.contactInfo.company}`,
            visibility: "admin",
            metadata: { requestCode }
        });

        return requestCode;
    } catch (err) {
        console.error("Failed to submit project request", err);
        throw err;
    }
}
