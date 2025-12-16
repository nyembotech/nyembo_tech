
import { adminDb } from "@/lib/firebase-admin";

export type AgentType = "sales" | "support";

interface AgentContextParams {
    userId?: string;
    projectId?: string;
}

export async function getAgentContext(type: AgentType, params: AgentContextParams = {}): Promise<string> {
    try {
        if (type === "sales") {
            return await getSalesContext();
        } else if (type === "support") {
            if (!params.userId) throw new Error("User ID required for support agent");
            return await getSupportContext(params.userId);
        }
    } catch (error) {
        console.error("Error fetching agent context:", error);
        return "Error fetching context. Proceed with general knowledge.";
    }
    return "";
}

async function getSalesContext(): Promise<string> {
    // 1. Fetch Site Content (Home, Solutions)
    // For MVP, we might hardcode critical info if DB is empty, or fetch from site_content
    const siteContentSnap = await adminDb.collection("site_content").get();
    let contentSummary = "Company: Nyembotech. We build AI-first software for Africa and Europe.\n";

    siteContentSnap.forEach(doc => {
        const data = doc.data();
        if (data.heroTitle) {
            contentSummary += `Title: ${data.heroTitle}\nSubtitle: ${data.heroSubtitle}\n`;
        }
        // Add more fields as structure evolves
    });

    // 2. Fetch Case Studies or Offerings (Simulated or DB)
    // const caseStudies = ...

    return `
You are "Nyembo Guide", a helpful sales representative for Nyembotech.
Your goal: Explain our services (Web Apps, Mobile Apps, AI Integration), qualify leads, and direct them to the Contact form.
Current Context (Public Site Info):
${contentSummary}
Guidelines:
- Be professional, enthusiastic, and concise.
- Focus on "European Quality, African Speed".
- Do NOT make up pricing. Say it depends on project scope.
`;
}

async function getSupportContext(userId: string): Promise<string> {
    // 1. Fetch User Profile
    const userDoc = await adminDb.collection("users").doc(userId).get();
    const userData = userDoc.data();
    if (!userData) return "User not found.";

    // 2. Fetch User's Projects
    const projectsSnap = await adminDb.collection("projects").where("customerId", "==", userId).get();
    const projects = projectsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // 3. Fetch Recent Tickets
    const ticketsSnap = await adminDb.collection("tickets").where("customerId", "==", userId).orderBy("createdAt", "desc").limit(5).get();
    const tickets = ticketsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    return `
You are "Nyembo Support", a dedicated support assistant for the customer portal.
User: ${userData.displayName} (${userData.email})

Customer Data:
Projects: ${JSON.stringify(projects.map((p: any) => ({ title: p.title, status: p.status, progress: p.progress })))}
Recent Tickets: ${JSON.stringify(tickets.map((t: any) => ({ subject: t.subject, status: t.status, date: t.createdAt?.toDate() })))}

Guidelines:
- Help the user navigate their projects and tickets.
- If they ask about status, check the 'progress' or 'status' fields.
- If they report a bug, suggest creating a new ticket.
- NEVER share data about other clients.
- You have access *only* to the data listed above.
`;
}
