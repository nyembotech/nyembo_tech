"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface MotionCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: "lift" | "glow" | "scale";
}

export function MotionCard({ children, className, hoverEffect = "lift", ...props }: MotionCardProps) {
    const variants = {
        lift: {
            hover: { y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)" }
        },
        glow: {
            hover: { boxShadow: "0 0 20px rgba(53, 203, 248, 0.3)", borderColor: "rgba(53, 203, 248, 0.5)" }
        },
        scale: {
            hover: { scale: 1.02 }
        }
    };

    return (
        <motion.div
            whileHover="hover"
            initial="initial"
            variants={variants[hoverEffect]}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            {...props}
        >
            <Card className={cn("h-full", className)}>
                {children}
            </Card>
        </motion.div>
    );
}
