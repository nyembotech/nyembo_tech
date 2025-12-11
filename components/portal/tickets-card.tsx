"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LifeBuoy, ArrowRight } from "lucide-react";
import { Ticket } from "@/hooks/use-portal-data";

interface TicketsCardProps {
    tickets: Ticket[];
    openCount: number;
}

export function TicketsCard({ tickets, openCount }: TicketsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <Card className="h-full bg-card/40 border-white/10 backdrop-blur-md shadow-neumo hover:border-nyembo-red/30 transition-all group">
                <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-nyembo-red/10 flex items-center justify-center mb-4 group-hover:bg-nyembo-red group-hover:text-white transition-colors text-nyembo-red">
                        <LifeBuoy className="w-6 h-6" />
                    </div>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl text-white">Support Tickets</CardTitle>
                        <span className="text-2xl font-bold text-white">{openCount}</span>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {tickets.map((ticket) => (
                            <div key={ticket.id} className="flex items-center justify-between text-sm p-2 rounded hover:bg-white/5 transition-colors cursor-pointer">
                                <span className="text-muted-foreground">{ticket.id} - {ticket.title}</span>
                                <Badge
                                    variant="outline"
                                    className={
                                        ticket.status === "In Progress" ? "border-nyembo-gold text-nyembo-gold" :
                                            ticket.status === "Resolved" ? "border-green-500 text-green-500" :
                                                "border-white/30 text-white"
                                    }
                                >
                                    {ticket.status}
                                </Badge>
                            </div>
                        ))}
                        <Button variant="ghost" className="w-full text-nyembo-sky hover:text-white hover:bg-white/5 justify-between group/btn mt-2">
                            Open new ticket <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
