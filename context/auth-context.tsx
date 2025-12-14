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

interface AuthUser extends User {
    role?: "admin" | "staff" | "customer";
    customClaims?: any;
}

interface AuthContextType {
    user: AuthUser | null;
    profile: any | null;
    loading: boolean;
    role: "admin" | "staff" | "customer" | null;
    signIn: (email: string, pass: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [role, setRole] = useState<"admin" | "staff" | "customer" | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Fetch customized user doc for role
                    // First try 'users' collection (Customers)
                    let userDocRef = doc(db, "users", firebaseUser.uid);
                    let userDoc = await getDoc(userDocRef);

                    // If not found, try 'admins' or just assume structure. 
                    // For this prompt, let's assume all users (admins/customers) are in 'users' or we check a 'roles' collection.
                    // Implementation: The prompt says "fetch from Firestore (users or admins / customers collection)".
                    // Let's stick to a single 'users' collection for simplicity or check role field.

                    if (!userDoc.exists()) {
                        // Fallback: If no doc, they might be a new user or just Auth-only.
                        // But we need a role. Default to 'customer' if not defined? 
                        // Or keep role null which restricts access.
                        console.warn("User document not found in Firestore.");
                        setProfile(null);
                    } else {
                        const userData = userDoc.data();
                        const userRole = (userData?.role as string)?.toLowerCase() as "admin" | "staff" | "customer";
                        setRole(userRole || "customer"); // Default to customer if missing
                        setProfile(userData);
                    }

                    setUser(firebaseUser);
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            } else {
                setUser(null);
                setRole(null);
                setProfile(null);
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
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, role, signIn, signOut }}>
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
