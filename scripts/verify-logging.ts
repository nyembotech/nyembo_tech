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
        for (const doc of snapshot.docs) {
            const data = doc.data();
            console.log("Session:", JSON.stringify({
                id: doc.id,
                agentType: data.agentType,
                language: data.language,
                userId: data.userId,
                createdAt: data.createdAt?.toDate().toISOString()
            }, null, 2));

            const messagesSnap = await doc.ref.collection("messages").orderBy("createdAt", "asc").get();
            console.log("Messages:");
            messagesSnap.forEach(msgDoc => {
                const msgData = msgDoc.data();
                console.log(JSON.stringify({
                    role: msgData.role,
                    content: msgData.content,
                    isMock: msgData.metadata?.isMock
                }, null, 2));
            });
        }
    }
}

verify().catch((err) => {
    console.error("Verification failed:", err);
    process.exit(1);
});
