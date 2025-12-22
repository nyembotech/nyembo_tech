import { NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request) {
    try {
        const text = await req.text();
        const hmac = crypto.createHmac("sha256", process.env.LEMONSQUEEZY_WEBHOOK_SECRET || "");
        const digest = Buffer.from(hmac.update(text).digest("hex"), "utf8");
        const signature = Buffer.from(req.headers.get("x-signature") || "", "utf8");

        if (!crypto.timingSafeEqual(digest, signature)) {
            return NextResponse.json({ error: "Invalid Signature" }, { status: 401 });
        }

        const payload = JSON.parse(text);
        const eventName = payload.meta.event_name;
        const data = payload.data;
        const customData = payload.meta.custom_data || {};

        if (eventName === "order_created") {
            const { userId, projectId, productId } = customData;

            console.log(`Processing Order for User: ${userId}`);

            if (userId) {
                // Grant Access or Record Purchase
                await adminDb.collection("users").doc(userId).collection("purchases").add({
                    orderId: data.id,
                    productId: data.attributes.first_order_item.product_id, // Simplified
                    productName: data.attributes.first_order_item.product_name,
                    amount: data.attributes.total,
                    currency: data.attributes.currency,
                    status: data.attributes.status,
                    purchasedAt: FieldValue.serverTimestamp(),
                    provider: "lemonsqueezy"
                });

                // Unlock Academy Course if applicable
                // Logic: If productId matches specific course, add to 'enrolled_courses'
                // For now, simpler generic purchase record is enough.
            }
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
