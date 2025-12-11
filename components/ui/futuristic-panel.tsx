"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, HTMLMotionProps } from "framer-motion";
import { ArrowRight, LucideIcon } from "lucide-react";

const panelVariants = cva(
    "relative overflow-hidden rounded-3xl transition-all duration-300 group",
    {
        variants: {
            variant: {
                primary: "bg-card border border-nyembo-sky/30 shadow-neumo hover:shadow-[0_0_20px_rgba(53,203,248,0.2)]",
                accent: "bg-gradient-to-br from-card to-nyembo-yellow/10 border border-nyembo-yellow/30 shadow-[0_0_15px_rgba(246,227,15,0.1)] hover:shadow-[0_0_25px_rgba(246,227,15,0.3)]",
                ghost: "bg-transparent border border-white/10 backdrop-blur-md hover:bg-white/5",
            },
        },
        defaultVariants: {
            variant: "primary",
        },
    }
);

interface FuturisticPanelProps extends HTMLMotionProps<"div">, VariantProps<typeof panelVariants> {
    title: string;
    subtitle: string;
    icon: LucideIcon;
    ctaLabel?: string;
    onCtaClick?: () => void;
}

export function FuturisticPanel({
    className,
    variant,
    title,
    subtitle,
    icon: Icon,
    ctaLabel = "Learn more",
    onCtaClick,
    ...props
}: FuturisticPanelProps) {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className={cn(panelVariants({ variant }), className)}
            {...props}
        >
            {/* Decorative Corner Cut (simulated with pseudo-element or just border radius for now) */}
            {/* Top Highlight */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

            <div className="p-8 flex flex-col h-full">
                <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors",
                    variant === "accent" ? "bg-nyembo-yellow text-black" : "bg-nyembo-sky/10 text-nyembo-sky group-hover:bg-nyembo-sky group-hover:text-black"
                )}>
                    <Icon className="w-7 h-7" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{title}</h3>
                <p className="text-muted-foreground mb-8 flex-grow leading-relaxed">{subtitle}</p>

                <div
                    className="flex items-center text-sm font-bold uppercase tracking-wider cursor-pointer group/cta"
                    onClick={onCtaClick}
                >
                    <span className={cn(
                        "mr-2 transition-colors",
                        variant === "accent" ? "text-nyembo-yellow" : "text-nyembo-sky group-hover:text-white"
                    )}>
                        {ctaLabel}
                    </span>
                    <ArrowRight className={cn(
                        "w-4 h-4 transition-transform group-hover/cta:translate-x-1",
                        variant === "accent" ? "text-nyembo-yellow" : "text-nyembo-sky group-hover:text-white"
                    )} />
                </div>
            </div>

            {/* Bottom Glow */}
            <div className={cn(
                "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity",
                variant === "accent" ? "text-nyembo-yellow" : "text-nyembo-sky"
            )} />
        </motion.div>
    );
}
