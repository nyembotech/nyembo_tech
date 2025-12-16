import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
    const status = {
        firestore: { status: "unknown", latency: 0, message: "" },
        auth: { status: "unknown", message: "" },
        storage: { status: "unknown", message: "" },
        timestamp: new Date().toISOString(),
        overall: "healthy"
    };

    // 1. Check Firestore
    const startFs = performance.now();
    try {
        // Attempt a lightweight read (e.g. Activity Log limit 1)
        await adminDb.collection("activity_log").limit(1).get();
        status.firestore.status = "ok";
        status.firestore.latency = Math.round(performance.now() - startFs);
    } catch (e: any) {
        status.firestore.status = "error";
        status.firestore.message = e.message;
        status.overall = "degraded";
    }

    // 2. Check Auth (Admin SDK Readiness)
    try {
        // If adminDb is initialized, Auth likely is too, but we can verify auth listing (requires permission)
        // Or simpler: just check if app name exists
        if (adminDb.app.name) {
            status.auth.status = "ok";
        } else {
            throw new Error("App not initialized");
        }
    } catch (e: any) {
        status.auth.status = "error";
        status.auth.message = e.message;
        status.overall = "degraded";
    }

    // 3. Check Storage (Bucket Readiness)
    try {
        // Just check if bucket object exists in config/instantiated
        // Actual connectivity check would be getFiles limit 1
        const bucket = adminDb.app.storage().bucket();
        // Lightweight metadata fetch
        await bucket.getMetadata();
        status.storage.status = "ok";
    } catch (e: any) {
        status.storage.status = "error";
        status.storage.message = e.message;
        // Storage might fail if not configured in emulator/prod correctly, mark degraded
        status.overall = "degraded";
    }

    return NextResponse.json(status, { status: status.overall === "healthy" ? 200 : 503 });
}
