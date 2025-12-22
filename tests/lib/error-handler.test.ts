/**
 * Error Handler Service Tests
 * 
 * Tests for the centralized error handling utility.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    apiError,
    handleApiError,
    getErrorMessage,
    isError,
    logError
} from '@/lib/error-handler';

describe('Error Handler', () => {
    beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    describe('apiError', () => {
        it('should return a validation error response', async () => {
            const response = apiError('VALIDATION_ERROR');
            const body = await response.json();

            expect(response.status).toBe(400);
            expect(body.success).toBe(false);
            expect(body.error.code).toBe('VALIDATION_ERROR');
        });

        it('should use custom message when provided', async () => {
            const response = apiError('NOT_FOUND', 'User not found');
            const body = await response.json();

            expect(response.status).toBe(404);
            expect(body.error.message).toBe('User not found');
        });

        it('should include details when provided', async () => {
            const details = { field: 'email', reason: 'invalid format' };
            const response = apiError('VALIDATION_ERROR', undefined, details);
            const body = await response.json();

            expect(body.error.details).toEqual(details);
        });
    });

    describe('handleApiError', () => {
        it('should handle Error instances', async () => {
            const error = new Error('Test error');
            const response = handleApiError(error);
            const body = await response.json();

            expect(response.status).toBe(500);
            expect(body.error.code).toBe('INTERNAL_ERROR');
        });

        it('should handle Firebase permission errors', async () => {
            const error = new Error('Firebase: permission-denied');
            const response = handleApiError(error);
            const body = await response.json();

            expect(response.status).toBe(403);
            expect(body.error.code).toBe('AUTHORIZATION_ERROR');
        });

        it('should handle unknown error types', async () => {
            const response = handleApiError('string error');
            const body = await response.json();

            expect(response.status).toBe(500);
            expect(body.error.code).toBe('INTERNAL_ERROR');
        });
    });

    describe('getErrorMessage', () => {
        it('should extract message from Error', () => {
            const error = new Error('Test message');
            expect(getErrorMessage(error)).toBe('Test message');
        });

        it('should handle string errors', () => {
            expect(getErrorMessage('String error')).toBe('String error');
        });

        it('should handle unknown types', () => {
            expect(getErrorMessage(undefined)).toBe('An unknown error occurred');
            expect(getErrorMessage(null)).toBe('An unknown error occurred');
            expect(getErrorMessage(123)).toBe('An unknown error occurred');
        });
    });

    describe('isError', () => {
        it('should return true for Error instances', () => {
            expect(isError(new Error())).toBe(true);
            expect(isError(new TypeError())).toBe(true);
        });

        it('should return false for non-errors', () => {
            expect(isError('string')).toBe(false);
            expect(isError(null)).toBe(false);
            expect(isError(undefined)).toBe(false);
            expect(isError({})).toBe(false);
        });
    });

    describe('logError', () => {
        it('should log error with context', () => {
            const consoleSpy = vi.spyOn(console, 'error');
            const error = new Error('Test error');

            logError(error, { userId: '123' });

            expect(consoleSpy).toHaveBeenCalledWith('Error:', expect.objectContaining({
                message: 'Test error',
                context: { userId: '123' },
            }));
        });
    });
});
