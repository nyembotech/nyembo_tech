/**
 * Error Handler Utility
 * 
 * Consistent error handling across all API routes and server actions.
 */

import { NextResponse } from 'next/server';
import { ApiErrorResponse, ErrorCode } from '@/types/api';

interface ErrorDetails {
    code: ErrorCode;
    message: string;
    status: number;
    details?: unknown;
}

/**
 * Standard error mappings for common scenarios.
 */
const ERROR_TEMPLATES: Record<ErrorCode, Omit<ErrorDetails, 'details'>> = {
    VALIDATION_ERROR: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        status: 400,
    },
    BAD_REQUEST: {
        code: 'BAD_REQUEST',
        message: 'Bad request',
        status: 400,
    },
    AUTHENTICATION_ERROR: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Authentication required',
        status: 401,
    },
    AUTHORIZATION_ERROR: {
        code: 'AUTHORIZATION_ERROR',
        message: 'Access denied',
        status: 403,
    },
    NOT_FOUND: {
        code: 'NOT_FOUND',
        message: 'Resource not found',
        status: 404,
    },
    RATE_LIMITED: {
        code: 'RATE_LIMITED',
        message: 'Too many requests',
        status: 429,
    },
    INTERNAL_ERROR: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        status: 500,
    },
    SERVICE_UNAVAILABLE: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'Service temporarily unavailable',
        status: 503,
    },
};

/**
 * Create an API error response.
 */
export function apiError(
    code: ErrorCode,
    message?: string,
    details?: unknown
): NextResponse<ApiErrorResponse> {
    const template = ERROR_TEMPLATES[code];

    return NextResponse.json<ApiErrorResponse>(
        {
            success: false,
            error: {
                code: template.code,
                message: message || template.message,
                status: template.status,
                details,
            },
        },
        { status: template.status }
    );
}

/**
 * Handle unknown errors and convert to standardized response.
 */
export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
    console.error('API Error:', error);

    // Zod validation errors
    if (error instanceof Error && error.name === 'ZodError') {
        return apiError('VALIDATION_ERROR', 'Validation failed', error);
    }

    // Firebase errors
    if (error instanceof Error && error.message.includes('Firebase')) {
        if (error.message.includes('permission')) {
            return apiError('AUTHORIZATION_ERROR', 'Database access denied');
        }
        return apiError('SERVICE_UNAVAILABLE', 'Database service error');
    }

    // Generic errors
    if (error instanceof Error) {
        // Don't expose internal error messages in production
        const message = process.env.NODE_ENV === 'development'
            ? error.message
            : 'An unexpected error occurred';
        return apiError('INTERNAL_ERROR', message);
    }

    return apiError('INTERNAL_ERROR');
}

/**
 * Type guard for catch block errors.
 */
export function isError(error: unknown): error is Error {
    return error instanceof Error;
}

/**
 * Get error message safely from unknown error.
 */
export function getErrorMessage(error: unknown): string {
    if (isError(error)) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'An unknown error occurred';
}

/**
 * Log error with context (for Sentry integration).
 */
export function logError(
    error: unknown,
    context?: Record<string, unknown>
): void {
    console.error('Error:', {
        message: getErrorMessage(error),
        stack: isError(error) ? error.stack : undefined,
        context,
    });

    // TODO: Integrate with Sentry
    // Sentry.captureException(error, { extra: context });
}
