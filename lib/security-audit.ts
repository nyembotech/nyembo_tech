import { adminDb } from './firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export type SecurityEventType =
    | 'auth_failure'
    | 'unauthorized_access'
    | 'data_export'
    | 'data_anonymization'
    | 'rate_limit_exceeded'
    | 'invalid_token'
    | 'permission_denied';

export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface SecurityEvent {
    type: SecurityEventType;
    userId?: string;
    ip?: string;
    details: string;
    severity: SecuritySeverity;
    path?: string;
    metadata?: Record<string, unknown>;
}

/**
 * Log a security-related event to Firestore for audit purposes.
 * 
 * Events are stored in the `security_audit_log` collection and should
 * be monitored for potential security issues.
 * 
 * @param event - The security event to log
 * @returns Promise that resolves when the log is written
 * 
 * @example
 * ```typescript
 * await logSecurityEvent({
 *   type: 'auth_failure',
 *   ip: request.ip,
 *   details: 'Invalid token provided',
 *   severity: 'medium',
 * });
 * ```
 */
export async function logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
        await adminDb.collection('security_audit_log').add({
            ...event,
            timestamp: FieldValue.serverTimestamp(),
            environment: process.env.NODE_ENV || 'development',
        });
    } catch (error) {
        // Log to console if Firestore write fails - never throw from security logging
        console.error('[SECURITY_AUDIT] Failed to write security event:', error);
        console.error('[SECURITY_AUDIT] Event details:', JSON.stringify(event));
    }
}

/**
 * Log an authentication failure event.
 */
export async function logAuthFailure(
    details: string,
    ip?: string,
    userId?: string
): Promise<void> {
    return logSecurityEvent({
        type: 'auth_failure',
        details,
        ip,
        userId,
        severity: 'medium',
    });
}

/**
 * Log an unauthorized access attempt.
 */
export async function logUnauthorizedAccess(
    path: string,
    userId?: string,
    ip?: string
): Promise<void> {
    return logSecurityEvent({
        type: 'unauthorized_access',
        details: `Attempted to access ${path} without proper authorization`,
        path,
        userId,
        ip,
        severity: 'high',
    });
}

/**
 * Log permission denied events (different from auth failure - user is authenticated but lacks permission).
 */
export async function logPermissionDenied(
    path: string,
    userId: string,
    requiredRole?: string
): Promise<void> {
    return logSecurityEvent({
        type: 'permission_denied',
        details: `User ${userId} denied access to ${path}${requiredRole ? ` (requires: ${requiredRole})` : ''}`,
        path,
        userId,
        severity: 'medium',
    });
}

/**
 * Log data export operations for compliance tracking.
 */
export async function logDataExport(
    userId: string,
    exportType: string,
    recordCount?: number
): Promise<void> {
    return logSecurityEvent({
        type: 'data_export',
        details: `User exported ${exportType}${recordCount ? ` (${recordCount} records)` : ''}`,
        userId,
        severity: 'low',
        metadata: { exportType, recordCount },
    });
}
