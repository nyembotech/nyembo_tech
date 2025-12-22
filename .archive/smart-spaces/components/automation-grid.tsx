"use client";

import { motion } from "framer-motion";
import { Lock, Thermometer, Zap, Bot, Eye } from "lucide-react";

export function AutomationGrid() {
    const features = [
        {
            icon: Lock,
            title: "Access Control",
            description: "Biometric entry and smart locks managed from the cloud.",
            color: "text-nyembo-sky",
            bg: "bg-nyembo-sky/10",
            border: "hover:border-nyembo-sky/50"
        },
        {
            icon: Eye,
            title: "Security",
            description: "AI-powered surveillance that detects anomalies instantly.",
            color: "text-red-400",
            bg: "bg-red-500/10",
            border: "hover:border-red-500/50"
        },
        {
            icon: Thermometer,
            title: "Climate",
            description: "Adaptive HVAC that learns occupancy patterns.",
            color: "text-orange-400",
            bg: "bg-orange-500/10",
            border: "hover:border-orange-500/50"
        },
        {
            icon: Zap,
            title: "Energy",
            description: "Automated power optimization to reduce footprint.",
            color: "text-yellow-400",
            bg: "bg-yellow-500/10",
            border: "hover:border-yellow-500/50"
        },
        {
            icon: Bot,
            title: "AI Concierge",
            description: "Voice-activated assistance for every room.",
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            border: "hover:border-purple-500/50"
        }
    ];

    return (
        <section className="py-24 bg-black/50">
            <div className="container px-4">
                <div className="mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">What we automate</h2>
                    <div className="w-24 h-1 bg-nyembo-sky rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className={`p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 ${feature.border}`}
                        >
                            <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6`}>
                                <feature.icon className={`w-7 h-7 ${feature.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
