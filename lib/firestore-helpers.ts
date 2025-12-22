/**
 * Firestore Helpers for Multi-Tenancy
 * 
 * Provides utilities for org-scoped queries to ensure data isolation
 * between tenants in a multi-tenant environment.
 */

import {
    Query,
    where,
    query,
    collection as firestoreCollection,
    QueryConstraint,
    DocumentData
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Collections that require organizationId scoping.
 * These collections contain tenant-specific data.
 */
export const TENANT_SCOPED_COLLECTIONS = [
    'projects',
    'customers',
    'tickets',
    'epics',
    'tasks',
    'documents',
    'activity_log',
    'agent_sessions',
    'customer_invites',
    'deletion_requests',
] as const;

/**
 * Collections that are global (not tenant-scoped).
 * These contain system-wide data accessible across organizations.
 */
export const GLOBAL_COLLECTIONS = [
    'organizations',
    'site_content',
    'knowledge_articles',
    'feature_flags',
    'academy_bookings',
    'project_requests', // Public submissions
] as const;

export type TenantScopedCollection = typeof TENANT_SCOPED_COLLECTIONS[number];
export type GlobalCollection = typeof GLOBAL_COLLECTIONS[number];

/**
 * Check if a collection requires organization scoping.
 */
export function isTenantScoped(collectionName: string): boolean {
    return TENANT_SCOPED_COLLECTIONS.includes(collectionName as TenantScopedCollection);
}

/**
 * Creates a Firestore query with organization scoping applied.
 * 
 * This is the primary method for creating org-isolated queries.
 * Use this instead of raw query() for tenant-scoped collections.
 * 
 * @param collectionName - The Firestore collection name
 * @param organizationId - The organization ID for scoping
 * @param constraints - Additional query constraints
 * @returns A Query object with organizationId filter applied
 * 
 * @throws Error if organizationId is not provided for tenant-scoped collections
 * 
 * @example
 * ```typescript
 * const { organization } = useAuth();
 * const projectsQuery = orgScopedQuery(
 *   'projects',
 *   organization?.id,
 *   where('status', '==', 'active'),
 *   orderBy('updatedAt', 'desc')
 * );
 * ```
 */
export function orgScopedQuery<T = DocumentData>(
    collectionName: string,
    organizationId: string | undefined,
    ...constraints: QueryConstraint[]
): Query<T> {
    // Validate that tenant-scoped collections have organizationId
    if (isTenantScoped(collectionName) && !organizationId) {
        throw new Error(
            `organizationId is required for querying tenant-scoped collection "${collectionName}". ` +
            `This usually means the user is not properly authenticated or lacks organization membership.`
        );
    }

    const collectionRef = firestoreCollection(db, collectionName);

    // Apply organization filter for tenant-scoped collections
    if (isTenantScoped(collectionName) && organizationId) {
        return query(
            collectionRef,
            where('organizationId', '==', organizationId),
            ...constraints
        ) as Query<T>;
    }

    // Global collections don't need org filter
    return query(collectionRef, ...constraints) as Query<T>;
}

/**
 * Creates organization-scoped query constraints.
 * 
 * Useful when you need to combine with other query building logic.
 * 
 * @param organizationId - The organization ID
 * @returns Query constraint for organizationId filter
 */
export function withOrganization(organizationId: string): QueryConstraint {
    return where('organizationId', '==', organizationId);
}

/**
 * Validates that a document belongs to the specified organization.
 * 
 * Use this for server-side validation before allowing operations.
 * 
 * @param doc - The document data
 * @param organizationId - Expected organization ID
 * @returns true if document belongs to organization
 */
export function belongsToOrganization(
    doc: DocumentData | undefined,
    organizationId: string
): boolean {
    if (!doc) return false;
    return doc.organizationId === organizationId;
}

/**
 * Adds organizationId to a document before creation.
 * 
 * @param data - The document data
 * @param organizationId - The organization ID to add
 * @returns Document data with organizationId
 */
export function withOrgId<T extends Record<string, unknown>>(
    data: T,
    organizationId: string
): T & { organizationId: string } {
    return {
        ...data,
        organizationId,
    };
}
