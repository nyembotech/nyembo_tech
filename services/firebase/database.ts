import {
    collection,
    doc,
    onSnapshot,
    query,
    QueryConstraint,
    addDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    getDoc,
    getDocs,
    DocumentData,
    WithFieldValue,
    UpdateData
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BaseEntity } from "@/types/firestore";

/**
 * Subscribe to a collection with optional query constraints.
 */
export function subscribeToCollection<T extends BaseEntity>(
    collectionPath: string,
    constraints: QueryConstraint[] = [],
    callback: (data: T[]) => void,
    onError?: (error: Error) => void
) {
    const q = query(collection(db, collectionPath), ...constraints);

    return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        })) as T[];
        callback(data);
    }, (error) => {
        console.error(`Error subscribing to ${collectionPath}:`, error);
        if (onError) onError(error);
    });
}

/**
 * Subscribe to a single document.
 */
export function subscribeToDocument<T extends BaseEntity>(
    collectionPath: string,
    docId: string,
    callback: (data: T | null) => void,
    onError?: (error: Error) => void
) {
    const docRef = doc(db, collectionPath, docId);

    return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            callback({ id: docSnap.id, ...docSnap.data() } as T);
        } else {
            callback(null);
        }
    }, (error) => {
        console.error(`Error subscribing to document ${collectionPath}/${docId}:`, error);
        if (onError) onError(error);
    });
}

/**
 * Fetch all documents from a collection once.
 */
export async function fetchCollection<T extends BaseEntity>(
    collectionPath: string,
    constraints: QueryConstraint[] = []
): Promise<T[]> {
    const q = query(collection(db, collectionPath), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as T[];
}

/**
 * Fetch a single document once.
 */
export async function fetchDocument<T extends BaseEntity>(
    collectionPath: string,
    docId: string
): Promise<T | null> {
    const docRef = doc(db, collectionPath, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
}

/**
 * Create a new document in a collection.
 * Automatically adds createdAt and updatedAt timestamps.
 */
export async function createDocument<T extends DocumentData>(
    collectionPath: string,
    data: WithFieldValue<Omit<T, "id" | "createdAt" | "updatedAt">>
) {
    const colRef = collection(db, collectionPath);
    const docRef = await addDoc(colRef, {
        ...(data as any),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
    return docRef.id;
}

/**
 * Update an existing document.
 * Automatically updates the updatedAt timestamp.
 */
export async function updateDocument<T extends DocumentData>(
    collectionPath: string,
    docId: string,
    data: UpdateData<Omit<T, "id" | "createdAt" | "updatedAt">>
) {
    const docRef = doc(db, collectionPath, docId);
    await updateDoc(docRef, {
        ...(data as any),
        updatedAt: serverTimestamp()
    });
}

/**
 * Delete a document.
 */
export async function deleteDocument(
    collectionPath: string,
    docId: string
) {
    const docRef = doc(db, collectionPath, docId);
    await deleteDoc(docRef);
}
