"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { submitProjectRequest } from "@/hooks/firestore/use-requests";
import { Loader2, ArrowRight, CheckCircle, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ContactPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submittedCode, setSubmittedCode] = useState<string | null>(null);
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        country: "",
        problem: "",
        solutionType: "web-app",
        timeline: "1-3-months",
        budget: "10k-25k"
    });

    const updateForm = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const code = await submitProjectRequest({
                contactInfo: {
                    name: formData.name,
                    email: formData.email,
                    company: formData.company,
                    country: formData.country,
                },
                details: {
                    problem: formData.problem,
                    solutionType: formData.solutionType as any,
                    timeline: formData.timeline as any,
                    budget: formData.budget as any,
                }
            });
            setSubmittedCode(code);
        } catch (error) {
            console.error("Submission error:", error);
            // Handle error (show toast etc)
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    if (submittedCode) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-nyembo-sky/10 to-transparent pointer-events-none" />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-lg w-full z-10 text-center"
                >
                    <div className="w-24 h-24 bg-nyembo-sky/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-nyembo-sky/50 shadow-[0_0_30px_rgba(88,255,255,0.3)]">
                        <CheckCircle className="w-12 h-12 text-nyembo-sky" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">MISSION RECEIVED</h1>
                    <p className="text-muted-foreground mb-8 text-lg">
                        Your request has been securely transmitted to our command center.
                    </p>

                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl mb-8 backdrop-blur-md">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Request Code</p>
                        <p className="text-3xl font-mono text-nyembo-sky font-bold tracking-wider">{submittedCode}</p>
                    </div>

                    <Button
                        asChild
                        className="w-full bg-nyembo-sky text-black hover:bg-nyembo-sky/90 font-bold h-12 text-lg"
                    >
                        <Link href={`/status?code=${submittedCode}`}>
                            Track Status
                        </Link>
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex flex-col pt-24 pb-12 px-4 relative overflow-x-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-nyembo-sky/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-2xl w-full mx-auto relative z-10">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Launch a Project</h1>
                    <p className="text-muted-foreground text-lg">Tell us about your mission. We'll handle the engineering.</p>
                </div>

                <Card className="bg-card/40 border-white/10 backdrop-blur-xl shadow-2xl">
                    <CardContent className="p-8">
                        {/* Progress Bar */}
                        <div className="flex gap-2 mb-8">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`h-1 flex-1 rounded-full transition-colors duration-500 ${s <= step ? 'bg-nyembo-sky' : 'bg-white/10'}`}
                                />
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-xl font-bold text-white mb-4">Identification</h3>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-sm text-muted-foreground">Full Name</label>
                                            <Input id="name" placeholder="John Doe" className="bg-white/5 border-white/10" value={formData.name} onChange={e => updateForm("name", e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm text-muted-foreground">Email Address</label>
                                            <Input id="email" type="email" placeholder="john@company.com" className="bg-white/5 border-white/10" value={formData.email} onChange={e => updateForm("email", e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="company" className="text-sm text-muted-foreground">Company / Organization</label>
                                            <Input id="company" placeholder="Acme Corp" className="bg-white/5 border-white/10" value={formData.company} onChange={e => updateForm("company", e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="country" className="text-sm text-muted-foreground">Country</label>
                                            <Input id="country" placeholder="Kenya" className="bg-white/5 border-white/10" value={formData.country} onChange={e => updateForm("country", e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <Button onClick={nextStep} disabled={!formData.name || !formData.email} className="bg-white text-black hover:bg-gray-200">
                                            Next Step <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-xl font-bold text-white mb-4">Mission Parameters</h3>

                                    <div className="space-y-2">
                                        <label htmlFor="problem" className="text-sm text-muted-foreground">Problem Description</label>
                                        <Textarea
                                            id="problem"
                                            placeholder="Describe the challenge you're facing or the opportunity you want to seize..."
                                            className="bg-white/5 border-white/10 min-h-[120px]"
                                            value={formData.problem}
                                            onChange={e => updateForm("problem", e.target.value)}
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-muted-foreground">Desired Solution</label>
                                            <Select value={formData.solutionType} onValueChange={v => updateForm("solutionType", v)}>
                                                <SelectTrigger className="bg-white/5 border-white/10">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="web-app">Web Application</SelectItem>
                                                    <SelectItem value="mobile-app">Mobile Application</SelectItem>
                                                    <SelectItem value="ai-integration">AI Integration</SelectItem>
                                                    <SelectItem value="consulting">Consulting</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm text-muted-foreground">Timeline Expectation</label>
                                            <Select value={formData.timeline} onValueChange={v => updateForm("timeline", v)}>
                                                <SelectTrigger className="bg-white/5 border-white/10">
                                                    <SelectValue placeholder="Select timeline" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="urgent">Urgent (ASAP)</SelectItem>
                                                    <SelectItem value="1-3-months">1-3 Months</SelectItem>
                                                    <SelectItem value="3-6-months">3-6 Months</SelectItem>
                                                    <SelectItem value="flexible">Flexible</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-between">
                                        <Button variant="ghost" onClick={prevStep} className="text-white hover:bg-white/10">
                                            <ChevronLeft className="mr-2 w-4 h-4" /> Back
                                        </Button>
                                        <Button onClick={nextStep} disabled={!formData.problem} className="bg-white text-black hover:bg-gray-200">
                                            Next Step <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-xl font-bold text-white mb-4">Resources & Launch</h3>

                                    {/* Cost Estimation Panel */}
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                                        <h4 className="text-sm uppercase tracking-widest text-muted-foreground mb-4 font-bold">Estimated Investment</h4>
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="text-3xl font-black text-nyembo-sky">
                                                    {(() => {
                                                        let base = 5000;
                                                        if (formData.solutionType === 'web-app') base = 15000;
                                                        if (formData.solutionType === 'mobile-app') base = 25000;
                                                        if (formData.solutionType === 'ai-integration') base = 35000;

                                                        if (formData.timeline === 'urgent') base *= 1.5;
                                                        if (formData.budget === 'under-5k') return "Custom Quote";

                                                        return `$${(base / 1000).toFixed(0)}k - $${((base * 1.5) / 1000).toFixed(0)}k`;
                                                    })()}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">Based on {formData.solutionType.replace('-', ' ')} & {formData.timeline} delivery</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-white bg-white/10 px-2 py-1 rounded"> Indicative Only</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-muted-foreground">Select Budget Band</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { label: "< $5k", value: "under-5k" },
                                                { label: "$5k - $10k", value: "5k-10k" },
                                                { label: "$10k - $25k", value: "10k-25k" },
                                                { label: "$25k+", value: "25k+" },
                                            ].map((option) => (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => updateForm("budget", option.value)}
                                                    className={`p-4 rounded-lg border cursor-pointer transition-all text-left ${formData.budget === option.value ? 'bg-nyembo-sky/10 border-nyembo-sky text-nyembo-sky' : 'bg-white/5 border-white/10 text-muted-foreground hover:border-white/30'}`}
                                                >
                                                    <span className="font-bold">{option.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-between">
                                        <Button variant="ghost" onClick={prevStep} className="text-white hover:bg-white/10">
                                            <ChevronLeft className="mr-2 w-4 h-4" /> Back
                                        </Button>
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className="bg-nyembo-sky text-black hover:bg-nyembo-sky/90 w-40 font-bold"
                                        >
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Request Project"}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
