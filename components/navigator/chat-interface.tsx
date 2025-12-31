"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2, Sparkles, Plus, Paperclip } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
};

export function NavigatorChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Systems Online. I am the Business Navigator. I can help you analyze market opportunities, draft implementation roadmaps, or architect technical solutions. What is your mission today?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        // Simulate AI Response (replace with real API later)
        setTimeout(() => {
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "I've analyzed the parameters. Based on current market data in East Africa, a logistics platform focusing on last-mile delivery automation would yield the highest immediate ROI. Would you like me to generate a 30-day implementation plan?",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsLoading(false);
        }, 1500);
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-full bg-[#0b0f17]">

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar" ref={scrollRef}>
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex gap-4 max-w-3xl",
                                msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                            )}
                        >
                            {/* Avatar */}
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg border",
                                msg.role === "assistant"
                                    ? "bg-gradient-to-br from-nyembo-yellow to-orange-500 border-nyembo-yellow/50 text-black"
                                    : "bg-white/10 border-white/20 text-white"
                            )}>
                                {msg.role === "assistant" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                            </div>

                            {/* Bubble */}
                            <div className={cn(
                                "p-4 rounded-2xl shadow-sm text-sm leading-relaxed relative group",
                                msg.role === "assistant"
                                    ? "bg-[#182030] border border-white/10 text-gray-100 rounded-tl-none"
                                    : "bg-nyembo-sky text-black rounded-tr-none font-medium"
                            )}>
                                {msg.content}
                                <div className="text-[10px] opacity-50 mt-2 font-mono text-right">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 max-w-3xl">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nyembo-yellow to-orange-500 border-nyembo-yellow/50 text-black flex items-center justify-center shrink-0">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div className="bg-[#182030] border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-nyembo-sky" />
                            <span className="text-xs text-muted-foreground animate-pulse">Processing data streams...</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#080b11] border-t border-white/10">
                <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto flex gap-3">
                    <Button type="button" size="icon" variant="ghost" className="text-muted-foreground hover:text-white">
                        <Plus className="w-5 h-5" />
                    </Button>

                    <div className="relative flex-1">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask Navigator to analyze, plan, or architect..."
                            className="w-full bg-[#131b29] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-nyembo-sky/50 focus:ring-1 focus:ring-nyembo-sky/50 placeholder:text-muted-foreground transition-all"
                        />
                        <div className="absolute right-2 top-2">
                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-muted-foreground hover:text-white"
                            >
                                <Paperclip className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className={cn(
                            "bg-nyembo-yellow text-black hover:bg-nyembo-gold font-bold transition-all shadow-[0_0_15px_rgba(246,227,15,0.2)] hover:shadow-[0_0_20px_rgba(246,227,15,0.4)]",
                            isLoading && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </Button>
                </form>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-muted-foreground">
                        Nyembotech AI can make mistakes. Consider checking important information.
                    </p>
                </div>
            </div>
        </div>
    );
}

