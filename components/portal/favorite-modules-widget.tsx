"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Settings, LogIn, ArrowRight, Shield, Zap, X, Heart } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const modules = [
    {
        id: "community",
        title: "Community",
        icon: Heart,
        iconColor: "text-yellow-400",
        description: "A private space for your teams and NyemboTech squads to plan, learn and ship together.",
        modalTitle: "Community Hub",
        modalGraphic: Users,
    },
    {
        id: "automation",
        title: "Automation",
        icon: Settings, // "Gear"
        iconColor: "text-cyan-400",
        description: "Design, monitor and tune your AI workflows – from support bots to back-office pipelines.",
        modalTitle: "Automation Cockpit",
        modalGraphic: Zap,
    },
    {
        id: "portal",
        title: "Portal",
        icon: LogIn,
        iconColor: "text-white",
        description: "One login for proposals, roadmaps, releases and invoices.",
        modalTitle: "Client Portal",
        modalGraphic: Shield,
    },
    {
        id: "projects",
        title: "Projects",
        icon: ArrowRight,
        iconColor: "text-yellow-400", // Kanban-like
        description: "See every NyemboTech engagement, phase and milestone in one timeline.",
        modalTitle: "Projects Board",
        modalGraphic: ArrowRight,
    },
];

export function FavoriteModulesWidget() {
    const [selectedModule, setSelectedModule] = useState<typeof modules[0] | null>(null);

    return (
        <div className="bg-[#0b121f]/50 backdrop-blur-md border border-white/10 rounded-3xl p-6">
            <h3 className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6">
                Favorite Modules
            </h3>

            <div className="grid grid-cols-2 gap-4">
                {modules.map((mod) => (
                    <motion.button
                        key={mod.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedModule(mod)}
                        className="aspect-square rounded-2xl bg-[#1c2230] border border-white/5 hover:border-white/20 hover:bg-[#252b3b] transition-all flex flex-col items-center justify-center gap-3 group relative overflow-hidden"
                    >
                        {/* Hover Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <mod.icon
                            className={cn("w-8 h-8 transition-transform group-hover:scale-110", mod.iconColor)}
                            strokeWidth={1.5}
                        />
                        <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                            {mod.title}
                        </span>
                    </motion.button>
                ))}
            </div>

            {/* Info Modal */}
            <AnimatePresence>
                {selectedModule && (
                    <Dialog open={!!selectedModule} onOpenChange={(open) => !open && setSelectedModule(null)}>
                        <DialogContent className="bg-[#0b121f] border-white/10 text-white sm:max-w-md">
                            <div className="relative overflow-hidden pt-8 px-6 pb-6">
                                {/* Graphic Header */}
                                <div className="flex justify-center mb-6">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-white/10 to-transparent flex items-center justify-center relative">
                                        <div className="absolute inset-0 bg-nyembo-sky/20 blur-xl rounded-full" />
                                        <selectedModule.modalGraphic className={cn("w-10 h-10 relative z-10", selectedModule.iconColor)} />
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-center mb-2">{selectedModule.modalTitle}</h2>
                                <p className="text-center text-gray-400 mb-8 leading-relaxed">
                                    {selectedModule.description}
                                </p>

                                <button
                                    onClick={() => setSelectedModule(null)}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20"
                                >
                                    Launch Module
                                </button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </AnimatePresence>
        </div>
    );
}
