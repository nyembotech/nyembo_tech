/**
 * Metrics Utility
 * 
 * Application metrics collection and reporting.
 * Integrates with external monitoring services.
 */

export interface Metric {
    name: string;
    value: number;
    unit: 'ms' | 'count' | 'percent' | 'bytes';
    tags?: Record<string, string>;
    timestamp: number;
}

export interface MetricsSummary {
    apiLatency: { avg: number; p95: number; p99: number };
    errorRate: number;
    cacheHitRate: number;
    requestCount: number;
    aiApiCalls: number;
    aiApiCost: number;
}

// In-memory metrics storage (replace with time-series DB in production)
const metricsStore: Metric[] = [];
const MAX_METRICS = 10000;

/**
 * Record a metric
 */
export function recordMetric(
    name: string,
    value: number,
    unit: Metric['unit'] = 'count',
    tags?: Record<string, string>
): void {
    // Evict old metrics if at limit
    if (metricsStore.length >= MAX_METRICS) {
        metricsStore.shift();
    }

    metricsStore.push({
        name,
        value,
        unit,
        tags,
        timestamp: Date.now(),
    });
}

/**
 * Record API latency
 */
export function recordLatency(route: string, durationMs: number): void {
    recordMetric('api.latency', durationMs, 'ms', { route });
}

/**
 * Record API error
 */
export function recordError(route: string, errorType: string): void {
    recordMetric('api.error', 1, 'count', { route, type: errorType });
}

/**
 * Record cache hit/miss
 */
export function recordCacheAccess(cache: string, hit: boolean): void {
    recordMetric('cache.access', 1, 'count', { cache, result: hit ? 'hit' : 'miss' });
}

/**
 * Record AI API call
 */
export function recordAICall(
    model: string,
    route: string,
    tokens: number,
    success: boolean
): void {
    recordMetric('ai.call', 1, 'count', {
        model,
        route,
        success: String(success)
    });
    recordMetric('ai.tokens', tokens, 'count', { model });
}

/**
 * Get metrics for a time window
 */
export function getMetrics(
    name?: string,
    windowMs: number = 3600000 // 1 hour default
): Metric[] {
    const cutoff = Date.now() - windowMs;

    return metricsStore.filter(m =>
        m.timestamp > cutoff && (!name || m.name === name)
    );
}

/**
 * Calculate percentile from values
 */
function percentile(values: number[], p: number): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
}

/**
 * Get summary of key metrics
 */
export function getMetricsSummary(windowMs: number = 3600000): MetricsSummary {
    const metrics = getMetrics(undefined, windowMs);

    // API Latency
    const latencyMetrics = metrics.filter(m => m.name === 'api.latency');
    const latencies = latencyMetrics.map(m => m.value);

    // Error Rate
    const errorCount = metrics.filter(m => m.name === 'api.error').length;
    const totalRequests = metrics.filter(m =>
        m.name === 'api.latency' || m.name === 'api.error'
    ).length;

    // Cache Hit Rate
    const cacheMetrics = metrics.filter(m => m.name === 'cache.access');
    const cacheHits = cacheMetrics.filter(m => m.tags?.result === 'hit').length;

    // AI Calls
    const aiCalls = metrics.filter(m => m.name === 'ai.call').length;
    const aiTokens = metrics
        .filter(m => m.name === 'ai.tokens')
        .reduce((sum, m) => sum + m.value, 0);

    // Estimate cost (rough approximation)
    const estimatedCost = (aiTokens / 1000) * 0.002; // ~$0.002 per 1K tokens for gpt-4o-mini

    return {
        apiLatency: {
            avg: latencies.length ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0,
            p95: percentile(latencies, 95),
            p99: percentile(latencies, 99),
        },
        errorRate: totalRequests > 0 ? (errorCount / totalRequests) * 100 : 0,
        cacheHitRate: cacheMetrics.length > 0 ? (cacheHits / cacheMetrics.length) * 100 : 0,
        requestCount: totalRequests,
        aiApiCalls: aiCalls,
        aiApiCost: estimatedCost,
    };
}

/**
 * Clear metrics (for testing)
 */
export function clearMetrics(): void {
    metricsStore.length = 0;
}

/**
 * Export metrics as JSON
 */
export function exportMetrics(): Metric[] {
    return [...metricsStore];
}
