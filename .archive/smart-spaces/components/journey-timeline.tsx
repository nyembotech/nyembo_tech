"use client";

import { motion } from "framer-motion";

export function JourneyTimeline() {
    const steps = [
        { number: "01", title: "Survey", desc: "We map your physical space using LiDAR." },
        { number: "02", title: "Design", desc: "Architecting the sensor network." },
        { number: "03", title: "Install", desc: "Non-intrusive hardware deployment." },
        { number: "04", title: "Configure", desc: "Customizing the AI parameters." },
        { number: "05", title: "Monitor", desc: "24/7 optimization and updates." }
    ];

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container px-4 relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-16 text-center">Project Journey</h2>

                <div className="relative">
                    {/* Connecting Line */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent hidden lg:block -translate-y-1/2" />

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-4">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                                className="relative flex flex-col items-center text-center group"
                            >
                                <div className="w-16 h-16 rounded-full bg-black border-2 border-white/20 flex items-center justify-center text-xl font-mono font-bold text-white mb-6 relative z-10 group-hover:border-nyembo-sky group-hover:bg-nyembo-sky/10 transition-colors shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                                    {step.number}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                                <p className="text-sm text-muted-foreground px-4">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
