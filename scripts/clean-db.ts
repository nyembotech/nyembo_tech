import { initializeApp, cert, getApps, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;

if (!SERVICE_ACCOUNT && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error("ERROR: No Service Account provided.");
    process.exit(1);
}

if (!getApps().length) {
    const credential = SERVICE_ACCOUNT ? cert(SERVICE_ACCOUNT) : applicationDefault();
    initializeApp({
        credential,
    });
}

const db = getFirestore();
const LOG_TAG = "[CLEAN]";

const COLLECTIONS = [
    "customers",
    "projects",
    "tasks",
    "tickets",
    "academy_events",
    "project_requests",
    "activity_log",
    "site_content" // Be careful if this has production data, but for dev it's fine
];

async function deleteCollection(collectionPath: string, batchSize: number = 50) {
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, resolve).catch(reject);
    });
}

async function deleteQueryBatch(db: FirebaseFirestore.Firestore, query: FirebaseFirestore.Query, resolve: Function) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
        // When there are no documents left, we are done
        resolve();
        return;
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
        deleteQueryBatch(db, query, resolve);
    });
}

async function clean() {
    console.log(`${LOG_TAG} Starting Database Cleanup...`);

    for (const collection of COLLECTIONS) {
        process.stdout.write(`${LOG_TAG} Deleting ${collection}... `);
        await deleteCollection(collection);
        console.log("Done.");
    }

    console.log(`${LOG_TAG} Cleanup Complete!`);
}

clean().catch(console.error);
