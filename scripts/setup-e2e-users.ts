
import { initializeApp, cert, getApps, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;

// Fallback to locally present service-account.json if env var not set, for local verified runs
// In strict CI this might rely on env var only.
// For now we assume the environment has credentials active.

if (!getApps().length) {
    // Try to load service account if available, else default (Google Cloud Build / Local Env)
    // Note: User has service-account.json locally.
    let credential;
    try {
        credential = SERVICE_ACCOUNT ? cert(SERVICE_ACCOUNT) : applicationDefault();
    } catch (e) {
        // If applicationDefault fails and no service account, we might need explicit path
        if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            credential = applicationDefault();
        } else {
            // Try local file explicitly if possible or fail
            try {
                credential = cert("service-account.json");
            } catch (err) {
                console.error("Could not load credentials.");
                process.exit(1);
            }
        }
    }

    initializeApp({
        credential,
    });
}

const auth = getAuth();
const db = getFirestore();

const USERS = [
    {
        email: "e2e-admin@nyembotech.com",
        password: "password123",
        role: "admin",
        displayName: "E2E Admin"
    },
    {
        email: "e2e-customer@nyembotech.com",
        password: "password123",
        role: "customer",
        displayName: "E2E Customer"
    }
];

async function setupUsers() {
    console.log("Setting up E2E users...");

    for (const user of USERS) {
        let uid;
        try {
            const userRecord = await auth.getUserByEmail(user.email);
            uid = userRecord.uid;
            console.log(`User ${user.email} exists. Updating password...`);
            await auth.updateUser(uid, {
                password: user.password,
                displayName: user.displayName,
                emailVerified: true
            });
        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                console.log(`Creating user ${user.email}...`);
                const userRecord = await auth.createUser({
                    email: user.email,
                    password: user.password,
                    displayName: user.displayName,
                    emailVerified: true
                });
                uid = userRecord.uid;
            } else {
                throw error;
            }
        }

        // Set Role in Firestore (and Custom Claims if needed, but app uses Firestore for role)
        console.log(`Setting role '${user.role}' for ${user.email} in Firestore...`);
        await db.collection("users").doc(uid).set({
            uid: uid,
            email: user.email,
            displayName: user.displayName,
            role: user.role, // 'admin' or 'customer'
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        }, { merge: true });

        // Also set custom claims just in case we use them later
        await auth.setCustomUserClaims(uid, { role: user.role });
    }

    console.log("E2E Users Setup Complete.");
}

setupUsers().catch((err) => {
    console.error("Setup Failed:", err);
    process.exit(1);
});
