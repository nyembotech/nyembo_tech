"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export function SmartSpacesHero() {
    return (
        <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-black z-0">
                <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-20 mix-blend-screen" />
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-nyembo-sky/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <div className="container relative z-10 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-6">
                        Living <span className="text-transparent bg-clip-text bg-gradient-to-r from-nyembo-sky to-blue-500">Systems</span>.
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 font-light">
                        Turn your building into an intelligent organism that adapts to your needs in real-time.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2"
                >
                    <span className="text-xs uppercase tracking-widest">Scroll to Explore</span>
                    <ArrowDown className="w-4 h-4 animate-bounce" />
                </motion.div>
            </div>
        </section>
    );
}
