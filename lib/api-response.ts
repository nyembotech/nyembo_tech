import { NextResponse } from 'next/server';

export interface ApiError {
    error: string;
    code?: string;
    details?: Record<string, unknown>;
    timestamp: string;
}

export interface ApiSuccess<T = unknown> {
    data: T;
    timestamp: string;
}

/**
 * Standardized API response helper.
 * 
 * Ensures all API routes return consistent JSON format with timestamps.
 * 
 * @example
 * ```typescript
 * // Success response
 * return ApiResponse.success({ user: userData });
 * 
 * // Error response  
 * return ApiResponse.badRequest('Invalid email format');
 * 
 * // Not found
 * return ApiResponse.notFound('User not found');
 * ```
 */
export class ApiResponse {
    static success<T>(data: T, status: number = 200): NextResponse<ApiSuccess<T>> {
        return NextResponse.json(
            { data, timestamp: new Date().toISOString() },
            { status }
        );
    }

    static error(
        message: string,
        status: number = 500,
        code?: string,
        details?: Record<string, unknown>
    ): NextResponse<ApiError> {
        return NextResponse.json(
            {
                error: message,
                code,
                details,
                timestamp: new Date().toISOString(),
            },
            { status }
        );
    }

    static badRequest(message: string, details?: Record<string, unknown>): NextResponse<ApiError> {
        return this.error(message, 400, 'BAD_REQUEST', details);
    }

    static unauthorized(message: string = 'Unauthorized'): NextResponse<ApiError> {
        return this.error(message, 401, 'UNAUTHORIZED');
    }

    static forbidden(message: string = 'Forbidden'): NextResponse<ApiError> {
        return this.error(message, 403, 'FORBIDDEN');
    }

    static notFound(message: string = 'Resource not found'): NextResponse<ApiError> {
        return this.error(message, 404, 'NOT_FOUND');
    }

    static conflict(message: string, details?: Record<string, unknown>): NextResponse<ApiError> {
        return this.error(message, 409, 'CONFLICT', details);
    }

    static tooManyRequests(retryAfter: number): NextResponse<ApiError> {
        const response = this.error(
            'Too many requests. Please slow down.',
            429,
            'RATE_LIMIT_EXCEEDED',
            { retryAfter }
        );
        response.headers.set('Retry-After', String(retryAfter));
        return response;
    }

    static serverError(message: string = 'Internal server error'): NextResponse<ApiError> {
        return this.error(message, 500, 'INTERNAL_ERROR');
    }
}
