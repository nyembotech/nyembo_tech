import { createDocument } from "@/services/firebase/database";
import { Timestamp } from "firebase/firestore";

export async function seedDatabase() {
    console.log("Starting database seed...");

    // 1. Create Customers
    const customers = [
        {
            name: "TechFlow Dynamics",
            contactEmail: "contact@techflow.com",
            password: "password123",
            domain: "techflow.com",
            status: "active",
            plan: "enterprise",
            type: "company",
            companyName: "TechFlow Dynamics",
        },
        {
            name: "EcoSphere Solutions",
            contactEmail: "info@ecosphere.io",
            domain: "ecosphere.io",
            status: "active",
            plan: "business",
            type: "company",
            companyName: "EcoSphere Solutions",
        },
        {
            name: "Sarah Jenkins",
            contactEmail: "sarah.j@gmail.com",
            domain: "gmail.com",
            status: "active",
            plan: "starter",
            type: "individual",
        },
        {
            name: "Quantum Leap Labs",
            contactEmail: "labs@quantumleap.net",
            domain: "quantumleap.net",
            status: "active",
            plan: "enterprise",
            type: "company",
            companyName: "Quantum Leap Labs",
        },
        {
            name: "BlueSky Ventures",
            contactEmail: "invest@bluesky.com",
            domain: "bluesky.com",
            status: "pending",
            plan: "business",
            type: "company",
            companyName: "BlueSky Ventures",
        }
    ];

    const customerIds = [];
    for (const customer of customers) {
        const id = await createDocument("customers", customer);
        customerIds.push({ ...customer, id });
        console.log(`Created customer: ${customer.name}`);
    }

    // 2. Create Projects (linked to customers)
    const projects = [
        {
            title: "Enterprise AI Integration",
            description: "Implementing generative AI for customer support automation.",
            customerId: customerIds[0].id,
            status: "in-progress",
            progress: 65,
            tags: ["ai-integration", "enterprise"],
            startDate: Timestamp.now(),
            targetDate: Timestamp.now(), // Placeholder
        },
        {
            title: "Eco-Tracking Mobile App",
            description: "iOS and Android app for tracking carbon footprint.",
            customerId: customerIds[1].id,
            status: "planning",
            progress: 15,
            tags: ["mobile-app", "sustainability"],
            startDate: Timestamp.now(),
            targetDate: Timestamp.now(),
        },
        {
            title: "Quantum Data Visualization Dashboard",
            description: "Real-time 3D visualization of quantum bit states.",
            customerId: customerIds[3].id,
            status: "review",
            progress: 90,
            tags: ["web-app", "data-viz", "3d"],
            startDate: Timestamp.now(),
            targetDate: Timestamp.now(),
        }
    ];

    const projectIds = [];
    for (const project of projects) {
        const id = await createDocument("projects", project);
        projectIds.push({ ...project, id });
        console.log(`Created project: ${project.title}`);
    }

    // 3. Create Project Requests
    const requestStatuses = ["new", "in-review", "new", "rejected", "converted"];
    const requests = [
        {
            requestCode: "REQ-ALPHA",
            contactInfo: { name: "John Doe", email: "john@startup.io", company: "Stealth Startup", country: "USA" },
            details: { problem: "Need an MVP for a fintech app.", solutionType: "mobile-app", timeline: "urgent", budget: "10k-25k" },
            status: "new",
            publicStatus: "Signal Received",
            publicNotes: "We have received your mission parameters. Initial triage in progress.",
        },
        {
            requestCode: "REQ-BETA",
            contactInfo: { name: "Jane Smith", email: "jane@retail.com", company: "Retail Giants", country: "UK" },
            details: { problem: "Migrate legacy e-commerce to headless.", solutionType: "web-app", timeline: "3-6-months", budget: "25k+" },
            status: "in-review",
            publicStatus: "Analysis Phase",
            publicNotes: "Our architects are analyzing your legacy schema to propose a migration roadmap.",
        },
        {
            requestCode: "REQ-GAMMA",
            contactInfo: { name: "Mike Ross", email: "mike@lawfirm.com", company: "Pearson Specter", country: "USA" },
            details: { problem: "Internal document management system.", solutionType: "web-app", timeline: "1-3-months", budget: "10k-25k" },
            status: "new",
        },
        {
            requestCode: "REQ-DELTA",
            contactInfo: { name: "Spam Bot", email: "spam@bot.net", company: "Spam Inc", country: "Unknown" },
            details: { problem: "Buy cheap rolex.", solutionType: "other", timeline: "urgent", budget: "under-5k" },
            status: "rejected",
            adminNotes: "Obvious spam.",
        },
        {
            requestCode: "REQ-OMEGA",
            contactInfo: { name: "Alice Chen", email: "alice@techflow.com", company: "TechFlow Dynamics", country: "Singapore" },
            details: { problem: "AI Customer Support Agent", solutionType: "ai-integration", timeline: "3-6-months", budget: "25k+" },
            status: "converted",
            publicStatus: "Mission Active",
            publicNotes: "Project converted. Execution modules engaged.",
            projectId: projectIds[0].id, // Link to the created project
        }
    ];

    for (const request of requests) {
        // @ts-ignore - status type matching
        await createDocument("project_requests", request);
        console.log(`Created request: ${request.requestCode}`);
    }

    // 5. Create Epics & Stories (Agile Hierarchy)
    console.log("Seeding Epics and Stories...");

    // Define some random Epics for the first project
    const epicsData = [
        {
            title: "Phase 1: Core Architecture",
            description: "Establishing the base infrastructure and security layers.",
            status: "completed",
            priority: "high",
        },
        {
            title: "Phase 2: AI Integration Module",
            description: "Connecting to OpenAI API and training custom models.",
            status: "in-progress",
            priority: "critical",
        },
        {
            title: "Phase 3: User Dashboard",
            description: "Frontend implementation of the client facing portal.",
            status: "planning",
            priority: "medium",
        }
    ];

    for (const epicTemplate of epicsData) {
        const epic = {
            ...epicTemplate,
            projectId: projectIds[0].id,
            startDate: Timestamp.now(),
            targetDate: Timestamp.now(),
            tags: ["agile", "phase"],
        };
        const epicId = await createDocument("epics", epic);
        console.log(`Created Epic: ${epic.title}`);

        // Create Stories for this Epic
        const stories = [
            { title: "Setup CI/CD Pipeline", type: "task", points: 3, status: "done" },
            { title: "User Authentication Flow", type: "story", points: 5, status: "done" },
            { title: "API Gateway Configuration", type: "task", points: 5, status: "in-progress" },
            { title: "Fix Login Timeout Bug", type: "bug", points: 2, status: "todo" }
        ];

        for (const story of stories) {
            await createDocument("tasks", {
                ...story,
                projectId: projectIds[0].id,
                epicId: epicId,
                priority: "medium",
                description: `Implementation of ${story.title}`,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            });
        }
    }

    // 4. Create Admin User (for Access)
    const adminUser = {
        uid: "admin-user-id", // Note: This ID must match Auth UID if testing with real Auth, but for dev we might just need the doc.
        // Ideally the user signs up with generic email, gets a UID, and we manually set their role.
        // OR we create a doc here that matches a known email if we used email as ID (bad practice)
        // Since we use UID, we can't easily seed the AUTH user here.
        // BETTER: Create a customer we already made above (e.g. techflow) and GIVE THEM ADMIN ROLE for testing?
        // OR just tell the user how to become admin.

        // Let's create a specific user doc that matches the "TechFlow" contact email if they sign up.
        // Actually, RoleGuard checks `users/{uid}`.
        // If the user logs in as `contact@techflow.com`, their UID depends on Auth.
        // We can't predict UID.

        // TEMPORARY FIX: We can't seed Auth Users.
        // But we can instruct the user.
    };

    // Instead of seeding a user which is hard, I will rely on the "Invalid Credentials" fix which helps them log in as CUSTOMER.
    // For ADMIN, they need to be manually promoted.
    // I will notify the user with instructions or a "Promote to Admin" cheat button.

    console.log("Database seed complete!");
}
