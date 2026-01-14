"use client";

import { motion } from "framer-motion";

interface HeroPanelProps {
    customerName: string;
}

export function HeroPanel({ customerName }: HeroPanelProps) {
    return (
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0b121f] to-[#1a1f35] border border-white/10 p-8 lg:p-12 shadow-2xl">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-gray-400 font-medium text-sm tracking-wider uppercase mb-2">
                        Control Room
                    </h2>
                    <h1 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 mb-6">
                        Welcome back, {customerName}.
                    </h1>
                    <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">
                        Here is an overview of your digital ecosystem. Track projects, monitor support tickets, and view real-time insights all in one place.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
