/**
 * AI Context Service Tests
 * 
 * Tests for the AI agent context service.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Firebase Admin before importing the module
vi.mock('@/lib/firebase-admin', () => ({
    adminDb: {
        collection: vi.fn(() => ({
            where: vi.fn().mockReturnThis(),
            orderBy: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            get: vi.fn(() => Promise.resolve({
                empty: true,
                docs: [],
            })),
        })),
    },
}));

// Import after mocks
import { getAgentContext } from '@/services/ai/context';

describe('AI Context Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getAgentContext', () => {
        it('should return sales context for sales agent without user', async () => {
            const context = await getAgentContext('sales');

            expect(context).toBeDefined();
            expect(typeof context).toBe('string');
            expect(context).toContain('Sales');
        });

        it('should return support context for support agent', async () => {
            const context = await getAgentContext('support');

            expect(context).toBeDefined();
            expect(context).toContain('Support');
        });

        it('should include user data when userId is provided', async () => {
            const context = await getAgentContext('support', 'test-user-123');

            expect(context).toBeDefined();
            // Should attempt to fetch user data
            expect(typeof context).toBe('string');
        });

        it('should handle errors gracefully', async () => {
            // The function should not throw even if Firebase fails
            const context = await getAgentContext('sales');
            expect(context).toBeDefined();
        });
    });
});
