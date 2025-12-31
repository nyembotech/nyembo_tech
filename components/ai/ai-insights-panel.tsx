"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertTriangle, Info, Lightbulb, RefreshCw, PlusCircle } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Insight {
    type: "info" | "warning" | "opportunity";
    text: string;
}

interface AIInsightsPanelProps {
    role: "admin" | "customer";
    className?: string;
}

import { useFeatureFlag } from "@/hooks/use-feature-flag";

export function AIInsightsPanel({ role, className }: AIInsightsPanelProps) {
    const { isEnabled } = useFeatureFlag("ai_insights");
    const { user } = useAuth();
    const [insights, setInsights] = useState<Insight[]>([]);
    const [loading, setLoading] = useState(true);

    if (!isEnabled) return null;

    const fetchInsights = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/insights?role=${role}&userId=${user.uid}`);
            if (!res.ok) throw new Error("Failed to fetch insights");
            const data = await res.json();
            setInsights(data);
        } catch (err) {
            console.error(err);
            // toast.error("Could not load AI insights"); // Optional: suppress to avoid noise
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchInsights();
        }
    }, [user, role]);

    const getIcon = (type: string) => {
        switch (type) {
            case "warning": return <AlertTriangle className="w-4 h-4 text-red-400" />;
            case "opportunity": return <Lightbulb className="w-4 h-4 text-nyembo-gold" />;
            default: return <Info className="w-4 h-4 text-blue-400" />;
        }
    };

    const handleCreateTask = (text: string) => {
        toast.info(`Task draft created for: "${text.substring(0, 20)}..."`);
        // Actual implementation would open a modal pre-filled
    };

    return (
        <Card className={cn("relative overflow-hidden border-nyembo-gold/30 bg-black/40 backdrop-blur-md group", className)}>
            {/* Ambient Background Effect */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-nyembo-gold/10 rounded-full blur-3xl group-hover:bg-nyembo-gold/20 transition-all duration-500" />

            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-white/5">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-nyembo-gold to-white">
                    <Sparkles className="w-5 h-5 text-nyembo-gold" />
                    AI Operations Insights
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={fetchInsights} disabled={loading} className="h-8 w-8 text-muted-foreground hover:text-white">
                    <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                </Button>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                {loading ? (
                    <div className="space-y-3">
                        <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
                        <div className="h-4 bg-white/10 rounded w-full animate-pulse" />
                        <div className="h-4 bg-white/10 rounded w-5/6 animate-pulse" />
                    </div>
                ) : insights.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No insights available at this time.</p>
                ) : (
                    <ul className="space-y-3">
                        <AnimatePresence>
                            {insights.map((insight, idx) => (
                                <motion.li
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-start gap-3 text-sm text-gray-300 bg-white/5 p-3 rounded-lg border border-transparent hover:border-white/10 transition-colors"
                                >
                                    <div className="mt-0.5 shrink-0">{getIcon(insight.type)}</div>
                                    <div className="flex-1">
                                        <p>{insight.text}</p>
                                    </div>
                                    {role === "admin" && (insight.type === "warning" || insight.type === "opportunity") && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 px-2 text-[10px] text-muted-foreground hover:text-nyembo-gold -mt-1 -mr-2"
                                            onClick={() => handleCreateTask(insight.text)}
                                        >
                                            <PlusCircle className="w-3 h-3 mr-1" />
                                            Create Task
                                        </Button>
                                    )}
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}
