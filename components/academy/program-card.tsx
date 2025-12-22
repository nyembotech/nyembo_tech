"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LemonBuyButton } from "@/components/lemon-buy-button";
import { Calendar, Clock, Layers, ArrowRight } from "lucide-react";
import { Program } from "@/hooks/use-academy-data";

interface ProgramCardProps {
    program: Program;
    index: number;
    onBook: (program: Program) => void;
}

export function ProgramCard({ program, index, onBook }: ProgramCardProps) {
    const levelColors = {
        Beginner: "bg-green-500/10 text-green-500 border-green-500/20",
        Intermediate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        Advanced: "bg-red-500/10 text-red-500 border-red-500/20",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="h-full"
        >
            <Card className="h-full bg-white/5 border-white/10 hover:border-nyembo-sky/50 transition-all duration-300 group flex flex-col justify-between backdrop-blur-sm shadow-lg hover:shadow-[0_10px_30px_rgba(53,203,248,0.1)]">
                <div>
                    <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline" className={`border ${levelColors[program.level]}`}>
                                {program.level}
                            </Badge>
                            <Badge variant="secondary" className="bg-white/10 text-white">
                                {program.format}
                            </Badge>
                        </div>
                        <CardTitle className="text-xl font-bold text-white group-hover:text-nyembo-sky transition-colors">
                            {program.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {program.description}
                        </p>

                        <div className="flex flex-col gap-2 pt-2">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Clock className="w-4 h-4 text-nyembo-sky/80" />
                                <span>{program.duration}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Calendar className="w-4 h-4 text-nyembo-sky/80" />
                                <span>Starting {program.nextDate}</span>
                            </div>
                        </div>
                    </CardContent>
                </div>

                <CardFooter className="pt-2 gap-3">
                    <LemonBuyButton
                        storeId={process.env.NEXT_PUBLIC_LEMON_STORE_ID || "11111"} // Placeholder
                        variantId={"22222"} // Placeholder variant
                        label="Join Program"
                        className="flex-1 bg-nyembo-sky text-black hover:bg-nyembo-sky/80 font-bold tracking-tight"
                    />
                    <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white px-3">
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
