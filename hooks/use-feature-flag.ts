import { useState, useEffect } from "react";
import { FeatureFlag } from "@/types/firestore";
import { subscribeToCollection, updateDocument } from "@/services/firebase/database";
import { useAuth } from "@/hooks/use-auth";

// In-memory cache to prevent flicker if possible, though React state handles it mostly
const flagCache: Record<string, boolean> = {};

export function useFeatureFlag(key: string) {
    const { user, profile } = useAuth();
    const [isEnabled, setIsEnabled] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Subscribe to ALL flags or just query one? 
        // For efficiency in a "Labs" context, fetching all flags (usually small num) is often easier 
        // than multiple individual listeners. But let's follow the standard pattern of fetching the specific doc 
        // OR better yet, let's fetch the list once in a provider. 
        // For this prompt, I'll stick to a simple listener for the whole collection to ensure updates propagate fast
        // and filtering happens client-side for targeting logic.

        const unsubscribe = subscribeToCollection<FeatureFlag>(
            "feature_flags",
            [],
            (flags) => {
                const flag = flags.find(f => f.key === key);

                if (!flag) {
                    setIsEnabled(false);
                    setLoading(false);
                    return;
                }

                // 1. Global switch
                if (!flag.enabled) {
                    setIsEnabled(false);
                    setLoading(false);
                    return;
                }

                // 2. Targeting Logic (if enabled globally, check restrictions)
                // If NO rules are set, it's enabled for everyone
                const hasRoles = flag.targetRoles && flag.targetRoles.length > 0;
                const hasEmails = flag.targetEmails && flag.targetEmails.length > 0;

                if (!hasRoles && !hasEmails) {
                    setIsEnabled(true);
                    setLoading(false);
                    return;
                }

                // Check Role
                let roleMatch = false;
                if (hasRoles && profile?.role) {
                    roleMatch = flag.targetRoles!.includes(profile.role);
                }

                // Check Email
                let emailMatch = false;
                if (hasEmails && user?.email) {
                    emailMatch = flag.targetEmails!.includes(user.email);
                }

                // If rules exist, user must match AT LEAST ONE rule (Role OR Email)
                // Actually, typically if both exist, usually it's OR. "Admins OR Beta Testers".
                if (roleMatch || emailMatch) {
                    setIsEnabled(true);
                } else {
                    setIsEnabled(false);
                }
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [key, user?.email, profile?.role]);

    return { isEnabled, loading };
}

// Separate hook for Admin management
export function useFeatureFlagsManagement() {
    const [flags, setFlags] = useState<FeatureFlag[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToCollection<FeatureFlag>("feature_flags", [], (data) => {
            setFlags(data);
            setLoading(false);
        }, (error) => {
            console.error("FEATURE_FLAGS_LISTENER_ERROR", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const toggleFlag = async (id: string, currentState: boolean) => {
        await updateDocument("feature_flags", id, { enabled: !currentState });
    };

    // Helper to update targeting rules
    const updateTargeting = async (id: string, roles: string[], emails: string[]) => {
        await updateDocument("feature_flags", id, { targetRoles: roles, targetEmails: emails });
    };

    return { flags, loading, toggleFlag, updateTargeting };
}
