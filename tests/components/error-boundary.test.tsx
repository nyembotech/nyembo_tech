/**
 * Error Boundary Tests
 * 
 * Tests for the Error Boundary component.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary, withErrorBoundary } from '@/components/error-boundary';

// Component that throws an error
function ThrowingComponent({ shouldThrow = true }: { shouldThrow?: boolean }) {
    if (shouldThrow) {
        throw new Error('Test error');
    }
    return <div data-testid="success">No error</div>;
}

// Suppress console.error during tests
const originalError = console.error;
beforeEach(() => {
    console.error = vi.fn();
});

afterEach(() => {
    console.error = originalError;
});

describe('Error Boundary', () => {
    describe('ErrorBoundary component', () => {
        it('should render children when no error', () => {
            render(
                <ErrorBoundary>
                    <div data-testid="child">Child Content</div>
                </ErrorBoundary>
            );

            expect(screen.getByTestId('child')).toBeInTheDocument();
        });

        it('should catch errors and show fallback UI', () => {
            render(
                <ErrorBoundary>
                    <ThrowingComponent />
                </ErrorBoundary>
            );

            expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        });

        it('should render custom fallback when provided', () => {
            render(
                <ErrorBoundary fallback={<div data-testid="custom-fallback">Custom Error</div>}>
                    <ThrowingComponent />
                </ErrorBoundary>
            );

            expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
        });

        it('should call onError callback when error occurs', () => {
            const onError = vi.fn();

            render(
                <ErrorBoundary onError={onError}>
                    <ThrowingComponent />
                </ErrorBoundary>
            );

            expect(onError).toHaveBeenCalledTimes(1);
            expect(onError).toHaveBeenCalledWith(
                expect.any(Error),
                expect.objectContaining({ componentStack: expect.any(String) })
            );
        });

        it('should have a Try Again button', () => {
            render(
                <ErrorBoundary>
                    <ThrowingComponent />
                </ErrorBoundary>
            );

            expect(screen.getByText('Try Again')).toBeInTheDocument();
        });

        it('should have a Reload Page button', () => {
            render(
                <ErrorBoundary>
                    <ThrowingComponent />
                </ErrorBoundary>
            );

            expect(screen.getByText('Reload Page')).toBeInTheDocument();
        });
    });

    describe('withErrorBoundary HOC', () => {
        it('should wrap component with error boundary', () => {
            const WrappedComponent = withErrorBoundary(() => (
                <div data-testid="wrapped">Wrapped Content</div>
            ));

            render(<WrappedComponent />);

            expect(screen.getByTestId('wrapped')).toBeInTheDocument();
        });

        it('should catch errors in wrapped component', () => {
            const WrappedThrowingComponent = withErrorBoundary(ThrowingComponent);

            render(<WrappedThrowingComponent />);

            expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        });

        it('should accept custom fallback', () => {
            const WrappedThrowingComponent = withErrorBoundary(
                ThrowingComponent,
                <div data-testid="hoc-fallback">HOC Fallback</div>
            );

            render(<WrappedThrowingComponent />);

            expect(screen.getByTestId('hoc-fallback')).toBeInTheDocument();
        });
    });
});
