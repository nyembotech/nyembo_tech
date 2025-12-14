"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { logActivity } from "@/services/activity-log";
import { useAuthContext } from "@/contexts/auth-context";

// This hook triggers on route changes and logs "page_view" events
// It acts as a lightweight, first-party analytics system stored in Firestore
export const useAnalytics = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { user } = useAuthContext();

    useEffect(() => {
        // Debounce or check initialization if strictly needed, 
        // but Next.js effect cleanup handles quick route shifts well enough.

        const handlePageView = async () => {
            try {
                // We log as "system" if unauthenticated, or user ID if logged in
                // Using 'info' level for standard tracking
                await logActivity({
                    type: "info",
                    actorId: user?.uid || "anonymous",
                    targetType: "system", // or 'marketing' if we expand types
                    targetId: "page_view",
                    message: `Page View: ${pathname}`,
                    visibility: "admin", // Only admins see raw traffic logs
                    metadata: {
                        path: pathname,
                        query: searchParams.toString(),
                        referrer: document.referrer,
                        ua: navigator.userAgent
                    }
                });
            } catch (error) {
                // Silently fail to not disrupt UX
                console.error("Analytics error", error);
            }
        };

        handlePageView();

    }, [pathname, searchParams, user?.uid]);
};
