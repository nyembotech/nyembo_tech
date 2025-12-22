import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { UserExportSchema } from '@/lib/schemas';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parseResult = UserExportSchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json({ error: "Invalid Request", details: parseResult.error.format() }, { status: 400 });
        }

        const { uid } = parseResult.data;

        // --- FETCH DATA ---

        // 1. User Profile
        const userDoc = await adminDb.collection('users').doc(uid).get();
        const userData = userDoc.exists ? userDoc.data() : null;

        // 2. Customer Profile
        // Assuming UID links to a Customer ID or IS the Customer ID
        const customerDoc = await adminDb.collection('customers').doc(uid).get();
        const customerData = customerDoc.exists ? customerDoc.data() : null;

        // 3. Projects (where customerId == uid)
        const projectsSnap = await adminDb.collection('projects')
            .where('customerId', '==', uid)
            .get();
        const projects = projectsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        // 4. Tickets (where customerId == uid)
        const ticketsSnap = await adminDb.collection('tickets')
            .where('customerId', '==', uid)
            .get();
        const tickets = ticketsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        // 5. Activity Log (where actorId == uid)
        const logsSnap = await adminDb.collection('activity_log')
            .where('actorId', '==', uid)
            .limit(100)
            .get();
        const logs = logsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        // --- EXPORT OBJECT ---
        const exportData = {
            metadata: {
                exportedAt: new Date().toISOString(),
                uid: uid
            },
            profile: {
                user: userData,
                customer: customerData
            },
            projects: projects,
            tickets: tickets,
            activity_history: logs
        };

        return NextResponse.json(exportData);

    } catch (error: any) {
        console.error("Export Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
