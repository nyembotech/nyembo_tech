/**
 * API Middleware
 * 
 * Provides authentication, rate limiting, and security audit logging for API routes.
 * Used by API route handlers to protect endpoints.
 */

import { NextRequest, NextResponse } from 'next/server';
import { apiRateLimit, aiRateLimit, authRateLimit, checkRateLimit } from './rate-limit';
import { logSecurityEvent, logAuthFailure, logUnauthorizedAccess } from './security-audit';
import { apiError } from './error-handler';

// Routes that require authentication
const PROTECTED_API_ROUTES = [
    '/api/admin',
    '/api/user',
    '/api/insights',
];

// Routes with stricter rate limiting (AI endpoints)
const AI_RATE_LIMITED_ROUTES = [
    '/api/agent',
    '/api/architect',
    '/api/insights',
];

// Routes with auth rate limiting (login, signup)
const AUTH_RATE_LIMITED_ROUTES = [
    '/api/auth',
];

type RateLimiter = typeof apiRateLimit;

/**
 * Get the appropriate rate limiter for a route
 */
function getRateLimiter(pathname: string): RateLimiter {
    if (AI_RATE_LIMITED_ROUTES.some(route => pathname.startsWith(route))) {
        return aiRateLimit;
    }
    if (AUTH_RATE_LIMITED_ROUTES.some(route => pathname.startsWith(route))) {
        return authRateLimit;
    }
    return apiRateLimit;
}

/**
 * Get client identifier for rate limiting
 */
function getClientIdentifier(request: NextRequest): string {
    // Try to get user ID from authorization header if available
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
        // Use a hash of the token for rate limiting (don't store full token)
        const token = authHeader.substring(7);
        return `token:${hashString(token.substring(0, 20))}`;
    }

    // Fall back to IP address
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        'unknown';
    return `ip:${ip}`;
}

/**
 * Simple string hash for rate limiting identifiers
 */
function hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
}

/**
 * Check if route requires authentication
 */
function requiresAuth(pathname: string): boolean {
    return PROTECTED_API_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Get client IP from request
 */
function getClientIP(request: NextRequest): string {
    const forwardedFor = request.headers.get('x-forwarded-for');
    return forwardedFor?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        'unknown';
}

/**
 * Verify Firebase ID token from Authorization header
 * Returns user claims if valid, null otherwise
 */
async function verifyAuthToken(request: NextRequest): Promise<{ uid: string; role?: string } | null> {
    const authHeader = request.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.substring(7);

    try {
        // Dynamic import to avoid loading firebase-admin on every request
        const { adminAuth } = await import('./firebase-admin');
        const decodedToken = await adminAuth.verifyIdToken(token);

        return {
            uid: decodedToken.uid,
            role: decodedToken.role as string | undefined,
        };
    } catch (error) {
        // Token verification failed
        return null;
    }
}

export interface APIMiddlewareResult {
    authorized: boolean;
    user?: { uid: string; role?: string };
    response?: NextResponse;
}

/**
 * Main API middleware function.
 * Call this at the start of protected API routes.
 * 
 * @example
 * ```typescript
 * export async function POST(request: NextRequest) {
 *     const { authorized, user, response } = await apiMiddleware(request);
 *     if (!authorized) return response;
 *     
 *     // Continue with request handling...
 * }
 * ```
 */
export async function apiMiddleware(
    request: NextRequest,
    options: { requireAuth?: boolean; requiredRole?: string } = {}
): Promise<APIMiddlewareResult> {
    const pathname = new URL(request.url).pathname;
    const clientId = getClientIdentifier(request);
    const clientIP = getClientIP(request);

    // 1. Rate Limiting
    const limiter = getRateLimiter(pathname);
    const { allowed, headers, retryAfter } = await checkRateLimit(limiter, clientId);

    if (!allowed) {
        // Log rate limit exceeded
        await logSecurityEvent({
            type: 'rate_limit_exceeded',
            ip: clientIP,
            path: pathname,
            details: `Rate limit exceeded. Retry after ${retryAfter}s`,
            severity: 'medium',
        });

        return {
            authorized: false,
            response: new NextResponse(
                JSON.stringify({
                    success: false,
                    error: {
                        code: 'RATE_LIMITED',
                        message: 'Too many requests. Please try again later.',
                        retryAfter,
                    }
                }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        ...headers,
                    }
                }
            ),
        };
    }

    // 2. Authentication (if required)
    const needsAuth = options.requireAuth ?? requiresAuth(pathname);

    if (needsAuth) {
        const user = await verifyAuthToken(request);

        if (!user) {
            await logAuthFailure(
                `Failed authentication attempt on ${pathname}`,
                clientIP
            );

            return {
                authorized: false,
                response: new NextResponse(
                    JSON.stringify({
                        success: false,
                        error: {
                            code: 'AUTHENTICATION_ERROR',
                            message: 'Authentication required',
                            status: 401,
                        }
                    }),
                    {
                        status: 401,
                        headers: {
                            'Content-Type': 'application/json',
                            'WWW-Authenticate': 'Bearer',
                            ...headers,
                        }
                    }
                ),
            };
        }

        // 3. Role-based authorization (if required)
        if (options.requiredRole && user.role !== options.requiredRole) {
            if (options.requiredRole === 'admin' && user.role !== 'admin') {
                await logUnauthorizedAccess(pathname, user.uid, clientIP);

                return {
                    authorized: false,
                    response: new NextResponse(
                        JSON.stringify({
                            success: false,
                            error: {
                                code: 'AUTHORIZATION_ERROR',
                                message: 'Insufficient permissions',
                                status: 403,
                            }
                        }),
                        {
                            status: 403,
                            headers: {
                                'Content-Type': 'application/json',
                                ...headers,
                            }
                        }
                    ),
                };
            }
        }

        return { authorized: true, user };
    }

    return { authorized: true };
}

/**
 * Quick rate limit check for public endpoints
 * Use when you just need rate limiting without auth
 */
export async function checkApiRateLimit(request: NextRequest): Promise<APIMiddlewareResult> {
    return apiMiddleware(request, { requireAuth: false });
}

/**
 * Full auth + rate limit check for protected endpoints
 */
export async function requireApiAuth(
    request: NextRequest,
    requiredRole?: string
): Promise<APIMiddlewareResult> {
    return apiMiddleware(request, { requireAuth: true, requiredRole });
}
