"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function SetupPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const promoteToAdmin = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Create user document in 'users' collection
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                role: "admin", // EXPLICITLY SET AS ADMIN
                displayName: user.displayName || "Tech User", // Use existing displayName or default
                createdAt: new Date().toISOString(), // Keep existing createdAt logic
                // customClaims: { admin: true } // customClaims are typically set via Firebase Admin SDK, not client-side setDoc
            }, { merge: true }); // Use merge to update existing document
            setMessage("Success! You are now an Admin. Refresh and go to /admin.");
        } catch (err: any) {
            setMessage("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white p-4">
            <Card className="max-w-md w-full bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="text-nyembo-sky" />
                        Admin Setup
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-zinc-400">
                        Current User: <span className="text-white font-mono">{user?.email || "Not active"}</span>
                    </p>
                    <p className="text-xs text-zinc-500">
                        Click below to force-promote the current user to ADMIN functionality.
                    </p>

                    {user ? (
                        <Button
                            className="w-full bg-nyembo-sky text-black hover:bg-nyembo-sky/90"
                            onClick={promoteToAdmin}
                            disabled={loading}
                        >
                            {loading ? "Promoting..." : "Promote to Admin"}
                        </Button>
                    ) : (
                        <Button className="w-full" disabled>Please Log In First</Button>
                    )}

                    {message && <p className="text-green-500 text-sm font-bold mt-2">{message}</p>}
                    <div className="pt-4 border-t border-zinc-800">
                        <p className="text-xs text-zinc-500 mb-2">Development Tools</p>
                        <Button
                            variant="outline"
                            className="w-full text-zinc-400 hover:text-white border-zinc-700"
                            onClick={async () => {
                                setLoading(true);
                                try {
                                    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
                                    const bookingsRef = collection(db, "academy_bookings");

                                    const samples = [
                                        {
                                            companyName: "CyberDyne Systems",
                                            contactName: "Miles Dyson",
                                            contactEmail: "miles@cyberdyne.com",
                                            programTitle: "AI Engineering Bootcamp",
                                            participants: 12,
                                            format: "Onsite",
                                            status: "confirmed",
                                            invoiceRef: "INV-2025-9921",
                                            country: "USA",
                                            createdAt: serverTimestamp()
                                        },
                                        {
                                            companyName: "Tyrell Corp",
                                            contactName: "Eldon Tyrell",
                                            contactEmail: "ceo@tyrell.com",
                                            programTitle: "Executive AI Leadership",
                                            participants: 3,
                                            format: "In-Person",
                                            status: "requested",
                                            notes: "Need focus on replicant psychology.",
                                            country: "Los Angeles",
                                            createdAt: serverTimestamp()
                                        },
                                        {
                                            companyName: "Massive Dynamic",
                                            contactName: "Nina Sharp",
                                            contactEmail: "n.sharp@massivedynamic.com",
                                            programTitle: "AI for Business Strategy",
                                            participants: 25,
                                            format: "Online",
                                            status: "proposal_sent",
                                            country: "New York",
                                            createdAt: serverTimestamp()
                                        },
                                        {
                                            companyName: "Aperture Science",
                                            contactName: "Cave Johnson",
                                            contactEmail: "cave@aperture.com",
                                            programTitle: "Product Management in AI Era",
                                            participants: 50,
                                            format: "Hybrid",
                                            status: "requested",
                                            notes: "We do what we must because we can.",
                                            country: "USA",
                                            createdAt: serverTimestamp()
                                        }
                                    ];

                                    for (const booking of samples) {
                                        await addDoc(bookingsRef, booking);
                                    }
                                    setMessage("Success! Added 4 sample bookings.");
                                } catch (e: any) {
                                    setMessage("Error seeding: " + e.message);
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            disabled={loading}
                        >
                            Seed Academy Data
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
