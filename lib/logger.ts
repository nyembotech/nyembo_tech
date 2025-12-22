/**
 * Logger Utility
 * 
 * Structured logging for API routes and services.
 * Supports multiple log levels and structured metadata.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    context?: string;
    requestId?: string;
    userId?: string;
    duration?: number;
    metadata?: Record<string, unknown>;
}

export interface RequestLogData {
    method: string;
    path: string;
    status: number;
    duration: number;
    userAgent?: string;
    ip?: string;
    userId?: string;
    error?: string;
}

// Log level priority for filtering
const LOG_LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

// Minimum log level (configurable via env)
const MIN_LOG_LEVEL = (process.env.LOG_LEVEL as LogLevel) || 'info';

/**
 * Check if a log level should be output
 */
function shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LOG_LEVEL];
}

/**
 * Format log entry for output
 */
function formatLogEntry(entry: LogEntry): string {
    const { level, message, timestamp, context, requestId, userId, duration, metadata } = entry;

    const parts = [
        `[${timestamp}]`,
        `[${level.toUpperCase()}]`,
        context ? `[${context}]` : null,
        requestId ? `[req:${requestId.slice(0, 8)}]` : null,
        userId ? `[user:${userId.slice(0, 8)}]` : null,
        message,
        duration !== undefined ? `(${duration}ms)` : null,
    ].filter(Boolean);

    let output = parts.join(' ');

    if (metadata && Object.keys(metadata).length > 0) {
        output += '\n' + JSON.stringify(metadata, null, 2);
    }

    return output;
}

/**
 * Core logging function
 */
function log(
    level: LogLevel,
    message: string,
    options: {
        context?: string;
        requestId?: string;
        userId?: string;
        duration?: number;
        metadata?: Record<string, unknown>;
    } = {}
): void {
    if (!shouldLog(level)) return;

    const entry: LogEntry = {
        level,
        message,
        timestamp: new Date().toISOString(),
        ...options,
    };

    const formatted = formatLogEntry(entry);

    switch (level) {
        case 'error':
            console.error(formatted);
            break;
        case 'warn':
            console.warn(formatted);
            break;
        case 'debug':
            console.debug(formatted);
            break;
        default:
            console.log(formatted);
    }

    // TODO: Send to external logging service (e.g., Sentry, LogRocket)
    // if (level === 'error') {
    //     Sentry.captureMessage(message, 'error');
    // }
}

/**
 * Logger instance with context
 */
export function createLogger(context: string) {
    return {
        debug: (message: string, metadata?: Record<string, unknown>) =>
            log('debug', message, { context, metadata }),

        info: (message: string, metadata?: Record<string, unknown>) =>
            log('info', message, { context, metadata }),

        warn: (message: string, metadata?: Record<string, unknown>) =>
            log('warn', message, { context, metadata }),

        error: (message: string, metadata?: Record<string, unknown>) =>
            log('error', message, { context, metadata }),

        request: (data: RequestLogData) => {
            const level: LogLevel = data.status >= 500 ? 'error' :
                data.status >= 400 ? 'warn' : 'info';
            log(level, `${data.method} ${data.path} ${data.status}`, {
                context,
                duration: data.duration,
                metadata: {
                    userAgent: data.userAgent,
                    ip: data.ip,
                    userId: data.userId,
                    error: data.error,
                },
            });
        },
    };
}

/**
 * Pre-configured loggers for common contexts
 */
export const logger = {
    api: createLogger('API'),
    db: createLogger('DB'),
    auth: createLogger('AUTH'),
    ai: createLogger('AI'),
    system: createLogger('SYSTEM'),
};

/**
 * Request timing utility
 */
export function startTimer(): () => number {
    const start = performance.now();
    return () => Math.round(performance.now() - start);
}

/**
 * Generate unique request ID
 */
export function generateRequestId(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
