import { useState, useEffect } from "react";
import { Customer } from "@/types/firestore";
import { subscribeToCollection, subscribeToDocument, createDocument, updateDocument, deleteDocument } from "@/services/firebase/database";
import { where, orderBy, QueryConstraint } from "firebase/firestore";
import { useAuth } from "@/context/auth-context";
import { withOrgId, isTenantScoped } from "@/lib/firestore-helpers";

export function useCustomers() {
    const { organization } = useAuth();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // Wait for organization to be loaded
        if (!organization?.id) {
            setLoading(false);
            return;
        }

        const constraints: QueryConstraint[] = [
            where('organizationId', '==', organization.id),
            orderBy("name", "asc")
        ];

        const unsubscribe = subscribeToCollection<Customer>(
            "customers",
            constraints,
            (data) => {
                setCustomers(data);
                setLoading(false);
            },
            (err) => {
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [organization?.id]);

    const addCustomer = async (data: Omit<Customer, "id" | "createdAt" | "updatedAt" | "organizationId">) => {
        if (!organization?.id) {
            throw new Error('Cannot create customer without organization context');
        }
        try {
            return await createDocument("customers", withOrgId(data, organization.id));
        } catch (err) {
            console.error("Failed to add customer", err);
            throw err;
        }
    };

    const deleteCustomer = async (id: string) => {
        try {
            await deleteDocument("customers", id);
        } catch (err) {
            console.error("Failed to delete customer", err);
            throw err;
        }
    };

    return { customers, loading, error, addCustomer, deleteCustomer };
}

export function useCustomer(id?: string) {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToDocument<Customer>(
            "customers",
            id,
            (data) => {
                setCustomer(data);
                setLoading(false);
            },
            (err) => {
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [id]);

    const updateCustomer = async (data: Partial<Omit<Customer, "id" | "createdAt" | "updatedAt">>) => {
        if (!id) return;
        try {
            await updateDocument("customers", id, data);
        } catch (err) {
            console.error("Failed to update customer", err);
            throw err;
        }
    };

    return { customer, loading, error, updateCustomer };
}
