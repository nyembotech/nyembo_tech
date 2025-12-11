"use client";

import { SpinePlayer } from "@/components/ui/spine-player";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Bot, Cloud, Zap } from "lucide-react";

interface HeroSpineSceneProps {
    variant?: "console-orbit" | "smart-space" | "data-stream";
}

export function HeroSpineScene({ variant = "console-orbit" }: HeroSpineSceneProps) {
    return (
        <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center perspective-1000">
            {/* Spine Animation Layer (Background) */}
            <div className="absolute inset-0 z-0 opacity-80">
                <SpinePlayer
                    jsonUrl="/assets/spine/hero-orbit.json"
                    atlasUrl="/assets/spine/hero-orbit.atlas"
                    animation="orbit"
                    variant={variant}
                    className="w-full h-full"
                />
            </div>

            {/* Layered Static UI Cards (Foreground) */}
            <div className="relative z-10 w-full max-w-md aspect-square">
                {/* Floating AI Card */}
                <motion.div
                    initial={{ opacity: 0, x: -50, y: 50 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="absolute top-1/4 left-0 md:-left-12"
                >
                    <Card className="w-48 bg-card/60 backdrop-blur-md border-nyembo-sky/30 shadow-neumo p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-nyembo-sky/20 flex items-center justify-center text-nyembo-sky">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white">AI Agent</div>
                            <div className="text-xs text-green-400">Active</div>
                        </div>
                    </Card>
                </motion.div>

                {/* Floating Cloud Card */}
                <motion.div
                    initial={{ opacity: 0, x: 50, y: -50 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="absolute bottom-1/4 right-0 md:-right-12"
                >
                    <Card className="w-48 bg-card/60 backdrop-blur-md border-nyembo-yellow/30 shadow-neumo p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-nyembo-yellow/20 flex items-center justify-center text-nyembo-yellow">
                            <Cloud className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white">Cloud Sync</div>
                            <div className="text-xs text-muted-foreground">Optimized</div>
                        </div>
                    </Card>
                </motion.div>

                {/* Central Focus (Optional, maybe the logo or main graphic) */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border border-white/5 rounded-full border-dashed pointer-events-none"
                />
            </div>
        </div>
    );
}
