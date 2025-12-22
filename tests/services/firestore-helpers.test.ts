/**
 * Firestore Helpers Tests
 * 
 * Tests for multi-tenant Firestore query helpers.
 */

import { describe, it, expect } from 'vitest';
import {
    isTenantScoped,
    isGlobalCollection,
    TENANT_SCOPED_COLLECTIONS,
    GLOBAL_COLLECTIONS
} from '@/lib/firestore-helpers';

describe('Firestore Helpers', () => {
    describe('isTenantScoped', () => {
        it('should return true for tenant-scoped collections', () => {
            expect(isTenantScoped('customers')).toBe(true);
            expect(isTenantScoped('projects')).toBe(true);
            expect(isTenantScoped('tickets')).toBe(true);
            expect(isTenantScoped('activity_log')).toBe(true);
        });

        it('should return false for global collections', () => {
            expect(isTenantScoped('users')).toBe(false);
            expect(isTenantScoped('organizations')).toBe(false);
            expect(isTenantScoped('content')).toBe(false);
        });

        it('should return false for unknown collections', () => {
            expect(isTenantScoped('unknown_collection')).toBe(false);
        });
    });

    describe('isGlobalCollection', () => {
        it('should return true for global collections', () => {
            expect(isGlobalCollection('users')).toBe(true);
            expect(isGlobalCollection('organizations')).toBe(true);
            expect(isGlobalCollection('content')).toBe(true);
        });

        it('should return false for tenant-scoped collections', () => {
            expect(isGlobalCollection('customers')).toBe(false);
            expect(isGlobalCollection('projects')).toBe(false);
        });
    });

    describe('Collection constants', () => {
        it('should have tenant-scoped collections defined', () => {
            expect(TENANT_SCOPED_COLLECTIONS).toBeDefined();
            expect(Array.isArray(TENANT_SCOPED_COLLECTIONS)).toBe(true);
            expect(TENANT_SCOPED_COLLECTIONS.length).toBeGreaterThan(0);
        });

        it('should have global collections defined', () => {
            expect(GLOBAL_COLLECTIONS).toBeDefined();
            expect(Array.isArray(GLOBAL_COLLECTIONS)).toBe(true);
            expect(GLOBAL_COLLECTIONS.length).toBeGreaterThan(0);
        });

        it('should not have overlapping collections', () => {
            const overlap = TENANT_SCOPED_COLLECTIONS.filter(c =>
                GLOBAL_COLLECTIONS.includes(c)
            );
            expect(overlap).toHaveLength(0);
        });
    });
});
