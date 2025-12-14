"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProjectRequestByCode } from "@/hooks/firestore/use-requests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, ArrowRight, CheckCircle2, Clock, FileText, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicStatusPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const urlCode = searchParams.get("code");

    const [searchInput, setSearchInput] = useState(urlCode || "");
    const [queryCode, setQueryCode] = useState<string | null>(urlCode);

    const { request, loading, error } = useProjectRequestByCode(queryCode || undefined);

    // Effect to update search input if URL changes (e.g. back button)
    useEffect(() => {
        if (urlCode) {
            setSearchInput(urlCode);
            setQueryCode(urlCode);
        }
    }, [urlCode]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            setQueryCode(searchInput.trim());
            router.push(`/status?code=${searchInput.trim()}`);
        }
    };

    // Calculate progress based on status
    const getProgress = (status: string) => {
        switch (status) {
            case "new": return 25;
            case "in-review": return 50;
            case "converted": return 75; // Pre-launch
            case "launched": return 100; // Hypothetical future status
            case "rejected": return 100; // End state
            default: return 0;
        }
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case "new":
                return {
                    label: "Received",
                    description: "We have received your mission request and it is queued for analysis.",
                    color: "text-blue-400",
                    bg: "bg-blue-400/10",
                    border: "border-blue-400/20"
                };
            case "in-review":
                return {
                    label: "Under Review",
                    description: "Our engineering team is analyzing your requirements and feasibility.",
                    color: "text-yellow-400",
                    bg: "bg-yellow-400/10",
                    border: "border-yellow-400/20"
                };
            case "converted":
                return {
                    label: "Project Initialized",
                    description: "Your project has been approved and is now in the active planning phase.",
                    color: "text-green-400",
                    bg: "bg-green-400/10",
                    border: "border-green-400/20"
                };
            case "rejected":
                return {
                    label: "Mission Declined",
                    description: "Unfortunately, we cannot proceed with this mission at this time.",
                    color: "text-red-400",
                    bg: "bg-red-400/10",
                    border: "border-red-400/20"
                };
            default:
                return {
                    label: "Unknown",
                    description: "Status unknown.",
                    color: "text-gray-400",
                    bg: "bg-gray-400/10",
                    border: "border-gray-400/20"
                };
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,108,0.05),transparent_50%)] pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-[400px] bg-gradient-to-t from-nyembo-sky/5 to-transparent pointer-events-none" />

            <div className="w-full max-w-2xl z-10 space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                        MISSION <span className="text-nyembo-yellow">TRACKER</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                        Enter your secure request code to track the status of your project.
                    </p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="relative max-w-md mx-auto w-full">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-nyembo-yellow/20 to-nyembo-sky/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                        <div className="relative flex shadow-2xl">
                            <Input
                                placeholder="Enter Code (e.g. REQ-123XYZ)"
                                className="h-14 pl-6 pr-32 bg-[#0a0a0f] border-white/10 text-lg rounded-full focus-visible:ring-nyembo-yellow/50 transition-all font-mono uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <Button
                                type="submit"
                                className="absolute right-1 top-1 bottom-1 rounded-full bg-nyembo-yellow text-black hover:bg-nyembo-gold font-bold px-6 h-auto"
                                disabled={!searchInput.trim() || loading}
                            >
                                {loading && queryCode ? <Loader2 className="w-4 h-4 animate-spin" /> : "TRACK"}
                            </Button>
                        </div>
                    </div>
                </form>

                {/* Results Area */}
                <div className="min-h-[400px]">
                    {queryCode && loading && (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 border-4 border-nyembo-yellow/20 rounded-full" />
                                <div className="absolute inset-0 border-4 border-t-nyembo-yellow rounded-full animate-spin" />
                            </div>
                            <p className="text-nyembo-yellow font-mono text-sm animate-pulse">ESTABLISHING UPLINK...</p>
                        </div>
                    )}

                    {!loading && queryCode && !request && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-900/10 border border-red-500/20 rounded-2xl p-8 text-center max-w-md mx-auto backdrop-blur-md"
                        >
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-red-500 mb-2">Signal Lost</h3>
                            <p className="text-muted-foreground mb-6">
                                We couldn't locate mission <span className="font-mono text-white font-bold">{queryCode}</span> in our database.
                                Please check the code and try again.
                            </p>
                            <Button variant="outline" onClick={() => setSearchInput("")} className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                                Use Another Frequency
                            </Button>
                        </motion.div>
                    )}

                    {!loading && request && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6"
                        >
                            {/* Main Status Card */}
                            <Card className={`border-0 bg-[#0c0c0e]/80 backdrop-blur-xl ring-1 ring-inset ${getStatusInfo(request.status).border} shadow-2xl`}>
                                <div className={`h-1 w-full ${getStatusInfo(request.status).bg} bg-opacity-50`} />
                                <CardHeader className="pb-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <Badge variant="outline" className="border-white/10 bg-white/5 font-mono text-xs">
                                                    {request.requestCode}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground uppercase tracking-widest">
                                                    {request.contactInfo.company}
                                                </span>
                                            </div>
                                            <CardTitle className="text-2xl font-bold text-white mb-1">
                                                {request.details.solutionType.replace("-", " ").toUpperCase()} MISSION
                                            </CardTitle>
                                            <CardDescription>
                                                Submitted on {new Date(request.createdAt.seconds * 1000).toLocaleDateString()}
                                            </CardDescription>
                                        </div>
                                        <div className={`text-right px-4 py-2 rounded-lg ${getStatusInfo(request.status).bg} border ${getStatusInfo(request.status).border}`}>
                                            <span className={`block text-xs uppercase tracking-widest mb-1 opacity-70 ${getStatusInfo(request.status).color}`}>Current Status</span>
                                            <span className={`text-lg font-bold ${getStatusInfo(request.status).color}`}>
                                                {request.publicStatus || getStatusInfo(request.status).label}
                                            </span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    {/* Progress Bar */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-widest font-medium">
                                            <span>Progress</span>
                                            <span>{getProgress(request.status)}%</span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${getProgress(request.status)}%` }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className={`h-full ${request.status === 'rejected' ? 'bg-red-500' : 'bg-gradient-to-r from-nyembo-yellow to-nyembo-sky'}`}
                                            />
                                        </div>
                                    </div>

                                    {/* Status Message / Notes */}
                                    <div className="bg-white/5 rounded-xl p-6 border border-white/5 flex gap-4">
                                        <div className="mt-1">
                                            <FileText className={`w-5 h-5 ${getStatusInfo(request.status).color}`} />
                                        </div>
                                        <div>
                                            <h4 className={`text-sm font-bold mb-1 ${getStatusInfo(request.status).color}`}>Mission Update</h4>
                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                {request.publicNotes || getStatusInfo(request.status).description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Timeline (Simplified) */}
                                    <div className="border-t border-white/5 pt-6">
                                        <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Trajectory</h4>
                                        <div className="grid grid-cols-4 gap-2 text-center text-xs">
                                            {[
                                                { id: "new", label: "Received" },
                                                { id: "in-review", label: "Review" },
                                                { id: "converted", label: "Project Start" },
                                                { id: "launched", label: "Launch" }
                                            ].map((step, idx) => {
                                                const isActive = step.id === request.status || idx < (["new", "in-review", "converted", "launched"].indexOf(request.status));
                                                // Simplified active logic for demo
                                                let activeClass = "text-muted-foreground opacity-50";
                                                if (step.id === request.status) activeClass = "text-nyembo-yellow font-bold glow-yellow";
                                                else if (getProgress(request.status) > idx * 25) activeClass = "text-white font-medium";

                                                return (
                                                    <div key={step.id} className={activeClass}>
                                                        <div className={`w-3 h-3 mx-auto rounded-full mb-2 transition-all ${step.id === request.status ? 'bg-nyembo-yellow shadow-[0_0_10px_rgba(255,255,108,0.5)]' : (getProgress(request.status) > idx * 25 ? 'bg-white' : 'bg-white/10')}`} />
                                                        {step.label}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
