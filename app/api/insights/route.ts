import { streamText, generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { z } from "zod";
import { apiError, handleApiError } from "@/lib/error-handler";

export const maxDuration = 60; // Allow longer timeout for aggregation

// Schema for structured output
const InsightsResponseSchema = z.object({
    insights: z.array(z.object({
        type: z.enum(["info", "warning", "opportunity"]),
        text: z.string(),
    })),
});

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") || "customer";
    const userId = searchParams.get("userId");

    if (!userId) {
        return apiError('BAD_REQUEST', 'Missing userId parameter');
    }

    const cacheKey = `${userId}_${role}`;
    const cacheRef = adminDb.collection("insights_cache").doc(cacheKey);

    try {
        // 1. Check Cache
        const cacheDoc = await cacheRef.get();
        if (cacheDoc.exists) {
            const data = cacheDoc.data();
            const now = Date.now();
            const cacheTime = data?.updatedAt?.toMillis() || 0;
            const fifteenMinutes = 15 * 60 * 1000;

            if (now - cacheTime < fifteenMinutes) {
                return new Response(JSON.stringify(data?.insights), {
                    headers: { "Content-Type": "application/json" },
                });
            }
        }

        // 2. Aggregate Data based on Role
        let aggregatedData = "";

        if (role === "admin") {
            // Admin Aggregation
            const projectsSnapshot = await adminDb.collection("projects").get();
            const ticketsSnapshot = await adminDb.collection("tickets").where("status", "!=", "closed").get();
            const activitySnapshot = await adminDb.collection("activity_log").orderBy("createdAt", "desc").limit(10).get();

            const totalProjects = projectsSnapshot.size;
            const activeTickets = ticketsSnapshot.size;
            const delayedProjects = projectsSnapshot.docs.filter(d => d.data().status === "delayed").length;

            aggregatedData = `
                Role: Admin
                Total Projects: ${totalProjects}
                Projects Marked 'Delayed': ${delayedProjects}
                Open Tickets: ${activeTickets}
                Recent System Activity: ${activitySnapshot.docs.map(d => d.data().details).join("; ")}
            `;
        } else {
            // Customer Aggregation
            const projectsSnapshot = await adminDb.collection("projects").where("customerId", "==", userId).get();
            const ticketsSnapshot = await adminDb.collection("tickets").where("customerId", "==", userId).where("status", "!=", "closed").get();
            // Attempt to get recent chat session
            const chatSnapshot = await adminDb.collection("agent_sessions").where("userId", "==", userId).orderBy("createdAt", "desc").limit(1).get();

            aggregatedData = `
                Role: Customer
                My Active Projects: ${projectsSnapshot.size}
                Project Statuses: ${projectsSnapshot.docs.map(d => d.data().status).join(", ")}
                My Open Tickets: ${ticketsSnapshot.size}
                Last Chat Agent Interaction: ${chatSnapshot.empty ? "None" : "Recently chatted with " + chatSnapshot.docs[0].data().agentType}
            `;
        }

        // 3. Generate Insights via LLM (using gpt-4o-mini for cost efficiency)
        let result;
        try {
            result = await generateObject({
                model: openai("gpt-4o-mini"),
                schema: InsightsResponseSchema,
                system: `You are an AI Operations Analyst for Nyembotech.
                Analyze the provided data and generate 3-5 concise, actionable insights.
                
                For Admins: Focus on bottlenecks, risks (delayed projects), and operational volume.
                For Customers: Focus on reassurance, project progress, and engagement.
                
                Classify each as 'info' (neutral status), 'warning' (risks), or 'opportunity' (suggestions).`,
                prompt: `Data Summary:\n${aggregatedData}`,
            });
        } catch (error) {
            console.warn("OpenAI Quota/Error, falling back to mock.", error);
            // Mock Fallback
            result = {
                object: {
                    insights: [
                        { type: "info", text: "System is operating within normal parameters." },
                        { type: "warning", text: "Mock Insight: Check OpenAI Quota." },
                        { type: "opportunity", text: "Review recent project proposals." }
                    ]
                }
            };
        }

        // 4. Update Cache
        await cacheRef.set({
            insights: result.object.insights,
            updatedAt: FieldValue.serverTimestamp(),
            role,
            userId
        });

        // 5. Return Result
        return new Response(JSON.stringify(result.object.insights), {
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        return handleApiError(error);
    }
}

