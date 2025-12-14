"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export function CTARibbon() {
    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 1, type: "spring", stiffness: 100 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-auto"
        >
            <div className="bg-black/80 backdrop-blur-xl border border-nyembo-sky/30 rounded-full px-6 py-3 shadow-[0_10px_40px_rgba(53,203,248,0.2)] flex items-center justify-between gap-6 md:gap-12">
                <div className="hidden md:block">
                    <p className="text-white font-medium">Need a tailored curriculum?</p>
                </div>
                <div className="flex items-center gap-4">
                    <p className="text-white font-medium md:hidden">Custom Training?</p>
                    <Button className="rounded-full bg-nyembo-sky text-black hover:bg-nyembo-sky/90 font-bold shadow-[0_0_15px_rgba(53,203,248,0.4)]">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Book a Custom Training
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
