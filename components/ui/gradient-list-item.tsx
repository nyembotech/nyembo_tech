import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GradientListItemProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "green" | "orange" | "purple" | "blue";
    children: React.ReactNode;
}

export function GradientListItem({ variant = "green", className, children, ...props }: GradientListItemProps) {
    const variantClasses = {
        green: "neon-green [--neon-color-alpha:rgba(16,185,129,0.1)]",
        orange: "neon-orange [--neon-color-alpha:rgba(245,158,11,0.1)]",
        purple: "neon-purple [--neon-color-alpha:rgba(217,70,239,0.1)]",
        blue: "neon-green [--neon-color:#3b82f6] [--neon-color-alpha:rgba(59,130,246,0.1)]" // quick override for blue
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
                "neon-list-item p-4 rounded-r-xl cursor-pointer group flex items-center justify-between",
                "border-b border-white/5 last:border-0",
                variantClasses[variant],
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
