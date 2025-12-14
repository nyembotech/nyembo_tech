"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// In a real implementation, you would import the library:
// import { SpinePlayer as SpinePlayerLib } from "@esotericsoftware/spine-player";
// import "@esotericsoftware/spine-player/dist/spine-player.css";

interface SpinePlayerProps {
    jsonUrl?: string; // Path to .json skeleton
    atlasUrl?: string; // Path to .atlas
    animation?: string;
    loop?: boolean;
    className?: string;
    onEvent?: (name: string) => void;
    variant?: "console-orbit" | "smart-space" | "data-stream";
}

export function SpinePlayer({
    jsonUrl,
    atlasUrl,
    animation = "idle",
    loop = true,
    className,
    onEvent,
    variant
}: SpinePlayerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Logic to initialize Spine Player would go here.
        // For this demo, we simulate loading and render a specialized CSS animation 
        // that approximates the visual style requested in Prompt 9 until real assets exist.

        const timer = setTimeout(() => {
            setIsLoaded(true);
            // Simulate an event
            if (onEvent) onEvent("ready");
        }, 500);

        return () => clearTimeout(timer);
    }, [jsonUrl, atlasUrl, animation, onEvent]);

    return (
        <div ref={containerRef} className={cn("relative w-full h-full overflow-hidden", className)}>
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="w-8 h-8 border-2 border-nyembo-sky border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Fallback Visualization / Placeholder for the specific variants */}
            {isLoaded && (
                <div className="w-full h-full relative flex items-center justify-center">

                    {/* Abstract Orbiting Panels (Console Orbit) */}
                    {variant === "console-orbit" && (
                        <div className="relative w-[600px] h-[600px]">
                            {/* Core */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-nyembo-sky/10 rounded-full blur-xl animate-pulse" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-tr from-nyembo-sky to-emerald-400 rounded-full shadow-[0_0_50px_rgba(16,185,129,0.5)]" />

                            {/* Orbit Rings */}
                            <div className="absolute inset-0 border border-white/5 rounded-full animate-[spin_10s_linear_infinite]" />
                            <div className="absolute inset-[100px] border border-dashed border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

                            {/* Floating Cards (Simulating Spine bones) */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-32 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 p-2 animate-float-medium">
                                <div className="h-1 w-full bg-nyembo-sky/50 mb-2 rounded-full" />
                                <div className="h-1 w-2/3 bg-white/10 rounded-full" />
                            </div>

                            <div className="absolute bottom-20 right-20 w-40 h-24 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 p-2 animate-float-slow" style={{ animationDelay: '1s' }}>
                                <div className="flex gap-2 items-center mb-2">
                                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500" />
                                    <div className="text-[10px] text-emerald-500 font-mono">SYSTEM ACTIVE</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="h-0.5 w-full bg-white/10" />
                                    <div className="h-0.5 w-full bg-white/10" />
                                    <div className="h-0.5 w-3/4 bg-white/10" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Data Stream Variant */}
                    {variant === "data-stream" && (
                        <div className="w-full h-full bg-[linear-gradient(to_bottom,transparent_0%,rgba(56,189,248,0.1)_50%,transparent_100%)] bg-[length:100%_200%] animate-[slide_3s_linear_infinite]" />
                    )}

                </div>
            )}

            {/* Note for developer */}
            <div className="hidden">
                To integrate real Spine:
                1. npm install @esotericsoftware/spine-player
                2. new spine.SpinePlayer(containerRef.current, {"{"} jsonUrl: jsonUrl, atlasUrl: atlasUrl, ... {"}"})
            </div>
        </div>
    );
}
