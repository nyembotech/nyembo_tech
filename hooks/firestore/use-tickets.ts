import { useState, useEffect } from "react";
import { Ticket } from "@/types/firestore";
import { subscribeToCollection, createDocument, updateDocument } from "@/services/firebase/database";
import { where, orderBy, QueryConstraint } from "firebase/firestore";
import { useAuth } from "@/context/auth-context";
import { withOrgId } from "@/lib/firestore-helpers";

export function useTicketsForCustomer(customerId?: string) {
    const { organization } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!customerId || !organization?.id) {
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToCollection<Ticket>(
            "tickets",
            [
                where('organizationId', '==', organization.id),
                where("customerId", "==", customerId),
                orderBy("updatedAt", "desc")
            ],
            (data) => {
                setTickets(data);
                setLoading(false);
            },
            (err) => {
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [customerId, organization?.id]);

    const createTicket = async (data: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "organizationId">) => {
        if (!organization?.id) {
            throw new Error('Cannot create ticket without organization context');
        }
        try {
            return await createDocument("tickets", withOrgId(data, organization.id));
        } catch (err) {
            console.error("Failed to create ticket", err);
            throw err;
        }
    };

    return { tickets, loading, error, createTicket };
}

export function useAllTickets(filters?: { status?: Ticket["status"] }, options?: { enabled?: boolean }) {
    const { organization } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
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
            orderBy("updatedAt", "desc")
        ];

        if (filters?.status) {
            constraints.push(where("status", "==", filters.status));
        }

        const unsubscribe = subscribeToCollection<Ticket>(
            "tickets",
            constraints,
            (data) => {
                setTickets(data);
                setLoading(false);
            },
            (err) => {
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [filters?.status, options?.enabled, organization?.id]);

    return { tickets, loading, error };
}
