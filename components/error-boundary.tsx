"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors in child components and displays a fallback UI.
 * Logs errors to console and optionally to external services.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log to console
        console.error("Error Boundary caught an error:", error, errorInfo);

        // Call optional error handler (for Sentry, etc.)
        this.props.onError?.(error, errorInfo);

        // TODO: Log to Sentry
        // Sentry.captureException(error, { extra: { componentStack: errorInfo.componentStack } });
    }

    handleRetry = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Custom fallback
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="min-h-[400px] flex items-center justify-center p-8">
                    <Card className="max-w-md w-full bg-card/50 border-destructive/50">
                        <CardHeader className="text-center">
                            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                                <AlertTriangle className="w-6 h-6 text-destructive" />
                            </div>
                            <CardTitle className="text-destructive">Something went wrong</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground text-center text-sm">
                                An unexpected error occurred. Please try again or contact support if the problem persists.
                            </p>
                            {process.env.NODE_ENV === "development" && this.state.error && (
                                <details className="text-xs bg-muted/50 rounded p-3">
                                    <summary className="cursor-pointer text-muted-foreground font-medium">
                                        Error Details
                                    </summary>
                                    <pre className="mt-2 whitespace-pre-wrap break-words text-destructive">
                                        {this.state.error.message}
                                    </pre>
                                </details>
                            )}
                            <div className="flex justify-center gap-4 pt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => window.location.reload()}
                                    className="gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Reload Page
                                </Button>
                                <Button onClick={this.handleRetry}>
                                    Try Again
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * Functional wrapper for using ErrorBoundary with hooks
 */
export function withErrorBoundary<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    fallback?: ReactNode
) {
    return function WithErrorBoundary(props: P) {
        return (
            <ErrorBoundary fallback={fallback}>
                <WrappedComponent {...props} />
            </ErrorBoundary>
        );
    };
}
