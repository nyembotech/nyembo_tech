"use client";

import { motion } from "framer-motion";
import { SpinePlayer } from "@/components/ui/spine-player";
import { MotionCard } from "@/components/ui/motion-card";
import { Terminal, Cpu, Network } from "lucide-react";

export function HeroSpineScene() {
    return (
        <div className="relative w-full h-[600px] md:h-[800px] flex items-center justify-center overflow-hidden">

            {/* Background Spine Layer */}
            <div className="absolute inset-0 z-0">
                <SpinePlayer variant="console-orbit" className="opacity-80" />
            </div>

            {/* Foreground Glass UI Layers (Parallax/Depth) */}
            <div className="relative z-10 w-full max-w-6xl h-full pointer-events-none">

                {/* Top Left Card - Floating */}
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="absolute top-1/4 left-10 md:left-20 pointer-events-auto"
                >
                    <MotionCard className="w-64 backdrop-blur-md bg-[#0c0c0e]/90 border-white/20 shadow-2xl" glowBorder>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-nyembo-sky/20 border border-nyembo-sky/30">
                                <Cpu className="w-5 h-5 text-nyembo-sky" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-nyembo-sky uppercase tracking-wider mb-0.5">AI Core</div>
                                <div className="text-lg font-bold text-white tracking-tight">System Online</div>
                            </div>
                        </div>
                        <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-nyembo-sky to-white"
                                initial={{ width: "0%" }}
                                animate={{ width: "85%" }}
                                transition={{ delay: 1, duration: 2 }}
                            />
                            <div className="absolute top-0 right-0 h-full w-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
                        </div>
                    </MotionCard>
                </motion.div>

                {/* Bottom Right Card - Floating */}
                <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="absolute bottom-1/4 right-10 md:right-20 pointer-events-auto"
                >
                    <MotionCard className="w-72 backdrop-blur-md bg-[#0c0c0e]/90 border-white/20 shadow-2xl" delay={0.2}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                                <Network className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-0.5">Network Latency</div>
                                <div className="text-lg font-bold text-white tracking-tight">12ms (Optimized)</div>
                            </div>
                        </div>
                        <div className="flex justify-between items-end h-16 pb-2 border-b border-dashed border-white/10">
                            {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
                                <motion.div
                                    key={i}
                                    className="w-2 bg-gradient-to-t from-purple-500/20 to-purple-400 rounded-t-sm"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: 1 + (i * 0.1), duration: 0.5 }}
                                />
                            ))}
                        </div>
                    </MotionCard>
                </motion.div>

                {/* Center Console Output */}
                <motion.div
                    className="absolute top-1/3 right-1/4 hidden lg:block pointer-events-none"
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                    <div className="font-mono text-xs text-nyembo-sky space-y-1 p-4 rounded-lg bg-[#0c0c0e]/90 border border-white/10 backdrop-blur-md shadow-xl">
                        <div>{">"} INITIALIZING NEURAL LINK...</div>
                        <div>{">"} ESTABLISHING SECURE HANDSHAKE</div>
                        <div>{">"} PROTOCOL V.9.2 ACCEPTED</div>
                        <div>{">"} STREAMING DATA...</div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
