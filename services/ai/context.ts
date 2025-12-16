
import { adminDb } from "@/lib/firebase-admin";

export type AgentType = "sales" | "support";

interface AgentContextParams {
    userId?: string;
    projectId?: string;
    language?: string;
}

export async function getAgentContext(type: AgentType, params: AgentContextParams = {}): Promise<string> {
    const language = params.language || "en";
    try {
        if (type === "sales") {
            return await getSalesContext(language);
        } else if (type === "support") {
            if (!params.userId) throw new Error("User ID required for support agent");
            return await getSupportContext(params.userId, language);
        }
    } catch (error) {
        console.error("Error fetching agent context:", error);
        return "Error fetching context. Proceed with general knowledge.";
    }
    return "";
}

async function getSalesContext(lang: string): Promise<string> {
    // 1. Fetch Site Content (Home, Solutions)
    const siteContentSnap = await adminDb.collection("site_content").get();
    let contentSummary = `Context Language: ${lang}\n`;
    contentSummary += "Company: Nyembotech. We build AI-first software for Africa and Europe.\n";

    siteContentSnap.forEach(doc => {
        const data = doc.data();
        // Assuming localized content might be stored or we just dump available info
        if (data.heroTitle) {
            contentSummary += `[Site Content] Title: ${data.heroTitle}\nSubtitle: ${data.heroSubtitle}\n`;
        }
    });

    // 2. Fetch Knowledge Base
    const kbSnap = await adminDb.collection("knowledge_base").limit(5).get();
    if (!kbSnap.empty) {
        contentSummary += "\n[Knowledge Base]:\n";
        kbSnap.forEach(doc => {
            const data = doc.data();
            contentSummary += `- ${data.title}: ${data.content}\n`;
        });
    }

    // 3. Simulated Shortlist of Predefined Offers
    const offers = [
        { name: "MVP Launch Pack", price: "€15k - €25k", details: "Web App, Mobile MVP, 4 weeks delivery." },
        { name: "Enterprise AI Suite", price: "€50k+", details: "Custom LLM integrations, Internal Tools, SLA." },
        { name: "Design System Overhaul", price: "€8k", details: "Figma to Code, Storybook, Dark Mode." }
    ];
    contentSummary += `\n[Predefined Offers]:\n${JSON.stringify(offers)}\n`;

    return `
You are "Nyembo Guide", a helpful sales representative for Nyembotech.
Respond in ${lang === 'de' ? 'German' : lang === 'sw' ? 'Swahili' : 'English'}.
Your goal: Explain our services (Web Apps, Mobile Apps, AI Integration), qualify leads, and direct them to the Contact form.
Current Context (Public Info):
${contentSummary}
Guidelines:
- Be professional, enthusiastic, and concise.
- Focus on "European Quality, African Speed".
- Use the Predefined Offers as a baseline for pricing questions.
`;
}

async function getSupportContext(userId: string, lang: string): Promise<string> {
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
Respond in ${lang === 'de' ? 'German' : lang === 'sw' ? 'Swahili' : 'English'}.
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
