"use client";

import { Project, Customer } from "@/types/firestore";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { MoreHorizontal, Edit, Layers, Trash2, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Project3DCardProps {
    project: Project;
    customer?: Customer;
}

export function Project3DCard({ project, customer }: Project3DCardProps) {
    // Determine status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "in-progress": return "text-emerald-400 border-emerald-500/30 shadow-emerald-500/20";
            case "planning": return "text-blue-400 border-blue-500/30 shadow-blue-500/20";
            case "review": return "text-amber-400 border-amber-500/30 shadow-amber-500/20";
            case "completed": return "text-purple-400 border-purple-500/30 shadow-purple-500/20";
            default: return "text-gray-400 border-gray-500/30 shadow-gray-500/20";
        }
    };

    const statusStyle = getStatusColor(project.status);
    const progressColor = project.status === "in-progress" ? "bg-emerald-400" :
        project.status === "planning" ? "bg-blue-400" :
            project.status === "review" ? "bg-amber-400" : "bg-purple-400";

    return (
        <div className="group relative w-full h-full perspective-1000">
            {/* Main Card Surface */}
            <div className={cn(
                "relative w-full h-[220px] bg-[#121214] rounded-2xl p-6 transition-all duration-500 ease-out transform-style-3d group-hover:rotate-x-2 group-hover:translate-y-[-10px]",
                "border border-white/5 shadow-2xl shadow-black/50",
                "group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
            )}>
                {/* Neon Glow Border Effect */}
                <div className={cn(
                    "absolute inset-0 rounded-2xl border transition-all duration-500 opacity-0 group-hover:opacity-100",
                    statusStyle.split(" ")[1], // Border class
                    statusStyle.split(" ")[2]  // Shadow class
                )} />

                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                            {project.startDate ? new Date(project.startDate.seconds * 1000).toLocaleDateString() : "No Date"}
                        </p>
                        <h3 className="text-xl font-bold text-white group-hover:text-[#bef264] transition-colors">
                            {project.title}
                        </h3>
                        {customer && (
                            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                {customer.companyName || customer.name}
                            </p>
                        )}
                    </div>
                </div>

                {/* Progress Section */}
                <div className="mt-8">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-medium text-white">Progress</span>
                        <span className={cn("text-lg font-bold", statusStyle.split(" ")[0])}>
                            {project.progress}%
                        </span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className={cn("h-full rounded-full shadow-[0_0_10px_currentColor] transition-all duration-1000", progressColor)}
                            style={{ width: `${project.progress}%` }}
                        />
                    </div>
                    {/* Status Badge */}
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex -space-x-2">
                            {/* Fake avatars for "Team" */}
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#121214] bg-white/10 flex items-center justify-center text-[10px] text-white">
                                    U{i}
                                </div>
                            ))}
                        </div>
                        <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium border bg-white/5",
                            statusStyle.split(" ")[0], // Text color
                            statusStyle.split(" ")[1]  // Border color
                        )}>
                            {project.status.toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>

            {/* SUPER ACTIONS OVERLAY (Floats "above" the card on hover) */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-z-20 transform-style-3d flex gap-2">
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white/10 hover:bg-[#bef264] hover:text-black backdrop-blur-md shadow-[0_0_15px_rgba(190,242,100,0.3)]">
                    <Edit className="w-4 h-4" />
                </Button>
                <Link href={`/admin/projects/${project.id}`}>
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white/10 hover:bg-[#bef264] hover:text-black backdrop-blur-md shadow-[0_0_15px_rgba(190,242,100,0.3)]">
                        <Layers className="w-4 h-4" />
                    </Button>
                </Link>
            </div>

            {/* Glare/Shine Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
        </div>
    );
}
