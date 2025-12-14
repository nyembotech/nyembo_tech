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
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                role: "admin",
                createdAt: new Date().toISOString()
            }, { merge: true });
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
                </CardContent>
            </Card>
        </div>
    );
}
