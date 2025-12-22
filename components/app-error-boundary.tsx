"use client";

import { ErrorBoundary } from "@/components/error-boundary";
import { ReactNode } from "react";

interface AppErrorBoundaryProps {
    children: ReactNode;
}

/**
 * App-level Error Boundary wrapper for use in layouts.
 * Wraps content with React Error Boundary for graceful error handling.
 */
export function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
    return (
        <ErrorBoundary
            onError={(error, errorInfo) => {
                // Log to console (will be stripped in production via next.config)
                console.error("App Error Boundary caught:", error.message);

                // TODO: Log to Sentry
                // Sentry.captureException(error, { extra: { componentStack: errorInfo.componentStack } });
            }}
        >
            {children}
        </ErrorBoundary>
    );
}

/**
 * Admin-specific error boundary with additional context
 */
export function AdminErrorBoundary({ children }: AppErrorBoundaryProps) {
    return (
        <ErrorBoundary
            onError={(error, errorInfo) => {
                console.error("Admin Error Boundary caught:", error.message);
                // Add admin context for error tracking
            }}
        >
            {children}
        </ErrorBoundary>
    );
}

/**
 * Portal-specific error boundary for customer-facing areas
 */
export function PortalErrorBoundary({ children }: AppErrorBoundaryProps) {
    return (
        <ErrorBoundary
            onError={(error, errorInfo) => {
                console.error("Portal Error Boundary caught:", error.message);
                // Add customer context for error tracking
            }}
        >
            {children}
        </ErrorBoundary>
    );
}
