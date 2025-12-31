"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, Save, BrainCircuit, Activity, ShieldAlert, Zap, Lock } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useFeatureFlag } from "@/hooks/use-feature-flag";

interface ArchitectureResult {
    highLevelDiagram: string;
    components: { name: string; technology: string; purpose: string }[];
    risks: string[];
    nextSteps: string[];
    complexity: "S" | "M" | "L" | "XL";
}

export default function AIArchitectPage() {
    const { user } = useAuth();
    const { isEnabled, loading: flagLoading } = useFeatureFlag("ai_architect");
    const [context, setContext] = useState("");

    if (flagLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Access Control Verifying...</div>;

    if (!isEnabled) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-8">
                <div className="max-w-md text-center space-y-6 p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                        <Lock className="w-8 h-8 text-red-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">Experimental Feature Locked</h1>
                        <p className="text-gray-400 text-sm">
                            Access to the AI Architect Console is restricted to authorized personnel with active clearance.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    const [currentStack, setCurrentStack] = useState("");
    const [goals, setGoals] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ArchitectureResult | null>(null);
    const [targetProjectId, setTargetProjectId] = useState("");

    const handleAction = async (action: string) => {
        if (!context || !goals) {
            toast.error("Please provide at least Context and Goals.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/architect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    context,
                    currentStack,
                    goals,
                    action,
                    userId: user?.uid,
                }),
            });

            if (!res.ok) throw new Error("Failed to generate architecture");

            const data = await res.json();
            setResult(data);
            toast.success("Architecture generated successfully.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate architecture.");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveToProject = async () => {
        if (!result || !targetProjectId) {
            toast.error("Enter a Project ID to save the notes.");
            return;
        }

        try {
            const res = await fetch("/api/architect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "save",
                    projectId: targetProjectId,
                    notes: result,
                    userId: user?.uid,
                }),
            });

            if (!res.ok) throw new Error("Failed to save notes");

            toast.success(`Notes saved to project ${targetProjectId} successfully.`);
        } catch (error) {
            console.error("Save Error:", error);
            toast.error("Failed to save project notes.");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans selection:bg-nyembo-gold/30">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-nyembo-gold to-white">
                            AI Architect Console
                        </h1>
                        <p className="text-muted-foreground mt-2 flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4 text-nyembo-gold" />
                            System Design & Migration Planner
                        </p>
                    </div>
                    <Badge variant="outline" className="text-nyembo-gold border-nyembo-gold/30 px-4 py-1">
                        INTERNAL ONLY
                    </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Input Panel */}
                    <Card className="lg:col-span-1 bg-white/5 border-white/10 backdrop-blur-md h-fit">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-nyembo-blue" />
                                Mission Parameters
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Client Context</label>
                                <Textarea
                                    placeholder="e.g. Large logistics firm, high traffic..."
                                    className="bg-black/50 border-white/10 min-h-[100px]"
                                    value={context}
                                    onChange={(e) => setContext(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Current Stack</label>
                                <Input
                                    placeholder="e.g. Legacy PHP, MySQL..."
                                    className="bg-black/50 border-white/10"
                                    value={currentStack}
                                    onChange={(e) => setCurrentStack(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">Mission Goals</label>
                                <Textarea
                                    placeholder="e.g. Move to Serverless, Reduce Latency..."
                                    className="bg-black/50 border-white/10 min-h-[100px]"
                                    value={goals}
                                    onChange={(e) => setGoals(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-4">
                                <Button
                                    variant="secondary"
                                    onClick={() => handleAction("Propose Architecture")}
                                    disabled={loading}
                                    className="bg-nyembo-blue/20 text-nyembo-blue hover:bg-nyembo-blue/30 border border-nyembo-blue/50"
                                >
                                    Propose Arch
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => handleAction("Suggest Migration")}
                                    disabled={loading}
                                    className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/50"
                                >
                                    Migration
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => handleAction("Risk Analysis")}
                                    disabled={loading}
                                    className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50"
                                >
                                    Risk Check
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => handleAction("Complexity Estimate")}
                                    disabled={loading}
                                    className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/50"
                                >
                                    Complexity
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Output Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        {loading ? (
                            <div className="h-64 flex flex-col items-center justify-center text-muted-foreground space-y-4">
                                <Loader2 className="w-12 h-12 animate-spin text-nyembo-gold" />
                                <p className="animate-pulse">Consulting AI Architect Core...</p>
                            </div>
                        ) : result ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                {/* Results Toolbar */}
                                <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/10">
                                    <div className="flex items-center gap-4">
                                        <Badge className="bg-white/10 text-white hover:bg-white/20">
                                            Complexity: {result.complexity}
                                        </Badge>
                                        <Badge variant="outline" className="text-nyembo-sky border-nyembo-sky/50">
                                            {result.components.length} Components
                                        </Badge>
                                    </div>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Target Project ID"
                                            className="w-40 bg-black/50 border-white/10 h-9"
                                            value={targetProjectId}
                                            onChange={(e) => setTargetProjectId(e.target.value)}
                                        />
                                        <Button size="sm" onClick={handleSaveToProject} className="bg-nyembo-gold text-black hover:bg-yellow-500">
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Notes
                                        </Button>
                                    </div>
                                </div>

                                {/* Collapsible Sections */}
                                <Accordion type="single" collapsible className="w-full space-y-4">

                                    <AccordionItem value="diagram" className="border-white/10 bg-black/40 rounded-lg px-4">
                                        <AccordionTrigger className="text-nyembo-gold">High-Level Diagram</AccordionTrigger>
                                        <AccordionContent>
                                            <pre className="p-4 bg-black/80 rounded-lg text-xs overflow-x-auto font-mono text-green-400 border border-white/5 mt-2">
                                                {result.highLevelDiagram}
                                            </pre>
                                            <p className="text-xs text-muted-foreground mt-2 italic">* Render this Mermaid diagram in your documentation tool.</p>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="components" className="border-white/10 bg-black/40 rounded-lg px-4">
                                        <AccordionTrigger className="text-white hover:text-nyembo-blue">Key Components</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                                {result.components.map((comp, idx) => (
                                                    <Card key={idx} className="bg-white/5 border-white/10 hover:border-nyembo-blue/50 transition-colors mb-0">
                                                        <CardContent className="p-4">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h3 className="font-bold text-white">{comp.name}</h3>
                                                                <Badge variant="secondary" className="text-[10px]">{comp.technology}</Badge>
                                                            </div>
                                                            <p className="text-sm text-gray-400">{comp.purpose}</p>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="risks" className="border-white/10 bg-red-500/5 rounded-lg px-4">
                                        <AccordionTrigger className="text-red-400">Risk Analysis</AccordionTrigger>
                                        <AccordionContent>
                                            <ul className="list-disc list-inside space-y-2 text-sm text-gray-300 mt-2">
                                                {result.risks.map((risk, i) => (
                                                    <li key={i}>{risk}</li>
                                                ))}
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="nextsteps" className="border-white/10 bg-nyembo-gold/5 rounded-lg px-4">
                                        <AccordionTrigger className="text-nyembo-gold">Next Steps</AccordionTrigger>
                                        <AccordionContent>
                                            <ul className="list-disc list-inside space-y-2 text-sm text-gray-300 mt-2">
                                                {result.nextSteps.map((step, i) => (
                                                    <li key={i}>{step}</li>
                                                ))}
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>

                                </Accordion>

                            </motion.div>
                        ) : (
                            <div className="h-64 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-white/10 rounded-lg">
                                <BrainCircuit className="w-16 h-16 opacity-20 mb-4" />
                                <p>Ready to design. Enter parameters and select an action.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
