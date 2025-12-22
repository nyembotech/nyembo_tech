/**
 * Cache Utility
 * 
 * In-memory caching with TTL support.
 * For production with multiple instances, upgrade to Redis.
 */

export interface CacheEntry<T> {
    value: T;
    expiresAt: number;
    createdAt: number;
}

export interface CacheOptions {
    ttlMs: number;
    maxSize?: number;
}

/**
 * In-memory cache implementation with TTL and LRU eviction.
 */
export class MemoryCache<T = unknown> {
    private cache: Map<string, CacheEntry<T>> = new Map();
    private readonly ttlMs: number;
    private readonly maxSize: number;

    constructor(options: CacheOptions) {
        this.ttlMs = options.ttlMs;
        this.maxSize = options.maxSize ?? 1000;

        // Periodic cleanup every minute
        if (typeof setInterval !== 'undefined') {
            setInterval(() => this.cleanup(), 60000);
        }
    }

    /**
     * Get value from cache
     */
    get(key: string): T | undefined {
        const entry = this.cache.get(key);

        if (!entry) return undefined;

        // Check expiration
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return undefined;
        }

        return entry.value;
    }

    /**
     * Set value in cache
     */
    set(key: string, value: T, ttlMs?: number): void {
        // Evict oldest entry if at max size
        if (this.cache.size >= this.maxSize) {
            const oldestKey = this.cache.keys().next().value;
            if (oldestKey) this.cache.delete(oldestKey);
        }

        this.cache.set(key, {
            value,
            expiresAt: Date.now() + (ttlMs ?? this.ttlMs),
            createdAt: Date.now(),
        });
    }

    /**
     * Delete value from cache
     */
    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    /**
     * Check if key exists and is valid
     */
    has(key: string): boolean {
        return this.get(key) !== undefined;
    }

    /**
     * Get or set pattern
     */
    async getOrSet(key: string, factory: () => Promise<T>, ttlMs?: number): Promise<T> {
        const cached = this.get(key);
        if (cached !== undefined) {
            return cached;
        }

        const value = await factory();
        this.set(key, value, ttlMs);
        return value;
    }

    /**
     * Clear all cache entries
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Get cache stats
     */
    stats(): { size: number; maxSize: number } {
        return {
            size: this.cache.size,
            maxSize: this.maxSize,
        };
    }

    /**
     * Remove expired entries
     */
    private cleanup(): void {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now > entry.expiresAt) {
                this.cache.delete(key);
            }
        }
    }
}

// Pre-configured cache instances
const FIFTEEN_MINUTES = 15 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;
const ONE_DAY = 24 * 60 * 60 * 1000;

/**
 * Cache for AI context (15 minute TTL)
 */
export const contextCache = new MemoryCache<string>({
    ttlMs: FIFTEEN_MINUTES,
    maxSize: 500,
});

/**
 * Cache for translations (1 day TTL)
 */
export const translationCache = new MemoryCache<Record<string, string>>({
    ttlMs: ONE_DAY,
    maxSize: 1000,
});

/**
 * Cache for insights (15 minute TTL, matches existing Firestore cache)
 */
export const insightsCache = new MemoryCache<unknown[]>({
    ttlMs: FIFTEEN_MINUTES,
    maxSize: 200,
});

/**
 * Generate cache key from parameters
 */
export function cacheKey(...parts: (string | number | undefined)[]): string {
    return parts.filter(Boolean).join(':');
}

/**
 * Hash a string for cache key (for long strings like prompts)
 */
export function hashForCache(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
}
