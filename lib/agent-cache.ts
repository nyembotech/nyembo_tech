/**
 * Agent Response Cache
 * 
 * Caches AI agent responses to reduce API calls and costs.
 * Uses content-based hashing to identify similar queries.
 */

import { MemoryCache, hashForCache, cacheKey } from './cache';

export interface CachedAgentResponse {
    content: string;
    agentType: 'sales' | 'support';
    createdAt: number;
    expiresAt: number;
}

// Cache with 30-minute TTL for agent responses
const agentResponseCache = new MemoryCache<CachedAgentResponse>({
    ttlMs: 30 * 60 * 1000, // 30 minutes
    maxSize: 500,
});

/**
 * Generate cache key for agent query
 */
function getAgentCacheKey(
    agentType: string,
    lastMessage: string,
    userId?: string
): string {
    // Hash the message content for the key
    const messageHash = hashForCache(lastMessage.toLowerCase().trim());
    return cacheKey('agent', agentType, userId || 'anon', messageHash);
}

/**
 * Check if a cached response exists for this query
 */
export function getCachedAgentResponse(
    agentType: 'sales' | 'support',
    lastMessage: string,
    userId?: string
): CachedAgentResponse | undefined {
    const key = getAgentCacheKey(agentType, lastMessage, userId);
    return agentResponseCache.get(key);
}

/**
 * Cache an agent response
 */
export function cacheAgentResponse(
    agentType: 'sales' | 'support',
    lastMessage: string,
    response: string,
    userId?: string
): void {
    const key = getAgentCacheKey(agentType, lastMessage, userId);

    agentResponseCache.set(key, {
        content: response,
        agentType,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * 60 * 1000,
    });
}

/**
 * Get cache stats
 */
export function getAgentCacheStats() {
    return agentResponseCache.stats();
}

/**
 * Clear agent cache (useful for testing)
 */
export function clearAgentCache(): void {
    agentResponseCache.clear();
}

/**
 * Common FAQ patterns that should be cached more aggressively
 */
export const FAQ_PATTERNS = [
    /what.*services/i,
    /how much.*cost/i,
    /pricing/i,
    /contact/i,
    /hours/i,
    /location/i,
    /support.*available/i,
    /get started/i,
    /sign up/i,
    /demo/i,
];

/**
 * Check if a message matches a common FAQ pattern
 */
export function isFAQMessage(message: string): boolean {
    return FAQ_PATTERNS.some(pattern => pattern.test(message));
}

/**
 * Get longer TTL for FAQ messages
 */
export function getFAQCacheTTL(message: string): number {
    if (isFAQMessage(message)) {
        return 2 * 60 * 60 * 1000; // 2 hours for FAQs
    }
    return 30 * 60 * 1000; // 30 minutes default
}
