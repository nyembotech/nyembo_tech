
import * as admin from 'firebase-admin';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables from .env.local if present
dotenv.config({ path: join(process.cwd(), '.env.local') });

// Initialize Firebase Admin
// If connecting to Emulator, FIRESTORE_EMULATOR_HOST env var should be set.
// Otherwise, it needs GOOGLE_APPLICATION_CREDENTIALS or useAppDefault.

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'nyembo-tech-demo';

console.log(`Initializing Admin SDK for project: ${projectId}`);
if (process.env.FIRESTORE_EMULATOR_HOST) {
    console.log(`🔌 Connecting to Firestore Emulator at ${process.env.FIRESTORE_EMULATOR_HOST}`);
    admin.initializeApp({ projectId });
} else {
    // For real dev/staging, we'd typically need a service account.
    // Trying to use application default credentials or just projectId if authorized in env.
    // If the user hasn't set up service account, this might fail against a real DB without one. 
    // But standard practice for "seed" scripts is to have admin access.
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        try {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId
            });
        } catch (e) {
            console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY", e);
            process.exit(1);
        }
    } else {
        // Fallback to default (might work if logged in via gcloud auth application-default login)
        admin.initializeApp({ projectId });
    }
}

const db = admin.firestore();

// --- Data Generators ---

const generateCustomers = (count: number) => {
    const customers = [];
    for (let i = 0; i < count; i++) {
        const type = faker.helpers.arrayElement(['company', 'individual']);
        const companyName = type === 'company' ? faker.company.name() : undefined;
        const name = type === 'company' ? faker.person.fullName() : faker.person.fullName();

        customers.push({
            name: name,
            contactEmail: faker.internet.email(),
            domain: companyName ? faker.internet.domainName() : 'gmail.com',
            status: faker.helpers.arrayElement(['active', 'active', 'active', 'pending', 'inactive']), // weighted to active
            plan: faker.helpers.arrayElement(['starter', 'business', 'enterprise', 'enterprise']),
            type: type,
            companyName: companyName,
            onboardingStatus: 'completed',
            createdAt: admin.firestore.Timestamp.fromDate(faker.date.past({ years: 1 })),
            updatedAt: admin.firestore.Timestamp.now(),
        });
    }
    return customers;
};

const generateProjects = (customerId: string, count: number) => {
    const projects = [];
    for (let i = 0; i < count; i++) {
        const statuses = ['planning', 'in-progress', 'review', 'completed', 'on-hold'];
        const status = faker.helpers.arrayElement(statuses);
        const startDate = faker.date.past({ years: 1 });
        const targetDate = faker.date.future({ years: 1, refDate: startDate });

        projects.push({
            title: faker.commerce.productName() + ' ' + faker.helpers.arrayElement(['Implementation', 'Development', 'Migration', 'Audit', 'Integration']),
            description: faker.lorem.paragraph(),
            customerId: customerId,
            status: status,
            progress: status === 'completed' ? 100 : status === 'planning' ? 0 : faker.number.int({ min: 10, max: 90 }),
            tags: faker.helpers.arrayElements(['ai', 'web', 'mobile', 'cloud', 'security', 'blockchain', 'iot'], { min: 1, max: 4 }),
            startDate: admin.firestore.Timestamp.fromDate(startDate),
            targetDate: admin.firestore.Timestamp.fromDate(targetDate),
            budget: faker.commerce.price({ min: 5000, max: 50000 }),
            priority: faker.helpers.arrayElement(['low', 'medium', 'high', 'critical']),
            createdAt: admin.firestore.Timestamp.fromDate(startDate),
            updatedAt: admin.firestore.Timestamp.now(),
        });
    }
    return projects;
};

const generateTasks = (projectId: string, count: number) => {
    const tasks = [];
    for (let i = 0; i < count; i++) {
        const isDone = faker.datatype.boolean();
        tasks.push({
            title: faker.hacker.verb() + ' ' + faker.hacker.adjective() + ' ' + faker.hacker.noun(),
            description: faker.lorem.sentence(),
            projectId: projectId,
            status: isDone ? 'done' : faker.helpers.arrayElement(['todo', 'in-progress', 'review']),
            createdAt: admin.firestore.Timestamp.past(),
            dueDate: admin.firestore.Timestamp.future(),
            assignee: faker.person.fullName(),
        });
    }
    return tasks;
};

const generateTickets = (customerId: string, projectId: string | null, count: number) => {
    const tickets = [];
    for (let i = 0; i < count; i++) {
        tickets.push({
            subject: faker.hacker.phrase(),
            description: faker.lorem.paragraph(),
            customerId: customerId,
            projectId: projectId,
            status: faker.helpers.arrayElement(['open', 'in-progress', 'resolved', 'closed']),
            type: faker.helpers.arrayElement(['bug', 'feature', 'support', 'billing']),
            priority: faker.helpers.arrayElement(['low', 'medium', 'high', 'critical']),
            createdAt: admin.firestore.Timestamp.past(),
        });
    }
    return tickets;
};

const generateStats = () => {
    // Just some random stats activity log
    return [];
};


// --- Seeder Function ---

async function seed() {
    console.log("🌱 Starting Database Seed...");

    const batchSize = 500;

    // 1. Customers
    console.log("Generating Customers...");
    const customerData = generateCustomers(10);
    const customerIds: string[] = [];

    for (const data of customerData) {
        const ref = await db.collection('customers').add(data);
        customerIds.push(ref.id);
        console.log(`+ Customer: ${data.name} (${ref.id})`);
    }

    // 2. Projects & Requests & Tickets
    console.log("Generating Projects, Tickets, and Tasks...");

    for (const custId of customerIds) {
        // Projects per customer
        const numProjects = faker.number.int({ min: 1, max: 4 });
        const projs = generateProjects(custId, numProjects);

        for (const proj of projs) {
            const projRef = await db.collection('projects').add(proj);
            console.log(`  > Project: ${proj.title}`);

            // Tasks per project
            const numTasks = faker.number.int({ min: 3, max: 8 });
            const tasks = generateTasks(projRef.id, numTasks);
            const taskBatch = db.batch();
            for (const task of tasks) {
                const tr = db.collection('tasks').doc();
                taskBatch.set(tr, task);
            }
            await taskBatch.commit();
        }

        // Tickets per customer
        const numTickets = faker.number.int({ min: 1, max: 3 });
        const tickets = generateTickets(custId, null, numTickets);
        for (const ticket of tickets) {
            await db.collection('tickets').add(ticket);
        }
    }

    // 3. Independent Project Requests
    console.log("Generating Project Requests...");
    for (let i = 0; i < 5; i++) {
        await db.collection('project_requests').add({
            requestCode: 'REQ-' + faker.string.alphanumeric(6).toUpperCase(),
            contactInfo: {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                company: faker.company.name(),
                country: faker.location.country(),
            },
            details: {
                problem: faker.lorem.paragraph(),
                solutionType: faker.helpers.arrayElement(['web-app', 'mobile-app', 'ai-integration']),
                timeline: '3-6-months',
                budget: '10k-25k',
            },
            status: faker.helpers.arrayElement(['new', 'in-review', 'rejected']),
            createdAt: admin.firestore.Timestamp.past(),
        });
    }

    // 4. Academy Events
    console.log("Generating Academy Events...");
    const events = [
        { title: "AI Fundamentals Workshop", date: faker.date.future(), type: "workshop", price: 0 },
        { title: "Advanced Machine Learning Ops", date: faker.date.future(), type: "bootcamp", price: 499 },
        { title: "Future of Tech in Africa Summit", date: faker.date.future(), type: "webinar", price: 0 },
    ];

    for (const evt of events) {
        await db.collection('academy_events').add({
            ...evt,
            description: faker.lorem.paragraph(),
            instructor: faker.person.fullName(),
            capacity: faker.number.int({ min: 20, max: 100 }),
            enrolledCount: faker.number.int({ min: 0, max: 20 }),
            status: "upcoming",
            createdAt: admin.firestore.Timestamp.now()
        });
    }

    // 5. Site Content (Marketing)
    console.log("Generating Site Content...");
    const contents = [
        { docId: 'site_content_en', heroTitle: 'Architects of the Future', heroSubtitle: 'Experience the latest technology that immerses in a live-action battlefield like never seen before' },
        { docId: 'site_content_sw', heroTitle: 'Wasanifu wa Baadaye', heroSubtitle: 'Furahia teknolojia ya hivi punde inayokupeleka katika uwanja wa vita wa moja kwa moja kama haujawahi kuona' },
        { docId: 'site_content_de', heroTitle: 'Architekten der Zukunft', heroSubtitle: 'Erleben Sie die neueste Technologie, die Sie in ein Live-Action-Schlachtfeld eintauchen lässt, wie nie zuvor' },
    ];

    for (const content of contents) {
        const { docId, ...data } = content;
        await db.collection('content').doc(docId).set(data);
    }

    console.log("✅ Seed Complete!");
}

seed().catch(console.error);

