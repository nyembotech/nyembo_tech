"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface HeroPanelProps {
    customerName: string;
}

export function HeroPanel({ customerName }: HeroPanelProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-3xl overflow-hidden p-10 md:p-16 border border-white/10 shadow-2xl"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-nyembo-sky/10 via-transparent to-nyembo-yellow/5" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-nyembo-sky/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

            <div className="relative z-10 max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                    Welcome back, <span className="text-nyembo-sky">{customerName}</span>.
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
    );
}
