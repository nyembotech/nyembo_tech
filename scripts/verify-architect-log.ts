
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { adminDb } from "../lib/firebase-admin";

async function verifyArchitectLogging() {
    console.log("Checking activity_log for ai_architect_usage...");

    const snapshot = await adminDb.collection("activity_log")
        .where("type", "==", "ai_architect_usage")
        .orderBy("createdAt", "desc")
        .limit(1)
        .get();

    if (snapshot.empty) {
        console.log("No AI Architect logs found yet. (Expected if you haven't run it via UI/Curl yet)");
    } else {
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            console.log("Log Found:", JSON.stringify({
                id: doc.id,
                type: data.type,
                details: data.details,
                timestamp: data.createdAt?.toDate().toISOString()
            }, null, 2));
        });
    }
}

verifyArchitectLogging().catch(console.error);
