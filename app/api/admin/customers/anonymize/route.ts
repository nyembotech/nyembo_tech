import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: Request) {
    try {
        const { customerId, uid, requestId } = await req.json();

        if (!customerId || !uid) {
            return NextResponse.json({ error: "Missing Target IDs" }, { status: 400 });
        }

        console.log(`Starting anonymization for UID: ${uid}, CustomerID: ${customerId}`);

        // 1. Disable Auth User
        try {
            await adminAuth.updateUser(uid, {
                disabled: true,
                displayName: "Deleted User",
                // email: `deleted-${uid}@anon.local` // Optional: Change email to release the original one or just disable
            });
        } catch (authError) {
            console.warn("Auth user update failed (user might not exist in Auth):", authError);
        }

        // 2. Anonymize User Doc
        const userRef = adminDb.collection('users').doc(uid);
        await userRef.update({
            name: "Deleted User",
            email: `deleted-${uid}@anon.local`,
            anonymized: true,
            anonymizedAt: FieldValue.serverTimestamp(),
            role: 'deleted'
        });

        // 3. Anonymize Customer Doc
        const customerRef = adminDb.collection('customers').doc(customerId);
        await customerRef.update({
            name: "Deleted User",
            contactEmail: `deleted-${uid}@anon.local`,
            companyName: "Deleted Company",
            status: 'deleted',
            anonymized: true,
            anonymizedAt: FieldValue.serverTimestamp()
        });

        // 4. Close Request
        if (requestId) {
            await adminDb.collection('deletion_requests').doc(requestId).update({
                status: 'completed',
                completedAt: FieldValue.serverTimestamp(),
                adminNotes: 'Auto-processed by Admin Console'
            });
        }

        // 5. Log Activity
        await adminDb.collection('activity_log').add({
            type: 'gdpr_delete',
            targetId: uid,
            targetType: 'user',
            message: 'User account anonymized and disabled.',
            timestamp: FieldValue.serverTimestamp(),
            visibility: 'admin'
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Anonymization Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
