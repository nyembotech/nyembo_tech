"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

import { Organization } from "@/types/firestore";

interface CustomClaims {
    role?: 'admin' | 'staff' | 'customer';
    organizationId?: string;
    permissions?: string[];
}

interface UserProfile {
    displayName?: string;
    email?: string;
    photoURL?: string;
    role?: 'admin' | 'staff' | 'customer';
    organizationId?: string;
    customerId?: string;
    createdAt?: unknown;
    updatedAt?: unknown;
}

interface AuthUser extends User {
    role?: "admin" | "staff" | "customer";
    customClaims?: CustomClaims;
    organizationId?: string;
}

interface AuthContextType {
    user: AuthUser | null;
    profile: UserProfile | null;
    loading: boolean;
    role: "admin" | "staff" | "customer" | null;
    organization: Organization | null;
    signIn: (email: string, pass: string) => Promise<void>;
    signOut: () => Promise<void>;
    switchOrganization: (orgId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [role, setRole] = useState<"admin" | "staff" | "customer" | null>(null);
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Fetch customized user doc for role & org
                    let userDocRef = doc(db, "users", firebaseUser.uid);
                    let userDoc = await getDoc(userDocRef);

                    if (!userDoc.exists()) {
                        console.warn("User document not found in Firestore.");
                        setProfile(null);
                        setOrganization(null);
                    } else {
                        const userData = userDoc.data();
                        const userRole = (userData?.role as string)?.toLowerCase() as "admin" | "staff" | "customer";
                        setRole(userRole || "customer");
                        setProfile(userData);

                        // Fetch Organization
                        // If user has organizationId, fetch it. Otherwise default/null.
                        if (userData.organizationId) {
                            const orgDoc = await getDoc(doc(db, "organizations", userData.organizationId));
                            if (orgDoc.exists()) {
                                setOrganization({ id: orgDoc.id, ...orgDoc.data() } as Organization);
                            }
                        } else {
                            // Temporary: Set default "Nyembotech" for migration/legacy users
                            setOrganization({
                                id: "default",
                                name: "Nyembotech",
                                slug: "nyembotech",
                                ownerId: "system",
                                createdAt: userData.createdAt, // mock
                                updatedAt: userData.updatedAt  // mock
                            } as Organization);
                        }
                    }

                    setUser(firebaseUser);
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            } else {
                setUser(null);
                setRole(null);
                setProfile(null);
                setOrganization(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, pass: string) => {
        await signInWithEmailAndPassword(auth, email, pass);
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
        setUser(null);
        setRole(null);
        setProfile(null);
        setOrganization(null);
        router.push("/login");
    };

    const switchOrganization = async (orgId: string) => {
        // Only for super-admins/logic later
        // For now, valid implementation would require re-fetching context
        // This is a stub for the "Multi-Tenant Readiness" prompt
        console.log("Switching to organization:", orgId);
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, role, organization, signIn, signOut, switchOrganization }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
