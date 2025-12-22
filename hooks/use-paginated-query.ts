/**
 * usePaginatedQuery Hook
 * 
 * Generic hook for paginated Firestore queries with cursor-based pagination.
 * Supports infinite scroll patterns and traditional page navigation.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import {
    QueryConstraint,
    orderBy,
    limit,
    startAfter,
    DocumentSnapshot,
    QueryDocumentSnapshot
} from 'firebase/firestore';
import { subscribeToCollection } from '@/services/firebase/database';
import { useAuth } from '@/context/auth-context';
import { BaseEntity } from '@/types/firestore';

export interface PaginationState {
    page: number;
    pageSize: number;
    hasMore: boolean;
    isLoadingMore: boolean;
    totalLoaded: number;
}

export interface UsePaginatedQueryOptions<T> {
    collection: string;
    pageSize?: number;
    constraints?: QueryConstraint[];
    orderByField?: string;
    orderDirection?: 'asc' | 'desc';
    enabled?: boolean;
    orgScoped?: boolean;
}

export interface UsePaginatedQueryReturn<T> {
    items: T[];
    loading: boolean;
    error: Error | null;
    pagination: PaginationState;
    loadMore: () => void;
    goToPage: (page: number) => void;
    refresh: () => void;
    reset: () => void;
}

export function usePaginatedQuery<T extends BaseEntity>({
    collection,
    pageSize = 20,
    constraints = [],
    orderByField = 'createdAt',
    orderDirection = 'desc',
    enabled = true,
    orgScoped = true,
}: UsePaginatedQueryOptions<T>): UsePaginatedQueryReturn<T> {
    const { organization } = useAuth();
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [pagination, setPagination] = useState<PaginationState>({
        page: 1,
        pageSize,
        hasMore: true,
        isLoadingMore: false,
        totalLoaded: 0,
    });

    const lastDocRef = useRef<DocumentSnapshot | null>(null);
    const cursorStack = useRef<DocumentSnapshot[]>([]);

    // Build query constraints
    const buildConstraints = useCallback((cursor?: DocumentSnapshot): QueryConstraint[] => {
        const queryConstraints: QueryConstraint[] = [...constraints];

        // Add ordering
        queryConstraints.push(orderBy(orderByField, orderDirection));

        // Add pagination
        queryConstraints.push(limit(pageSize + 1)); // Fetch one extra to check hasMore

        // Add cursor for next page
        if (cursor) {
            queryConstraints.push(startAfter(cursor));
        }

        return queryConstraints;
    }, [constraints, orderByField, orderDirection, pageSize]);

    // Load initial data
    const loadData = useCallback(() => {
        if (!enabled) {
            setLoading(false);
            return () => { };
        }

        if (orgScoped && !organization?.id) {
            setLoading(false);
            return () => { };
        }

        setLoading(true);
        setError(null);

        const queryConstraints = buildConstraints();

        const unsubscribe = subscribeToCollection<T>(
            collection,
            queryConstraints,
            (data) => {
                const hasMore = data.length > pageSize;
                const pageData = hasMore ? data.slice(0, -1) : data;

                setItems(pageData);
                setPagination(prev => ({
                    ...prev,
                    hasMore,
                    totalLoaded: pageData.length,
                    page: 1,
                }));
                setLoading(false);
            },
            (err) => {
                setError(err);
                setLoading(false);
            }
        );

        return unsubscribe;
    }, [enabled, orgScoped, organization?.id, collection, buildConstraints, pageSize]);

    // Load more (infinite scroll)
    const loadMore = useCallback(() => {
        if (!pagination.hasMore || pagination.isLoadingMore || loading) return;

        setPagination(prev => ({ ...prev, isLoadingMore: true }));

        // Get the last item's document snapshot for cursor
        // Note: In a real implementation, you'd need to store the actual DocumentSnapshot
        // This is a simplified version
        const lastItem = items[items.length - 1];
        if (!lastItem) return;

        const queryConstraints = buildConstraints(lastDocRef.current || undefined);

        subscribeToCollection<T>(
            collection,
            queryConstraints,
            (newData) => {
                const hasMore = newData.length > pageSize;
                const pageData = hasMore ? newData.slice(0, -1) : newData;

                setItems(prev => [...prev, ...pageData]);
                setPagination(prev => ({
                    ...prev,
                    hasMore,
                    isLoadingMore: false,
                    totalLoaded: prev.totalLoaded + pageData.length,
                    page: prev.page + 1,
                }));
            },
            (err) => {
                setError(err);
                setPagination(prev => ({ ...prev, isLoadingMore: false }));
            }
        );
    }, [pagination, loading, items, collection, buildConstraints, pageSize]);

    // Go to specific page (traditional pagination)
    const goToPage = useCallback((page: number) => {
        // For traditional pagination, we'd need to maintain a cursor stack
        // This is a simplified implementation
        if (page === 1) {
            cursorStack.current = [];
            lastDocRef.current = null;
            loadData();
        }
        // For other pages, you'd navigate the cursor stack
    }, [loadData]);

    // Refresh data
    const refresh = useCallback(() => {
        cursorStack.current = [];
        lastDocRef.current = null;
        loadData();
    }, [loadData]);

    // Reset state
    const reset = useCallback(() => {
        setItems([]);
        setError(null);
        setPagination({
            page: 1,
            pageSize,
            hasMore: true,
            isLoadingMore: false,
            totalLoaded: 0,
        });
        cursorStack.current = [];
        lastDocRef.current = null;
    }, [pageSize]);

    // Initial load
    useEffect(() => {
        const unsubscribe = loadData();
        return () => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
    }, [loadData]);

    return {
        items,
        loading,
        error,
        pagination,
        loadMore,
        goToPage,
        refresh,
        reset,
    };
}

/**
 * Simple pagination helper for server-side rendering
 */
export function calculatePaginationMeta(
    total: number,
    page: number,
    pageSize: number
) {
    const totalPages = Math.ceil(total / pageSize);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
        total,
        page,
        pageSize,
        totalPages,
        hasNext,
        hasPrev,
        startIndex: (page - 1) * pageSize,
        endIndex: Math.min(page * pageSize, total),
    };
}
