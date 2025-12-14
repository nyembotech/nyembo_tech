"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, KeyRound, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function LoginPage() {
    const { signIn } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mode, setMode] = useState<"admin" | "customer">("customer"); // Visual toggle only

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signIn(email, password);
            // Redirect logic could be smarter based on role, 
            // but AuthProvider will set role state, then the redirected page's RoleGuard will handle access.
            // For UX, we guide them:
            if (mode === "admin") router.push("/admin/projects");
            else router.push("/portal");
        } catch (err) {
            console.error(err);
            // Toast would replace this
            alert("Identification Failed. Access Denied.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05)_0%,transparent_70%)]" />

            {/* 3D Panel */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md perspective-1000"
            >
                <div className={cn(
                    "bg-[#0a0a0f] border rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-colors duration-500",
                    mode === "admin" ? "border-nyembo-yellow/30 shadow-[0_0_50px_rgba(255,255,108,0.1)]" : "border-nyembo-sky/30 shadow-[0_0_50px_rgba(88,255,255,0.1)]"
                )}>
                    {/* Top Stripe */}
                    <div className={cn(
                        "absolute top-0 inset-x-0 h-1 shadow-[0_0_20px_currentColor] transition-colors duration-500",
                        mode === "admin" ? "bg-nyembo-yellow text-nyembo-yellow" : "bg-nyembo-sky text-nyembo-sky"
                    )} />

                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className={cn(
                            "inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-colors duration-500",
                            mode === "admin" ? "bg-nyembo-yellow/10" : "bg-nyembo-sky/10"
                        )}>
                            <KeyRound className={cn(
                                "w-8 h-8 transition-colors duration-500",
                                mode === "admin" ? "text-nyembo-yellow" : "text-nyembo-sky"
                            )} />
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-white mb-2">ACCESS GATE</h1>
                        <p className="text-muted-foreground">Identify yourself to proceed.</p>
                    </div>

                    {/* Toggle */}
                    <div className="flex p-1 bg-white/5 rounded-xl mb-8 relative">
                        <div className={cn(
                            "absolute inset-y-1 w-[calc(50%-4px)] rounded-lg bg-white/10 transition-all duration-300 ease-out",
                            mode === "admin" ? "left-1" : "left-[calc(50%+4px)]"
                        )} />
                        <button
                            type="button"
                            onClick={() => setMode("admin")}
                            className={cn("flex-1 py-2 text-sm font-bold relative z-10 transition-colors", mode === "admin" ? "text-white" : "text-muted-foreground hover:text-white")}
                        >
                            COMMAND
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode("customer")}
                            className={cn("flex-1 py-2 text-sm font-bold relative z-10 transition-colors", mode === "customer" ? "text-white" : "text-muted-foreground hover:text-white")}
                        >
                            PORTAL
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label>Secure ID (Email)</Label>
                            <Input
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-black/50 border-white/10 focus:border-white/30 transition-all h-12"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Passcode</Label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-black/50 border-white/10 focus:border-white/30 transition-all h-12"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className={cn(
                                "w-full h-12 text-base font-bold shadow-lg transition-all duration-300 hover:scale-[1.02]",
                                mode === "admin"
                                    ? "bg-nyembo-yellow text-black hover:bg-nyembo-gold hover:shadow-[0_0_30px_rgba(255,255,108,0.4)]"
                                    : "bg-nyembo-sky text-black hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(88,255,255,0.4)]"
                            )}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>
                                    Authenticate <ArrowRight className="ml-2 w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="text-center mt-8 text-xs text-white/20 font-mono">
                        SECURE CONNECTION ESTABLISHED
                        <br />
                        ENCRYPTION: AES-256-GCM
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
