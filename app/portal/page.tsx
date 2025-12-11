"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, LifeBuoy, Flag, ArrowRight, Zap } from "lucide-react";

export default function PortalPage() {
    return (
        <div className="space-y-12">
            {/* Hero Panel */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-3xl overflow-hidden p-10 md:p-16 border border-white/10 shadow-2xl"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-nyembo-sky/10 via-transparent to-nyembo-yellow/5" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-nyembo-sky/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Welcome back, <span className="text-nyembo-sky">Alex</span>.
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8">
                        Here's your Nyembotech mission status. All systems are operating within normal parameters.
                    </p>
                    <div className="flex gap-4">
                        <Button className="bg-nyembo-sky text-black hover:bg-nyembo-sky/90 shadow-[0_0_15px_rgba(53,203,248,0.3)]">
                            View Active Project
                        </Button>
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            Contact Support
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Main Floating Cards */}
            <div className="grid md:grid-cols-3 gap-8">
                {/* Projects Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="h-full bg-card/40 border-white/10 backdrop-blur-md shadow-neumo hover:border-nyembo-sky/30 transition-all group">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-xl bg-nyembo-sky/10 flex items-center justify-center mb-4 group-hover:bg-nyembo-sky group-hover:text-black transition-colors text-nyembo-sky">
                                <Rocket className="w-6 h-6" />
                            </div>
                            <CardTitle className="text-xl text-white">Active Projects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-nyembo-sky/20 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-white">Project Phoenix</h4>
                                        <Badge className="bg-nyembo-yellow text-black hover:bg-nyembo-yellow">Build</Badge>
                                    </div>
                                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-2">
                                        <div className="bg-nyembo-sky h-full w-[65%]" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Milestone: Core API Integration</p>
                                </div>
                                <Button variant="ghost" className="w-full text-nyembo-sky hover:text-white hover:bg-white/5 justify-between group/btn">
                                    View all projects <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Support Tickets Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="h-full bg-card/40 border-white/10 backdrop-blur-md shadow-neumo hover:border-nyembo-red/30 transition-all group">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-xl bg-nyembo-red/10 flex items-center justify-center mb-4 group-hover:bg-nyembo-red group-hover:text-white transition-colors text-nyembo-red">
                                <LifeBuoy className="w-6 h-6" />
                            </div>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-xl text-white">Support Tickets</CardTitle>
                                <span className="text-2xl font-bold text-white">2</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm p-2 rounded hover:bg-white/5 transition-colors cursor-pointer">
                                    <span className="text-muted-foreground">#1024 - API Latency</span>
                                    <Badge variant="outline" className="border-nyembo-gold text-nyembo-gold">In Progress</Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm p-2 rounded hover:bg-white/5 transition-colors cursor-pointer">
                                    <span className="text-muted-foreground">#1021 - User Auth</span>
                                    <Badge variant="outline" className="border-green-500 text-green-500">Resolved</Badge>
                                </div>
                                <Button variant="ghost" className="w-full text-nyembo-sky hover:text-white hover:bg-white/5 justify-between group/btn mt-2">
                                    Open new ticket <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Milestones Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="h-full bg-card/40 border-white/10 backdrop-blur-md shadow-neumo hover:border-nyembo-gold/30 transition-all group">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-xl bg-nyembo-gold/10 flex items-center justify-center mb-4 group-hover:bg-nyembo-gold group-hover:text-black transition-colors text-nyembo-gold">
                                <Flag className="w-6 h-6" />
                            </div>
                            <CardTitle className="text-xl text-white">Upcoming Milestones</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 relative">
                                <div className="absolute left-2 top-2 bottom-2 w-px bg-white/10" />

                                <div className="relative pl-6">
                                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-nyembo-sky bg-background z-10" />
                                    <p className="text-sm font-bold text-white">Beta Launch</p>
                                    <p className="text-xs text-muted-foreground">Nov 15, 2025</p>
                                </div>
                                <div className="relative pl-6 opacity-50">
                                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white/30 bg-background z-10" />
                                    <p className="text-sm font-bold text-white">Full Release</p>
                                    <p className="text-xs text-muted-foreground">Dec 01, 2025</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Insight Cards (Horizontal Scroll) */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white pl-1">Mission Insights</h3>
                <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="min-w-[300px] p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-nyembo-sky/30 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3 mb-3">
                                <Zap className="w-5 h-5 text-nyembo-yellow group-hover:text-white transition-colors" />
                                <span className="text-sm font-medium text-nyembo-sky">AI Efficiency</span>
                            </div>
                            <p className="text-lg font-bold text-white mb-1">AI agent deflected 73% of support chats this week.</p>
                            <p className="text-xs text-muted-foreground">Saved approx. 12 hours of human time.</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
