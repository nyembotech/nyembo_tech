"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, ArrowRight, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const tracks = {
    engineers: [
        {
            title: "AI Engineering Bootcamp",
            duration: "12 Weeks",
            level: "Advanced",
            format: "Hybrid",
            date: "Oct 15, 2025",
            desc: "Deep dive into LLMs, RAG architectures, and agentic workflows.",
        },
        {
            title: "Cloud Native DevOps",
            duration: "8 Weeks",
            level: "Intermediate",
            format: "Online",
            date: "Nov 01, 2025",
            desc: "Master Kubernetes, Terraform, and CI/CD pipelines for AI workloads.",
        },
        {
            title: "Data Engineering at Scale",
            duration: "10 Weeks",
            level: "Advanced",
            format: "Hybrid",
            date: "Jan 10, 2026",
            desc: "Building robust data lakes and streaming pipelines.",
        },
    ],
    business: [
        {
            title: "AI for Product Managers",
            duration: "4 Weeks",
            level: "Intermediate",
            format: "Online",
            date: "Oct 20, 2025",
            desc: "Learn to scope, manage, and deliver AI-powered products.",
        },
        {
            title: "Data Literacy for Teams",
            duration: "2 Weeks",
            level: "Beginner",
            format: "Online",
            date: "Nov 15, 2025",
            desc: "Understanding data fundamentals and decision making.",
        },
    ],
    leadership: [
        {
            title: "Executive AI Strategy",
            duration: "3 Days",
            level: "Executive",
            format: "In-Person",
            date: "Dec 05, 2025",
            desc: "Strategic implementation of AI for competitive advantage.",
        },
    ],
};

export default function AcademyPage() {
    return (
        <div className="min-h-screen pb-32 relative">
            {/* Hero */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-nyembo-gold/5 -z-10" />
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nyembo-gold/10 border border-nyembo-gold/20 text-nyembo-gold text-sm font-medium mb-6">
                        <GraduationCap className="w-4 h-4" />
                        Nyembotech Academy
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
                    >
                        Train your team for the <br />
                        <span className="text-nyembo-gold">AI era.</span>
                    </motion.h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        World-class curriculum designed by practitioners. Upskill your workforce with future-proof skills.
                    </p>
                </div>
            </section>

            {/* Tracks Tabs */}
            <section className="container mx-auto px-4">
                <Tabs defaultValue="engineers" className="space-y-12">
                    <div className="flex justify-center">
                        <TabsList className="bg-card/50 border border-white/10 p-1 h-auto rounded-full">
                            <TabsTrigger value="engineers" className="rounded-full px-6 py-3 data-[state=active]:bg-nyembo-gold data-[state=active]:text-black text-base">Engineers</TabsTrigger>
                            <TabsTrigger value="business" className="rounded-full px-6 py-3 data-[state=active]:bg-nyembo-gold data-[state=active]:text-black text-base">Business Teams</TabsTrigger>
                            <TabsTrigger value="leadership" className="rounded-full px-6 py-3 data-[state=active]:bg-nyembo-gold data-[state=active]:text-black text-base">Leadership</TabsTrigger>
                        </TabsList>
                    </div>

                    {Object.entries(tracks).map(([key, programs]) => (
                        <TabsContent key={key} value={key} className="space-y-8">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {programs.map((program, index) => (
                                    <Card key={index} className="bg-card/30 border-white/10 shadow-neumo hover:border-nyembo-gold/30 transition-all group h-full flex flex-col">
                                        <CardHeader>
                                            <div className="flex justify-between items-start mb-2">
                                                <Badge variant="outline" className="border-white/20 text-muted-foreground">{program.level}</Badge>
                                                <Badge className="bg-nyembo-gold/20 text-nyembo-gold hover:bg-nyembo-gold/30">{program.format}</Badge>
                                            </div>
                                            <CardTitle className="text-xl text-white group-hover:text-nyembo-gold transition-colors">{program.title}</CardTitle>
                                            <CardDescription className="line-clamp-2">{program.desc}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-1">
                                            <div className="space-y-2 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4" /> {program.duration}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" /> Starts {program.date}
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="w-full bg-white/5 text-white hover:bg-nyembo-gold hover:text-black transition-colors group/btn">
                                                View Syllabus <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </section>

            {/* Floating CTA Ribbon */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4">
                <div className="bg-nyembo-gold text-black p-4 rounded-2xl shadow-[0_0_30px_rgba(249,168,37,0.4)] flex items-center justify-between backdrop-blur-md bg-opacity-90 border border-white/20">
                    <div className="flex flex-col">
                        <span className="font-bold text-lg">Need custom training?</span>
                        <span className="text-sm opacity-80">We tailor programs for your team.</span>
                    </div>
                    <Button size="sm" className="bg-black text-white hover:bg-black/80">
                        Book a Call
                    </Button>
                </div>
            </div>
        </div>
    );
}
