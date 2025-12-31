
import * as admin from 'firebase-admin';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import * as dotenv from 'dotenv';

// Load envs
dotenv.config({ path: '.env.local' });

async function run() {
    // 1. Admin Verification
    console.log("--- Checking via Admin SDK ---");
    try {
        // Use a relative path that works or try/catch around it
        // The previous script had require('../service-account.json')
        // Ensure that path is correct relative to scripts/
        const serviceAccount = require('../service-account.json');

        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        }
        const adminDb = admin.firestore();
        const flagsSnapshot = await adminDb.collection('feature_flags').get();
        console.log(`Admin SDK found ${flagsSnapshot.size} flags.`);
        flagsSnapshot.docs.forEach(d => console.log(` - ${d.id}: ${d.data().key}`));
    } catch (e) {
        console.error("Admin SDK failed:", e);
    }

    // 2. Client Verification
    console.log("\n--- Checking via Client SDK ---");
    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    };

    console.log("Client Config ProjectID:", firebaseConfig.projectId);

    try {
        const clientApp = initializeApp(firebaseConfig, "DEBUG_CLIENT");
        const clientDb = getFirestore(clientApp);
        const clientFlags = await getDocs(collection(clientDb, "feature_flags"));
        console.log(`Client SDK found ${clientFlags.size} flags.`);
    } catch (e: any) {
        console.error("Client SDK failed:", e.message);
        if (e.code === 'permission-denied') {
            console.log("NOTE: 'permission-denied' is expected if Client SDK is unauthenticated and rules require auth.");
        }
    }
}

run().catch(console.error);

