"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

export function AcademyHero() {
    return (
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-black">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-purple-900/20 to-transparent rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-nyembo-sky/10 to-transparent rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-10 bg-repeat" />
            </div>

            <div className="container relative z-10 px-4 text-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-nyembo-sky text-sm font-medium mb-8"
                >
                    <GraduationCap className="w-4 h-4" />
                    <span>Nyembotech Academy</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6"
                >
                    Train your team for the <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-nyembo-sky to-purple-500">AI Era.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-muted-foreground max-w-2xl mx-auto"
                >
                    World-class curriculum designed by engineers, for engineers. And everyone else.
                </motion.p>
            </div>
        </section>
    );
}
