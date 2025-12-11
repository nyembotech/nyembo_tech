"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flag } from "lucide-react";
import { Milestone } from "@/hooks/use-portal-data";

interface MilestonesCardProps {
    milestones: Milestone[];
}

export function MilestonesCard({ milestones }: MilestonesCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <Card className="h-full bg-card/40 border-white/10 backdrop-blur-md shadow-neumo hover:border-nyembo-gold/30 transition-all group">
                <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-nyembo-gold/10 flex items-center justify-center mb-4 group-hover:bg-nyembo-gold group-hover:text-black transition-colors text-nyembo-gold">
                        <Flag className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl text-white">Upcoming Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 relative">
                        <div className="absolute left-2 top-2 bottom-2 w-px bg-white/10" />

                        {milestones.map((milestone) => (
                            <div key={milestone.id} className={`relative pl-6 ${milestone.isCompleted ? "" : "opacity-50"}`}>
                                <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 bg-background z-10 ${milestone.isCompleted ? "border-nyembo-sky" : "border-white/30"}`} />
                                <p className="text-sm font-bold text-white">{milestone.title}</p>
                                <p className="text-xs text-muted-foreground">{milestone.date}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
