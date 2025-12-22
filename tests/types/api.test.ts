/**
 * API Types Tests
 * 
 * Tests for type guards and utility functions in types/api.ts
 */

import { describe, it, expect } from 'vitest';
import {
    isFirestoreTimestamp,
    toDate
} from '@/types/api';

describe('API Types Utilities', () => {
    describe('isFirestoreTimestamp', () => {
        it('should return true for Firestore Timestamp-like objects', () => {
            const mockTimestamp = {
                toDate: () => new Date(),
                seconds: 1234567890,
                nanoseconds: 0,
            };
            expect(isFirestoreTimestamp(mockTimestamp)).toBe(true);
        });

        it('should return false for regular Date objects', () => {
            expect(isFirestoreTimestamp(new Date())).toBe(false);
        });

        it('should return false for null/undefined', () => {
            expect(isFirestoreTimestamp(null)).toBe(false);
            expect(isFirestoreTimestamp(undefined)).toBe(false);
        });

        it('should return false for plain objects', () => {
            expect(isFirestoreTimestamp({})).toBe(false);
            expect(isFirestoreTimestamp({ seconds: 123 })).toBe(false);
        });
    });

    describe('toDate', () => {
        it('should return undefined for null/undefined', () => {
            expect(toDate(null)).toBeUndefined();
            expect(toDate(undefined)).toBeUndefined();
        });

        it('should return Date for Date input', () => {
            const date = new Date('2024-01-01');
            expect(toDate(date)).toBe(date);
        });

        it('should convert Timestamp to Date', () => {
            const mockTimestamp = {
                toDate: () => new Date('2024-01-01'),
                seconds: 1704067200,
                nanoseconds: 0,
            };
            const result = toDate(mockTimestamp);
            expect(result).toBeInstanceOf(Date);
            expect(result?.toISOString()).toContain('2024-01-01');
        });

        it('should handle seconds-only objects', () => {
            const secondsObj = { seconds: 1704067200, nanoseconds: 0 };
            const result = toDate(secondsObj);
            expect(result).toBeInstanceOf(Date);
        });
    });
});
