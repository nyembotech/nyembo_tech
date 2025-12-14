import { useState, useEffect } from "react";
import { Ticket } from "@/types/firestore";
import { subscribeToCollection, createDocument, updateDocument } from "@/services/firebase/database";
import { where, orderBy } from "firebase/firestore";

export function useTicketsForCustomer(customerId?: string) {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!customerId) {
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToCollection<Ticket>(
            "tickets",
            [
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
    }, [customerId]);

    const createTicket = async (data: Omit<Ticket, "id" | "createdAt" | "updatedAt">) => {
        try {
            return await createDocument("tickets", data);
        } catch (err) {
            console.error("Failed to create ticket", err);
            throw err;
        }
    };

    return { tickets, loading, error, createTicket };
}

export function useAllTickets(filters?: { status?: Ticket["status"] }, options?: { enabled?: boolean }) {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (options?.enabled === false) {
            setLoading(false);
            return;
        }

        const constraints: any[] = [orderBy("updatedAt", "desc")];
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
    }, [filters?.status, options?.enabled]);

    return { tickets, loading, error };
}
