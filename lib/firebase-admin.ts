
import { initializeApp, getApps, cert, applicationDefault, App, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;

export function initAdmin(): App {
    if (getApps().length) {
        return getApp();
    }

    let credential;
    try {
        if (SERVICE_ACCOUNT) {
            console.log("Initializing Firebase Admin with SERVICE_ACCOUNT_KEY env var");
            credential = cert(SERVICE_ACCOUNT);
        } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            console.log("Initializing Firebase Admin with GOOGLE_APPLICATION_CREDENTIALS");
            credential = applicationDefault();
        } else {
            console.log("Initializing Firebase Admin with Default Credentials (local/cloud)");
            credential = applicationDefault();
        }
    } catch (e) {
        console.error("Failed to load credential", e);
        // Fallback for local development if everything fails, might throw
        credential = applicationDefault();
    }

    return initializeApp({
        credential,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    });
}

const app = initAdmin();
export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);
