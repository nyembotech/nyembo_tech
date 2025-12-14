import { useState } from "react";
import { CustomerInvite } from "@/types/firestore";
import { createDocument, fetchCollection, updateDocument } from "@/services/firebase/database";
import { where, Timestamp } from "firebase/firestore";

export function useCustomerInvites() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const generateInvite = async (customerId: string, email: string) => {
        setLoading(true);
        try {
            // Check for existing active invite
            const existing = await fetchCollection<CustomerInvite>("customer_invites", [
                where("customerId", "==", customerId),
                where("used", "==", false)
            ]);

            if (existing.length > 0) {
                // Return existing token if valid
                const invite = existing[0];
                if (invite.expiresAt.toDate() > new Date()) {
                    setLoading(false);
                    return invite.token;
                }
            }

            // Generate new token
            const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

            await createDocument("customer_invites", {
                token,
                email,
                customerId,
                used: false,
                expiresAt: Timestamp.fromDate(expiresAt)
            });

            // Update customer status
            await updateDocument("customers", customerId, { onboardingStatus: "invited" });

            setLoading(false);
            return token;
        } catch (err) {
            console.error("Failed to generate invite", err);
            setError(err as Error);
            setLoading(false);
            throw err;
        }
    };

    const validateInvite = async (token: string) => {
        setLoading(true);
        try {
            const invites = await fetchCollection<CustomerInvite>("customer_invites", [
                where("token", "==", token),
                where("used", "==", false)
            ]);

            if (invites.length === 0) {
                throw new Error("Invalid or used invite token.");
            }

            const invite = invites[0];
            if (invite.expiresAt.toDate() < new Date()) {
                throw new Error("Invite token has expired.");
            }

            setLoading(false);
            return invite;
        } catch (err) {
            setError(err as Error);
            setLoading(false);
            throw err;
        }
    };

    const markInviteUsed = async (id: string) => {
        await updateDocument("customer_invites", id, { used: true });
    };

    return { generateInvite, validateInvite, markInviteUsed, loading, error };
}
