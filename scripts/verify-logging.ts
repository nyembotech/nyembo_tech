import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { adminDb } from "../lib/firebase-admin";

async function verify() {
    console.log("Checking agent_sessions...");

    const snapshot = await adminDb.collection("agent_sessions")
        .orderBy("createdAt", "desc")
        .limit(1)
        .get();

    if (snapshot.empty) {
        console.log("No logs found.");
    } else {
        console.log("Latest log found:");
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            console.log(JSON.stringify({
                id: doc.id,
                agentType: data.agentType,
                input: data.input,
                output: data.output,
                isMock: data.metadata?.isMock,
                createdAt: data.createdAt?.toDate().toISOString()
            }, null, 2));
        });
    }
}

verify().catch((err) => {
    console.error("Verification failed:", err);
    process.exit(1);
});
