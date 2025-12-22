"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Thermometer, Sun, Shield } from "lucide-react";

export function InteractiveGallery() {
    return (
        <section className="py-24 bg-gradient-to-b from-black to-gray-900 overflow-hidden">
            <div className="container px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Total Control</h2>
                    <p className="text-muted-foreground">Interact with your building's nervous system.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <TemperatureCard />
                    <LightingCard />
                    <SecurityCard />
                </div>
            </div>
        </section>
    );
}

function TemperatureCard() {
    const [temp, setTemp] = useState(24);

    return (
        <div className="bg-gray-900/50 rounded-[2.5rem] p-8 border border-white/5 backdrop-blur-xl relative overflow-hidden group hover:border-orange-500/30 transition-colors h-[400px] flex flex-col items-center justify-between shadow-2xl">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-orange-500/10 to-transparent opacity-50" />

            <div className="flex items-center gap-2 text-orange-400 font-medium">
                <Thermometer className="w-5 h-5" />
                <span>Climate</span>
            </div>

            {/* Simulated Knob */}
            <div className="relative w-48 h-48 rounded-full bg-black shadow-[inset_0_4px_20px_rgba(0,0,0,0.8),0_10px_40px_rgba(249,115,22,0.1)] flex items-center justify-center border border-white/5">
                <div className="absolute inset-0 rounded-full border border-white/5" />
                <div className="text-5xl font-black text-white">{temp}°</div>
                <div className="absolute bottom-8 text-xs text-white/30 uppercase tracking-widest">Celsius</div>

                {/* Interactive Ring (Visual Only for demo) */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="96" cy="96" r="88" fill="none" stroke="#333" strokeWidth="4" />
                    <circle cx="96" cy="96" r="88" fill="none" stroke="#F97316" strokeWidth="4" strokeDasharray="552" strokeDashoffset={552 - (552 * (temp / 40))} className="transition-all duration-500" strokeLinecap="round" />
                </svg>
            </div>

            <div className="flex gap-4 w-full px-4">
                <button onClick={() => setTemp(Math.max(16, temp - 1))} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors">-</button>
                <button onClick={() => setTemp(Math.min(32, temp + 1))} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors">+</button>
            </div>
        </div>
    );
}

function LightingCard() {
    const [intensity, setIntensity] = useState(75);

    return (
        <div className="bg-gray-900/50 rounded-[2.5rem] p-8 border border-white/5 backdrop-blur-xl relative overflow-hidden group hover:border-yellow-500/30 transition-colors h-[400px] flex flex-col items-center justify-between shadow-2xl">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-yellow-500/10 to-transparent opacity-50" />

            <div className="flex items-center gap-2 text-yellow-400 font-medium">
                <Sun className="w-5 h-5" />
                <span>Lighting</span>
            </div>

            {/* Slider Visual */}
            <div className="relative h-48 w-24 bg-black rounded-3xl border border-white/5 p-2 shadow-[inset_0_4px_20px_rgba(0,0,0,0.8)] overflow-hidden">
                <div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-yellow-500/40 to-yellow-200/40 transition-all duration-300"
                    style={{ height: `${intensity}%` }}
                />
                <div className="relative h-full w-full rounded-2xl border border-white/5 flex flex-col justify-between py-4 items-center z-10">
                    <div className="w-1 h-32 bg-white/10 rounded-full relative">
                        <motion.div
                            className="absolute w-8 h-8 -left-3.5 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,0,0.5)] cursor-grab active:cursor-grabbing"
                            style={{ bottom: `${intensity}%` }}
                            drag="y"
                            dragConstraints={{ top: -120, bottom: 0 }}
                            onDrag={(event, info) => {
                                // Simplified drag logic simulation
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{intensity}%</div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={intensity}
                    onChange={(e) => setIntensity(parseInt(e.target.value))}
                    className="w-full accent-yellow-500 h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                />
            </div>
        </div>
    );
}

function SecurityCard() {
    const [locked, setLocked] = useState(true);

    return (
        <div className="bg-gray-900/50 rounded-[2.5rem] p-8 border border-white/5 backdrop-blur-xl relative overflow-hidden group hover:border-nyembo-sky/30 transition-colors h-[400px] flex flex-col items-center justify-between shadow-2xl">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-nyembo-sky/10 to-transparent opacity-50" />

            <div className="flex items-center gap-2 text-nyembo-sky font-medium">
                <Shield className="w-5 h-5" />
                <span>Security</span>
            </div>

            {/* 3D Toggle Switch */}
            <div
                className="cursor-pointer"
                onClick={() => setLocked(!locked)}
            >
                <motion.div
                    className={`w-32 h-56 rounded-full border-4 ${locked ? 'border-nyembo-sky bg-nyembo-sky/5' : 'border-gray-600 bg-black'} relative p-2 shadow-2xl transition-colors duration-500`}
                >
                    <motion.div
                        className={`w-26 h-26 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-center text-white font-bold backdrop-blur-md border border-white/10 ${locked ? 'bg-nyembo-sky' : 'bg-gray-700'}`}
                        animate={{ y: locked ? 0 : 120 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        {locked ? <LockIcon className="w-8 h-8" /> : <UnlockIcon className="w-8 h-8 text-gray-400" />}
                    </motion.div>
                </motion.div>
            </div>

            <div className="text-xl font-bold text-white tracking-widest uppercase">
                {locked ? "ARMED" : "DISARMED"}
            </div>
        </div>
    );
}

function LockIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
    )
}

function UnlockIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
        </svg>
    )
}
