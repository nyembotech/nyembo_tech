/**
 * Firebase Client - Lightweight initialization for public pages
 * 
 * This module provides lazy-loaded Firebase initialization to reduce
 * initial bundle size for pages that don't need authentication.
 */

let firebaseApp: ReturnType<typeof import('firebase/app').initializeApp> | null = null;
let firebaseAuth: ReturnType<typeof import('firebase/auth').getAuth> | null = null;
let firebaseDb: ReturnType<typeof import('firebase/firestore').getFirestore> | null = null;

/**
 * Lazily initialize Firebase App
 */
export async function getFirebaseApp() {
    if (firebaseApp) return firebaseApp;

    const { initializeApp, getApps, } = await import('firebase/app');

    if (getApps().length === 0) {
        firebaseApp = initializeApp({
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        });
    } else {
        firebaseApp = getApps()[0];
    }

    return firebaseApp;
}

/**
 * Lazily initialize Firebase Auth
 */
export async function getFirebaseAuth() {
    if (firebaseAuth) return firebaseAuth;

    const app = await getFirebaseApp();
    const { getAuth } = await import('firebase/auth');
    firebaseAuth = getAuth(app);

    return firebaseAuth;
}

/**
 * Lazily initialize Firestore
 */
export async function getFirebaseFirestore() {
    if (firebaseDb) return firebaseDb;

    const app = await getFirebaseApp();
    const { getFirestore } = await import('firebase/firestore');
    firebaseDb = getFirestore(app);

    return firebaseDb;
}

/**
 * Preload Firebase for authenticated pages
 * Call this in layouts that require auth to start loading Firebase early
 */
export function preloadFirebase() {
    if (typeof window !== 'undefined') {
        // Start loading Firebase in the background
        getFirebaseAuth().catch(() => {
            // Silently fail - will be retried when actually needed
        });
    }
}

/**
 * Check if Firebase is already initialized
 */
export function isFirebaseInitialized(): boolean {
    return firebaseApp !== null;
}
