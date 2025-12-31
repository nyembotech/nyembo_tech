"use client";

import { useState, useRef, useEffect } from "react";
import { useChatAgent, type Message, getMessageContent } from "@/hooks/use-chat-agent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AgentChatWidgetProps {
    agentType: "sales" | "support";
    projectId?: string;
    language?: string;
}

export function AgentChatWidget({ agentType, projectId, language = "en" }: AgentChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { messages, input, handleInputChange, handleSubmit, isLoading, isReady, sendMessage } = useChatAgent({ agentType, projectId, language });
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    if (!isReady) return null; // Don't show if not ready (e.g. support agent for unauth user)

    const isSupport = agentType === "support";
    const agentName = isSupport ? "Nyembo Support" : "Nyembo Guide";
    const themeColor = isSupport ? "bg-nyembo-blue" : "bg-nyembo-gold";
    const textColor = isSupport ? "text-nyembo-blue" : "text-nyembo-gold";

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 w-[350px] md:w-[400px] shadow-2xl"
                    >
                        <Card className="border-white/10 bg-black/80 backdrop-blur-xl backdrop-saturate-150 overflow-hidden flex flex-col h-[500px]">
                            <CardHeader className={cn("p-4 border-b border-white/10 flex flex-row items-center justify-between sticky top-0 bg-black/40 backdrop-blur-md z-10")}>
                                <div className="flex items-center gap-3">
                                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", isSupport ? "bg-blue-500/20 text-blue-400" : "bg-yellow-500/20 text-yellow-400")}>
                                        <Bot className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-sm font-bold text-white">{agentName}</CardTitle>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Online
                                        </p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white" onClick={() => setIsOpen(false)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </CardHeader>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={scrollRef}>
                                {messages.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Sparkles className={cn("w-8 h-8 mx-auto mb-3 opacity-50", textColor)} />
                                        <p className="text-sm">Hello! I'm {agentName}.</p>
                                        <p className="text-xs mt-1">How can I help you today?</p>

                                        <div className="mt-6 flex flex-col gap-2 px-4">
                                            {(isSupport ? [
                                                "I need to open a ticket",
                                                "Check my ticket status",
                                                "I found a bug"
                                            ] : [
                                                "Tell me about our services",
                                                "How much does a project cost?",
                                                "Show me case studies"
                                            ]).map((action) => (
                                                <Button
                                                    key={action}
                                                    variant="outline"
                                                    className="w-full justify-start text-xs h-auto py-2 bg-white/5 border-white/10 hover:bg-white/10 text-left whitespace-normal"
                                                    onClick={() => {
                                                        sendMessage(action);
                                                    }}
                                                >
                                                    {action}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {messages.map((m: Message) => (
                                    <div key={m.id} className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}>
                                        {m.role === "assistant" && (
                                            <div className={cn("w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-1", isSupport ? "bg-blue-500/20 text-blue-400" : "bg-yellow-500/20 text-yellow-400")}>
                                                <Bot className="w-3 h-3" />
                                            </div>
                                        )}

                                        <div className={cn(
                                            "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                                            m.role === "user"
                                                ? "bg-nyembo-sky/20 text-white rounded-br-none border border-nyembo-sky/30"
                                                : "bg-white/5 text-gray-200 rounded-bl-none border border-white/10"
                                        )}>
                                            {getMessageContent(m)}
                                        </div>

                                        {m.role === "user" && (
                                            <div className="w-6 h-6 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center mt-1 text-white">
                                                <User className="w-3 h-3" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-3 justify-start">
                                        <div className={cn("w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center", isSupport ? "bg-blue-500/20 text-blue-400" : "bg-yellow-500/20 text-yellow-400")}>
                                            <Bot className="w-3 h-3" />
                                        </div>
                                        <div className="bg-white/5 rounded-2xl rounded-bl-none px-4 py-2 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" />
                                            <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-md">
                                <form onSubmit={handleSubmit} className="flex gap-2">
                                    <Input
                                        value={input}
                                        onChange={handleInputChange}
                                        placeholder={isSupport ? "Describe your issue..." : "Ask about our services..."}
                                        className="bg-white/5 border-white/10 focus-visible:ring-nyembo-sky/50"
                                    />
                                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className={cn(isSupport ? "bg-blue-600 hover:bg-blue-700" : "bg-nyembo-gold hover:bg-yellow-500 text-black")}>
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </form>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "h-14 w-14 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/20 transition-all duration-300",
                        isOpen ? "bg-red-500/80 hover:bg-red-600 rotate-90" : (isSupport ? "bg-blue-600/80 hover:bg-blue-500" : "bg-nyembo-gold/80 hover:bg-yellow-500 text-black")
                    )}
                >
                    {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
                </Button>
            </motion.div>
        </div>
    );
}
