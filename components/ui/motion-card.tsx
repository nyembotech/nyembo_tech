"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MotionCardProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    delay?: number;
    noLift?: boolean;
    glowBorder?: boolean;
}

export function MotionCard({
    children,
    className,
    delay = 0,
    noLift = false,
    glowBorder = false,
    ...props
}: MotionCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: delay,
                ease: [0.21, 0.47, 0.32, 0.98]
            }}
            className={cn(
                "glass-panel rounded-2xl p-6",
                !noLift && "hover-lift-neumo cursor-pointer",
                glowBorder && "border-pulse-primary",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
