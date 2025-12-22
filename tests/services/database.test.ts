/**
 * Database Service Tests
 * 
 * Tests for the Firestore database service utilities.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Database Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('subscribeToCollection', () => {
        it('should be defined', async () => {
            const { subscribeToCollection } = await import('@/services/firebase/database');
            expect(subscribeToCollection).toBeDefined();
            expect(typeof subscribeToCollection).toBe('function');
        });
    });

    describe('subscribeToDocument', () => {
        it('should be defined', async () => {
            const { subscribeToDocument } = await import('@/services/firebase/database');
            expect(subscribeToDocument).toBeDefined();
            expect(typeof subscribeToDocument).toBe('function');
        });
    });

    describe('createDocument', () => {
        it('should be defined', async () => {
            const { createDocument } = await import('@/services/firebase/database');
            expect(createDocument).toBeDefined();
            expect(typeof createDocument).toBe('function');
        });
    });

    describe('updateDocument', () => {
        it('should be defined', async () => {
            const { updateDocument } = await import('@/services/firebase/database');
            expect(updateDocument).toBeDefined();
            expect(typeof updateDocument).toBe('function');
        });
    });

    describe('deleteDocument', () => {
        it('should be defined', async () => {
            const { deleteDocument } = await import('@/services/firebase/database');
            expect(deleteDocument).toBeDefined();
            expect(typeof deleteDocument).toBe('function');
        });
    });
});
