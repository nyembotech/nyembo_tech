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

// ... imports
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ShieldCheck, ShieldX } from "lucide-react";
import { Logo } from "@/components/ui/logo";

import { useSearchParams } from "next/navigation";
// ... imports

export default function LoginPage() {
    const { signIn } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const viewParam = searchParams.get("view"); // 'admin' or 'portal'
    const hideToggle = searchParams.get("hideToggle") === "true";

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // Default mode based on param or 'customer'
    const [mode, setMode] = useState<"admin" | "customer">(
        viewParam === "admin" ? "admin" : "customer"
    );

    // Popup States
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signIn(email, password);
            setShowSuccess(true);

            // Delay redirect slightly for visual confirmation
            setTimeout(() => {
                if (mode === "admin") router.push("/admin/projects");
                else router.push("/portal");
            }, 1000);

        } catch (err: any) {
            console.error(err);
            setErrorMessage(err.message || "Identification Failed. Access Denied.");
            setShowError(true);
            setLoading(false); // Only stop loading on error, keep spin on success
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05)_0%,transparent_70%)]" />

            {/* Error Dialog */}
            <AlertDialog open={showError} onOpenChange={setShowError}>
                <AlertDialogContent className="bg-[#0a0a0f] border-red-900/50">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-red-900/20 rounded-lg">
                                <ShieldX className="w-6 h-6 text-red-500" />
                            </div>
                            <AlertDialogTitle className="text-white text-xl">Access Denied</AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-gray-400">
                            {errorMessage}
                            <br /><br />
                            Verify your credentials and clearance level before retrying.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowError(false)} className="bg-red-900/20 text-red-500 hover:bg-red-900/40 border border-red-900/50">
                            Acknowledge
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Success Dialog (Auto-closes on redirect) */}
            <AlertDialog open={showSuccess}>
                <AlertDialogContent className="bg-[#0a0a0f] border-green-900/50">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-900/20 rounded-lg">
                                <ShieldCheck className="w-6 h-6 text-green-500" />
                            </div>
                            <AlertDialogTitle className="text-white text-xl">Access Granted</AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-gray-400">
                            Secure connection established. Redirecting to secure sector...
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>


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
                        {/* Added Logo as requested if KeyRound is not enough, but keeping KeyRound for now as main icon, 
                            Maybe adding Logo small at top? User asked for "Logo on left" consistency. 
                            Let's put the Logo component here instead of KeyRound or above it. */}
                        <div className="flex justify-center mb-6">
                            {mode === "admin" ? (
                                <Logo className="scale-150" />
                            ) : (
                                <div className="relative w-24 h-24">
                                    {/* Glow effect for robot */}
                                    <div className="absolute inset-0 bg-nyembo-sky/30 blur-2xl rounded-full" />
                                    <img
                                        src="/assets/images/auth/futuristic_ai_robot_icon.png"
                                        alt="AI Security"
                                        className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]"
                                    />
                                </div>
                            )}
                        </div>

                        <h1 className="text-4xl font-black tracking-tighter text-white mb-2">ACCESS GATE</h1>
                        <p className="text-muted-foreground">Identify yourself to proceed.</p>
                    </div>

                    {/* Toggle - Hidden if hideToggle is true (Customer flow) */}
                    {!hideToggle && (
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
                    )}

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
