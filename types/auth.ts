export type UserRole = "admin" | "staff" | "customer";

export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    role: UserRole;
    customerId?: string; // Link to Customer entity for "customer" role
    createdAt?: any; // Firestore Timestamp
    lastLogin?: any; // Firestore Timestamp
}
