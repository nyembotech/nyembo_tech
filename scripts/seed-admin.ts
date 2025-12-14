import { initializeApp, cert, getApps, applicationDefault } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { faker } from "@faker-js/faker";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;

if (!SERVICE_ACCOUNT && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error("ERROR: No Service Account provided.");
    console.error("Set FIREBASE_SERVICE_ACCOUNT_KEY (json string) or GOOGLE_APPLICATION_CREDENTIALS (path) in .env.local");
    process.exit(1);
}

if (!getApps().length) {
    const credential = SERVICE_ACCOUNT ? cert(SERVICE_ACCOUNT) : applicationDefault();
    initializeApp({
        credential,
    });
}

const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });

const LOG_TAG = "[SEED]";

async function seed() {
    console.log(`${LOG_TAG} Starting Demo Data Seeding...`);

    // 1. Customers (5-10)
    const customerCount = faker.number.int({ min: 5, max: 10 });
    const customerIds: string[] = [];

    console.log(`${LOG_TAG} Seeding ${customerCount} Customers...`);
    for (let i = 0; i < customerCount; i++) {
        const type = faker.helpers.arrayElement(["company", "individual"]);
        const name = type === "company" ? faker.company.name() : faker.person.fullName();
        const customerRef = db.collection("customers").doc();

        await customerRef.set({
            name: name,
            companyName: type === "company" ? name : undefined,
            contactEmail: faker.internet.email(),
            type: type,
            status: faker.helpers.arrayElement(["active", "active", "active", "pending", "inactive"]),
            plan: faker.helpers.arrayElement(["starter", "business", "enterprise"]),
            domain: faker.internet.domainName(),
            createdAt: Timestamp.fromDate(faker.date.past()),
            updatedAt: Timestamp.now(),
        });
        customerIds.push(customerRef.id);
    }

    // 2. Projects (10-20)
    const projectCount = faker.number.int({ min: 10, max: 20 });
    const projectIds: string[] = [];

    console.log(`${LOG_TAG} Seeding ${projectCount} Projects...`);
    for (let i = 0; i < projectCount; i++) {
        const customerId = faker.helpers.arrayElement(customerIds);
        const projectRef = db.collection("projects").doc();
        const startDate = faker.date.past();

        await projectRef.set({
            title: faker.commerce.productName() + " " + faker.helpers.arrayElement(["Initiative", "Platform", "App", "System", "Integration"]),
            description: faker.lorem.sentence(),
            customerId: customerId,
            status: faker.helpers.arrayElement(["planning", "in-progress", "review", "completed", "on-hold"]),
            progress: faker.number.int({ min: 0, max: 100 }),
            tags: faker.helpers.arrayElements(["ai", "web", "mobile", "crypto", "security", "cloud"], { min: 1, max: 3 }),
            startDate: Timestamp.fromDate(startDate),
            targetDate: Timestamp.fromDate(faker.date.future({ refDate: startDate })),
            createdAt: Timestamp.fromDate(startDate),
            updatedAt: Timestamp.now(),
        });
        projectIds.push(projectRef.id);
    }

    // 3. Tasks (30-50)
    const taskCount = faker.number.int({ min: 30, max: 50 });
    console.log(`${LOG_TAG} Seeding ${taskCount} Tasks...`);

    for (let i = 0; i < taskCount; i++) {
        const projectId = faker.helpers.arrayElement(projectIds);
        const taskRef = db.collection("tasks").doc();

        await taskRef.set({
            title: faker.hacker.verb() + " " + faker.hacker.noun(),
            description: faker.lorem.sentence(),
            projectId: projectId,
            status: faker.helpers.arrayElement(["todo", "in-progress", "review", "done"]),
            priority: faker.helpers.arrayElement(["low", "medium", "high", "critical"]),
            type: faker.helpers.arrayElement(["story", "task", "bug"]),
            storyPoints: faker.helpers.arrayElement([1, 2, 3, 5, 8, 13]),
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });
    }

    // 4. Tickets (10-15)
    const ticketCount = faker.number.int({ min: 10, max: 15 });
    console.log(`${LOG_TAG} Seeding ${ticketCount} Tickets...`);

    for (let i = 0; i < ticketCount; i++) {
        const customerId = faker.helpers.arrayElement(customerIds);
        const ticketRef = db.collection("tickets").doc();

        await ticketRef.set({
            subject: faker.hacker.phrase(),
            description: faker.lorem.paragraph(),
            customerId: customerId,
            status: faker.helpers.arrayElement(["open", "in-progress", "resolved", "closed"]),
            priority: faker.helpers.arrayElement(["low", "medium", "high", "urgent"]),
            category: faker.helpers.arrayElement(["technical", "billing", "feature", "other"]),
            createdById: "system-seed",
            createdAt: Timestamp.fromDate(faker.date.recent()),
            updatedAt: Timestamp.now(),
        });
    }

    // 5. Academy Events (3-5)
    const eventCount = faker.number.int({ min: 3, max: 5 });
    console.log(`${LOG_TAG} Seeding ${eventCount} Academy Events...`);

    for (let i = 0; i < eventCount; i++) {
        const eventRef = db.collection("academy_events").doc();
        const date = faker.date.future();

        await eventRef.set({
            title: faker.company.buzzPhrase() + " Workshop",
            description: faker.lorem.paragraph(),
            date: Timestamp.fromDate(date),
            duration: faker.helpers.arrayElement(["1 hour", "2 hours", "Half Day", "Full Day"]),
            type: faker.helpers.arrayElement(["workshop", "webinar", "course"]),
            instructor: faker.person.fullName(),
            capacity: faker.number.int({ min: 20, max: 100 }),
            enrolledCount: faker.number.int({ min: 0, max: 15 }),
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });
    }

    // 6. Site Content (Homepage Copy)
    console.log(`${LOG_TAG} Seeding Site Content...`);
    await db.collection("site_content").doc("home").set({
        heroTitle: "Future-Grade AI Software",
        heroSubtitle: "European engineering, African speed. We build the digital infrastructure of tomorrow.",
        updatedAt: Timestamp.now(),
    });

    console.log(`${LOG_TAG} Seeding Complete!`);
}

seed().catch(console.error);
