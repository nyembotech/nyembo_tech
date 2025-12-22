/**
 * Rate limiting utilities using in-memory storage.
 * 
 * For production with multiple instances, replace with Redis-based solution.
 * To use Upstash Redis:
 * 1. npm install @upstash/ratelimit @upstash/redis
 * 2. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN env vars
 * 3. Replace InMemoryRateLimiter with Upstash Ratelimit
 */

interface RateLimitWindow {
    count: number;
    resetAt: number;
}

interface RateLimitResult {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
}

/**
 * Simple in-memory rate limiter for development/single-instance deployments.
 * Uses sliding window algorithm.
 */
class InMemoryRateLimiter {
    private windows: Map<string, RateLimitWindow> = new Map();
    private readonly maxRequests: number;
    private readonly windowMs: number;

    constructor(maxRequests: number, windowMs: number) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;

        // Clean up expired windows every minute
        setInterval(() => this.cleanup(), 60000);
    }

    private cleanup(): void {
        const now = Date.now();
        for (const [key, window] of this.windows.entries()) {
            if (window.resetAt < now) {
                this.windows.delete(key);
            }
        }
    }

    async check(identifier: string): Promise<RateLimitResult> {
        const now = Date.now();
        const key = identifier;

        let window = this.windows.get(key);

        // Start new window if expired or doesn't exist
        if (!window || window.resetAt < now) {
            window = {
                count: 0,
                resetAt: now + this.windowMs,
            };
        }

        window.count++;
        this.windows.set(key, window);

        const success = window.count <= this.maxRequests;
        const remaining = Math.max(0, this.maxRequests - window.count);

        return {
            success,
            limit: this.maxRequests,
            remaining,
            reset: window.resetAt,
        };
    }

    async reset(identifier: string): Promise<void> {
        this.windows.delete(identifier);
    }
}

/**
 * Rate limiter for AI endpoints.
 * Limit: 10 requests per minute per user/session.
 */
export const aiRateLimit = new InMemoryRateLimiter(10, 60 * 1000);

/**
 * Rate limiter for general API endpoints.
 * Limit: 100 requests per minute per IP.
 */
export const apiRateLimit = new InMemoryRateLimiter(100, 60 * 1000);

/**
 * Rate limiter for authentication endpoints.
 * Limit: 5 requests per minute per IP (stricter to prevent brute force).
 */
export const authRateLimit = new InMemoryRateLimiter(5, 60 * 1000);

/**
 * Helper to check rate limit and return appropriate response if exceeded.
 */
export async function checkRateLimit(
    limiter: InMemoryRateLimiter,
    identifier: string
): Promise<{ allowed: boolean; headers: Record<string, string>; retryAfter?: number }> {
    const result = await limiter.check(identifier);

    const headers: Record<string, string> = {
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(Math.ceil(result.reset / 1000)),
    };

    if (!result.success) {
        const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);
        headers['Retry-After'] = String(retryAfter);
        return { allowed: false, headers, retryAfter };
    }

    return { allowed: true, headers };
}
