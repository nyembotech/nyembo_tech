
import { adminDb } from "../lib/firebase-admin";

const flags = [
    {
        key: "ai_insights",
        description: "AI-powered analytics panel on the main dashboard.",
        enabled: false, // Default off
        targetRoles: ["admin"],
        targetEmails: []
    },
    {
        key: "smart_spaces_iot",
        description: "Real-time IoT temperature/occupancy controls.",
        enabled: false,
        targetRoles: ["admin", "staff"],
        targetEmails: []
    },
    {
        key: "ai_architect",
        description: "Experimental generative architecture assistant.",
        enabled: false,
        targetRoles: ["admin"],
        targetEmails: []
    }
];

async function seedFlags() {
    console.log("Seeding Feature Flags...");
    for (const flag of flags) {
        // Check if exists
        const snap = await adminDb.collection("feature_flags").where("key", "==", flag.key).limit(1).get();
        if (snap.empty) {
            await adminDb.collection("feature_flags").add(flag);
            console.log(`Created flag: ${flag.key}`);
        } else {
            console.log(`Flag exists: ${flag.key}`);
        }
    }
    console.log("Seeding complete.");
}

seedFlags().catch(console.error);
