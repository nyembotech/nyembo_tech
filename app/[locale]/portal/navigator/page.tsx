"use client";

import { useState } from "react";
import { NavigatorChat } from "@/components/navigator/chat-interface";
import { motion } from "framer-motion";
import { Sparkles, Map, Database, ArrowRight } from "lucide-react";

export default function NavigatorPage() {
    return (
        <div className="h-full flex flex-col space-y-6 pt-2">
            {/* Header / Context Panel */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-top-5 duration-700">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter flex items-center gap-3">
                        <Map className="w-8 h-8 text-nyembo-yellow" />
                        BUSINESS NAVIGATOR
                    </h1>
                    <p className="text-muted-foreground mt-1 max-w-xl">
                        AI-powered strategic guidance engine. Analyze markets, generate roadmaps, and architect solutions.
                    </p>
                </div>

                {/* Stats / Status Chips */}
                <div className="flex gap-3">
                    <StatusChip icon={<Database className="w-3 h-3 text-nyembo-sky" />} label="Knowledge Base: ONLINE" />
                    <StatusChip icon={<Sparkles className="w-3 h-3 text-nyembo-yellow" />} label="AI Model: V4.5 (PRO)" />
                </div>
            </div>

            {/* Main Console Area */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">

                {/* Left: History & Context (Collapsible on mobile) */}
                <div className="hidden lg:block lg:col-span-3 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                    <HistoryPanel />
                </div>

                {/* Center: Main Chat Interface */}
                <div className="lg:col-span-9 h-[65vh] lg:h-full relative group">
                    {/* Decorative glow behind the chat */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-nyembo-sky/20 to-nyembo-yellow/20 rounded-2xl opacity-50 blur-lg group-hover:opacity-75 transition duration-1000"></div>

                    <div className="relative h-full bg-[#0c131c] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                        <NavigatorChat />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusChip({ icon, label }: { icon: any, label: string }) {
    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-white/70 backdrop-blur-sm">
            {icon}
            <span>{label}</span>
        </div>
    );
}

function HistoryPanel() {
    return (
        <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-2 pl-1">Mission Logs</h3>

            {/* Mock History Items */}
            {[1, 2, 3].map((i) => (
                <motion.div
                    key={i}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 cursor-pointer transition-colors"
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-mono text-nyembo-sky">SESSION #{1000 + i}</span>
                        <span className="text-[10px] text-muted-foreground">2d ago</span>
                    </div>
                    <h4 className="font-bold text-white text-sm line-clamp-2">Market Entry Strategy for East African Logistics</h4>
                </motion.div>
            ))}

            <button className="w-full py-3 mt-4 border border-dashed border-white/20 rounded-xl text-sm text-muted-foreground hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-2 group">
                <Sparkles className="w-4 h-4 group-hover:text-nyembo-yellow transition-colors" />
                Start New Analysis
            </button>
        </div>
    )
}
