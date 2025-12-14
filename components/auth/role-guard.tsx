"use client";

import { useEffect, ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RoleGuardProps {
    children: ReactNode;
    allowedRoles: ("admin" | "staff" | "customer")[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const { user, role, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
                <div className="relative">
                    <Loader2 className="w-16 h-16 text-nyembo-sky animate-spin" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-nyembo-sky">AUTH</div>
                </div>
                <p className="mt-4 text-muted-foreground animate-pulse">Verifying Credentials...</p>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect via useEffect
    }

    if (role && !allowedRoles.includes(role.toLowerCase() as any)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white p-4">
                <div className="max-w-md w-full bg-[#0a0a0f] border border-red-900/50 rounded-2xl p-8 shadow-[0_0_50px_rgba(220,38,38,0.2)] text-center relative overflow-hidden">
                    {/* Simulated 3D Red Alert Light */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-red-600 shadow-[0_0_20px_#dc2626]" />

                    <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-6" />

                    <h1 className="text-3xl font-black tracking-tighter mb-2 text-red-500">ACCESS DENIED</h1>
                    <p className="text-muted-foreground mb-8">
                        Your secure clearance level
                        <span className="text-white font-mono bg-white/10 px-2 py-0.5 rounded mx-1">
                            {role.toUpperCase()}
                        </span>
                        is insufficient for this sector.
                    </p>

                    <Button
                        onClick={() => router.push("/")}
                        className="w-full bg-red-900/20 text-red-400 hover:bg-red-900/40 hover:text-white border border-red-900"
                    >
                        Return to Public Sector
                    </Button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
