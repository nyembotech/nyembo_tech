"use client";

import { useAnalytics } from "@/hooks/use-analytics";

export function AnalyticsWrapper() {
    useAnalytics();
    return null;
}
