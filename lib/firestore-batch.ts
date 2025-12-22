/**
 * Firestore Batch Utilities
 * 
 * Helpers for efficient batch operations and parallel queries.
 */

import { adminDb } from './firebase-admin';
import {
    DocumentData,
    WriteBatch,
    FieldValue
} from 'firebase-admin/firestore';

// Maximum batch size for Firestore
const MAX_BATCH_SIZE = 500;

export interface BatchOperation {
    type: 'set' | 'update' | 'delete';
    collection: string;
    docId: string;
    data?: DocumentData;
    merge?: boolean;
}

/**
 * Execute multiple Firestore operations in batches.
 * Automatically splits into multiple batches if needed.
 */
export async function executeBatch(operations: BatchOperation[]): Promise<void> {
    if (operations.length === 0) return;

    // Split into chunks of MAX_BATCH_SIZE
    const chunks: BatchOperation[][] = [];
    for (let i = 0; i < operations.length; i += MAX_BATCH_SIZE) {
        chunks.push(operations.slice(i, i + MAX_BATCH_SIZE));
    }

    // Execute each chunk
    await Promise.all(chunks.map(async (chunk) => {
        const batch = adminDb.batch();

        for (const op of chunk) {
            const docRef = adminDb.collection(op.collection).doc(op.docId);

            switch (op.type) {
                case 'set':
                    batch.set(docRef, op.data || {}, { merge: op.merge ?? false });
                    break;
                case 'update':
                    batch.update(docRef, op.data || {});
                    break;
                case 'delete':
                    batch.delete(docRef);
                    break;
            }
        }

        await batch.commit();
    }));
}

/**
 * Execute multiple read queries in parallel.
 * Returns results in the same order as input queries.
 */
export async function parallelQueries<T extends DocumentData>(
    queries: Array<{
        collection: string;
        constraints?: Array<{ field: string; op: string; value: unknown }>;
        limit?: number;
    }>
): Promise<T[][]> {
    const promises = queries.map(async ({ collection, constraints, limit }) => {
        let query = adminDb.collection(collection) as FirebaseFirestore.Query;

        if (constraints) {
            for (const { field, op, value } of constraints) {
                query = query.where(field, op as FirebaseFirestore.WhereFilterOp, value);
            }
        }

        if (limit) {
            query = query.limit(limit);
        }

        const snapshot = await query.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as unknown as T);
    });

    return Promise.all(promises);
}

/**
 * Bulk update documents with the same field values.
 */
export async function bulkUpdate(
    collection: string,
    docIds: string[],
    updateData: DocumentData
): Promise<void> {
    const operations: BatchOperation[] = docIds.map(docId => ({
        type: 'update',
        collection,
        docId,
        data: {
            ...updateData,
            updatedAt: FieldValue.serverTimestamp(),
        },
    }));

    await executeBatch(operations);
}

/**
 * Bulk delete documents.
 */
export async function bulkDelete(
    collection: string,
    docIds: string[]
): Promise<void> {
    const operations: BatchOperation[] = docIds.map(docId => ({
        type: 'delete',
        collection,
        docId,
    }));

    await executeBatch(operations);
}

/**
 * Copy documents from one collection to another.
 */
export async function copyDocuments(
    sourceCollection: string,
    targetCollection: string,
    docIds: string[],
    transform?: (data: DocumentData) => DocumentData
): Promise<void> {
    // Fetch source documents
    const fetchPromises = docIds.map(id =>
        adminDb.collection(sourceCollection).doc(id).get()
    );
    const docs = await Promise.all(fetchPromises);

    // Prepare copy operations
    const operations: BatchOperation[] = docs
        .filter(doc => doc.exists)
        .map(doc => ({
            type: 'set' as const,
            collection: targetCollection,
            docId: doc.id,
            data: transform ? transform(doc.data()!) : doc.data(),
        }));

    await executeBatch(operations);
}

/**
 * Aggregate count of documents matching criteria.
 * More efficient than fetching all documents.
 */
export async function countDocuments(
    collection: string,
    constraints?: Array<{ field: string; op: string; value: unknown }>
): Promise<number> {
    let query = adminDb.collection(collection) as FirebaseFirestore.Query;

    if (constraints) {
        for (const { field, op, value } of constraints) {
            query = query.where(field, op as FirebaseFirestore.WhereFilterOp, value);
        }
    }

    const countSnapshot = await query.count().get();
    return countSnapshot.data().count;
}
