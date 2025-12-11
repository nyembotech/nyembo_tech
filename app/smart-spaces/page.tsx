"use client";

import { FuturisticPanel } from "@/components/ui/futuristic-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Thermometer, Zap, Bot, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SmartSpacesPage() {
    return (
        <div className="min-h-screen pb-20">
            {/* Hero */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-nyembo-sky/5 -z-10" />
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
                    >
                        Turn your building into a <br />
                        <span className="text-nyembo-sky">living system.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
                    >
                        Intelligent automation that adapts to your needs. From energy efficiency to seamless security.
                    </motion.p>
                </div>
            </section>

            {/* What we automate */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-white mb-12 text-center">What We Automate</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FuturisticPanel
                        title="Access Control"
                        subtitle="Biometric and mobile-first entry systems."
                        icon={Lock}
                        variant="primary"
                    />
                    <FuturisticPanel
                        title="Climate"
                        subtitle="AI-driven HVAC optimization for comfort and savings."
                        icon={Thermometer}
                        variant="accent"
                    />
                    <FuturisticPanel
                        title="Energy"
                        subtitle="Real-time monitoring and load balancing."
                        icon={Zap}
                        variant="ghost"
                    />
                    <FuturisticPanel
                        title="AI Concierge"
                        subtitle="Voice-activated assistance for occupants."
                        icon={Bot}
                        variant="primary"
                    />
                </div>
            </section>

            {/* 3D Controls Gallery (Simulated) */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Temperature Knob Simulation */}
                    <Card className="bg-card/30 border-white/10 shadow-neumo flex flex-col items-center justify-center p-8 aspect-square group hover:border-nyembo-red/30 transition-colors">
                        <div className="relative w-40 h-40 rounded-full border-4 border-white/10 flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                            <div className="absolute inset-0 rounded-full border-t-4 border-nyembo-red rotate-45" />
                            <div className="text-4xl font-bold text-white">22°</div>
                        </div>
                        <p className="mt-6 text-muted-foreground font-medium">Climate Control</p>
                    </Card>

                    {/* Light Slider Simulation */}
                    <Card className="bg-card/30 border-white/10 shadow-neumo flex flex-col items-center justify-center p-8 aspect-square group hover:border-nyembo-yellow/30 transition-colors">
                        <div className="w-16 h-48 bg-white/5 rounded-full relative overflow-hidden border border-white/10">
                            <div className="absolute bottom-0 left-0 right-0 bg-nyembo-yellow h-[70%] shadow-[0_0_20px_rgba(246,227,15,0.5)]" />
                        </div>
                        <p className="mt-6 text-muted-foreground font-medium">Lighting Intensity</p>
                    </Card>

                    {/* Security Toggle Simulation */}
                    <Card className="bg-card/30 border-white/10 shadow-neumo flex flex-col items-center justify-center p-8 aspect-square group hover:border-nyembo-sky/30 transition-colors">
                        <div className="w-32 h-16 rounded-full bg-nyembo-sky/20 border border-nyembo-sky/50 p-1 relative cursor-pointer">
                            <div className="absolute right-1 top-1 bottom-1 w-14 rounded-full bg-nyembo-sky shadow-[0_0_15px_rgba(53,203,248,0.8)]" />
                        </div>
                        <p className="mt-6 text-muted-foreground font-medium">System Armed</p>
                    </Card>
                </div>
            </section>

            {/* Project Journey Timeline */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-white mb-12 text-center">Your Transformation Journey</h2>
                <div className="relative max-w-4xl mx-auto">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2 hidden md:block" />

                    {[
                        { step: "01", title: "Survey", desc: "We analyze your physical space and infrastructure." },
                        { step: "02", title: "Design", desc: "Custom IoT architecture tailored to your needs." },
                        { step: "03", title: "Install", desc: "Seamless deployment of sensors and controllers." },
                        { step: "04", title: "Configure", desc: "AI model training and system calibration." },
                        { step: "05", title: "Monitor", desc: "24/7 remote monitoring and optimization." },
                    ].map((item, i) => (
                        <div key={i} className={`flex flex-col md:flex-row items-center gap-8 mb-12 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                            <div className="flex-1 text-center md:text-left">
                                <div className={`p-6 rounded-2xl bg-card/50 border border-white/10 shadow-neumo hover:border-nyembo-sky/30 transition-all ${i % 2 === 0 ? "md:text-right" : ""}`}>
                                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-muted-foreground">{item.desc}</p>
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-nyembo-sky/10 border border-nyembo-sky/30 flex items-center justify-center text-nyembo-sky font-bold z-10 shrink-0">
                                {item.step}
                            </div>
                            <div className="flex-1 hidden md:block" />
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Form */}
            <section className="container mx-auto px-4 py-16 max-w-2xl">
                <Card className="bg-card border-nyembo-sky/20 shadow-neumo overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-nyembo-yellow via-nyembo-gold to-nyembo-red" />
                    <CardHeader>
                        <CardTitle className="text-2xl text-center text-white">Transform My Space</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label>Company</Label>
                                <Input placeholder="Acme Inc" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Input placeholder="City, Country" />
                        </div>
                        <div className="space-y-2">
                            <Label>Property Type</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="office">Office Building</SelectItem>
                                    <SelectItem value="residential">Residential Complex</SelectItem>
                                    <SelectItem value="retail">Retail Space</SelectItem>
                                    <SelectItem value="industrial">Industrial Facility</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Budget Band</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select budget" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="small">$10k - $50k</SelectItem>
                                    <SelectItem value="medium">$50k - $200k</SelectItem>
                                    <SelectItem value="large">$200k+</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className="w-full bg-nyembo-yellow text-black hover:bg-nyembo-gold font-bold h-12 mt-4">
                            Request Consultation <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
