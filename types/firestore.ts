import { Timestamp } from "firebase/firestore";

export interface BaseEntity {
    id: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface Customer extends BaseEntity {
    name: string;
    domain: string;
    status: "active" | "inactive" | "pending";
    plan: "enterprise" | "business" | "starter";
    logoUrl?: string;
    contactEmail: string;
    type: "individual" | "company";
    companyName?: string;
    password?: string; // Optional: stored only if custom auth is used
    onboardingStatus?: "pending" | "invited" | "completed";
}

export interface CustomerInvite extends BaseEntity {
    token: string;
    email: string;
    customerId: string;
    used: boolean;
    expiresAt: Timestamp;
}

export interface Project extends BaseEntity {
    title: string;
    description: string;
    customerId: string; // Reference to Customer
    status: "planning" | "in-progress" | "review" | "completed" | "on-hold";
    progress: number; // 0-100
    startDate: Timestamp;
    targetDate: Timestamp;
    managerId?: string; // Reference to AdminUser (staff)
    tags: string[];
}

export interface Epic extends BaseEntity {
    title: string;
    description: string;
    projectId: string; // Reference to Project
    status: "planning" | "in-progress" | "review" | "completed";
    startDate: Timestamp;
    targetDate: Timestamp;
    priority: "low" | "medium" | "high";
    tags?: string[];
}

export interface Task extends BaseEntity {
    title: string;
    description?: string;
    projectId: string; // Reference to Project
    epicId?: string; // Reference to Epic (Optional, for hierarchy)
    assigneeId?: string; // Reference to User
    status: "todo" | "in-progress" | "review" | "done";
    priority: "low" | "medium" | "high" | "critical";
    dueDate?: Timestamp;
    storyPoints?: number; // Agile estimation
    type: "story" | "task" | "bug"; // Differentiation
}

export interface Ticket extends BaseEntity {
    subject: string;
    description: string;
    customerId: string; // Reference to Customer
    createdById: string; // Reference to User (Customer)
    assignedToId?: string; // Reference to User (Staff)
    status: "open" | "in-progress" | "resolved" | "closed";
    priority: "low" | "medium" | "high" | "urgent";
    category: "technical" | "billing" | "feature" | "other";
}

export interface AcademyEvent extends BaseEntity {
    title: string;
    description: string;
    date: Timestamp;
    duration: string; // e.g., "2 hours"
    type: "workshop" | "webinar" | "course";
    instructor: string;
    capacity: number;
    enrolledCount: number;
}

export interface ProjectRequest extends BaseEntity {
    requestCode: string;
    contactInfo: {
        name: string;
        email: string;
        company: string;
        country: string;
    };
    details: {
        problem: string;
        solutionType: "web-app" | "mobile-app" | "ai-integration" | "consulting" | "other";
        timeline: "urgent" | "1-3-months" | "3-6-months" | "flexible";
        budget: "under-5k" | "5k-10k" | "10k-25k" | "25k+";
    };
    status: "new" | "in-review" | "converted" | "rejected";
    adminNotes?: string;
    publicStatus?: string; // Friendly status text, e.g. "Designing Architecture"
    publicNotes?: string; // Detailed friendly explanation
    projectId?: string; // ID of the created project if converted
}

export interface ActivityLog extends BaseEntity {
    type: "info" | "success" | "warning" | "error";
    actorId: string; // User ID who performed the action (or "system")
    actorName?: string;
    targetType: "project" | "request" | "customer" | "ticket" | "system";
    targetId: string;
    message: string;
    metadata?: Record<string, any>; // Flexible for extra data (e.g. "oldStatus", "newStatus")
    visibility: "admin" | "customer" | "both";
    customerId?: string; // For filtering customer-specific logs
}

export interface PageContent extends BaseEntity {
    hero: {
        title: string;
        subtitle: string;
        ctaPrimary: string;
        ctaSecondary?: string;
    };
    sections: Array<{
        key: string;
        type: "cards" | "text" | "timeline" | "grid";
        title?: string;
        description?: string;
        data?: any;
    }>;
}
