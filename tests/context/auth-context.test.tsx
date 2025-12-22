/**
 * Auth Context Tests
 * 
 * Tests for the authentication context provider.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/context/auth-context';

// Test component to access auth context
function TestAuthConsumer() {
    const { user, loading, role } = useAuth();

    if (loading) return <div data-testid="loading">Loading...</div>;
    if (user) return <div data-testid="user">{user.email}</div>;
    return <div data-testid="no-user">Not logged in</div>;
}

describe('Auth Context', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('AuthProvider', () => {
        it('should render children', () => {
            render(
                <AuthProvider>
                    <div data-testid="child">Child Content</div>
                </AuthProvider>
            );

            expect(screen.getByTestId('child')).toBeInTheDocument();
        });

        it('should start in loading state', () => {
            render(
                <AuthProvider>
                    <TestAuthConsumer />
                </AuthProvider>
            );

            // Initially should be loading
            expect(screen.getByTestId('loading')).toBeInTheDocument();
        });

        it('should show no user when not authenticated', async () => {
            render(
                <AuthProvider>
                    <TestAuthConsumer />
                </AuthProvider>
            );

            // After auth check, should show no user (mocked as null in setup.ts)
            await waitFor(() => {
                expect(screen.getByTestId('no-user')).toBeInTheDocument();
            });
        });
    });

    describe('useAuth hook', () => {
        it('should throw error when used outside provider', () => {
            // Suppress console error for this test
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            expect(() => {
                render(<TestAuthConsumer />);
            }).toThrow();

            consoleSpy.mockRestore();
        });
    });
});
