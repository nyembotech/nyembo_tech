import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
    try {
        const { action, uid, ...data } = await req.json();

        if (!uid) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        if (action === "generatePassword") {
            // Generate a random 12-character alphanumeric password
            const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
            let newPassword = "";
            for (let i = 0; i < 12; i++) {
                newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
            }

            await adminAuth.updateUser(uid, {
                password: newPassword,
            });

            // Optionally flag the user in Firestore to change password on next login
            await adminDb.collection("customers").doc(uid).update({
                mustChangePassword: true,
                updatedAt: new Date().toISOString()
            });

            return NextResponse.json({ password: newPassword });
        }

        if (action === "toggleBlock") {
            const { blocked } = data; // boolean

            await adminAuth.updateUser(uid, {
                disabled: blocked,
            });

            await adminDb.collection("customers").doc(uid).update({
                status: blocked ? "suspended" : "active",
                updatedAt: new Date().toISOString()
            });

            return NextResponse.json({ success: true, status: blocked ? "suspended" : "active" });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (error: any) {
        console.error("Admin User API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
