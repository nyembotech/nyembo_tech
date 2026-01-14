"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Loader2, Sparkles, Plus, Paperclip, Volume2, VolumeX, ArrowRight, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useChatAgent, getMessageContent, type Message } from "@/hooks/use-chat-agent";
import Link from "next/link";

// --- Sound Utility ---
// In a real app, you'd load these from assets. 
// For now, we use a simple localized beep/pop logic or placeholders.
const playSound = (type: 'send' | 'receive') => {
    try {
        const audio = new Audio(type === 'send' ? '/assets/sounds/pop-up.mp3' : '/assets/sounds/message.mp3');
        // Note: You would need actual mp3 files in public/assets/sounds/ for this to work.
        // We will wrap this in a try/catch so it doesn't crash if files are missing.
        audio.volume = 0.5;
        audio.play().catch(() => { }); // Ignore auto-play errors
    } catch (e) {
        // Fallback or silence
    }
};

const SUGGESTED_QUERIES = [
    { label: "Tell me about services", icon: Sparkles },
    { label: "View Web Dev Brochure", icon: FileText },
    { label: "Project Cost Estimator", icon: Plus },
    { label: "Contact Support", icon: User },
];

export function NavigatorChat() {
    const { messages, input, setInput, handleInputChange, handleSubmit, isLoading } = useChatAgent({
        agentType: "navigator"
    });
    const scrollRef = useRef<HTMLDivElement>(null);
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Play sound on new messages
    useEffect(() => {
        if (!isLoading && messages.length > 0 && messages[messages.length - 1].role !== 'user') {
            if (soundEnabled) playSound('receive');
        }
    }, [messages, isLoading, soundEnabled]);

    const handleSend = (e: React.FormEvent) => {
        if (soundEnabled) playSound('send');
        handleSubmit(e);
    };

    const handleChipClick = (query: string) => {
        if (soundEnabled) playSound('send');
        // Hack to simulate input event for the hook if needed, or just setInput + submit
        // Since useChatAgent might rely on form submission, we can manually set input and mock a submit
        const syntheticEvent = { preventDefault: () => { } } as React.FormEvent;
        // Ideally useChatAgent exposes a simplified 'sendMessage' but we work with what we have
        // For this demo, we can just set the input text for the user to press enter, or modify the hook later.
        // Let's just set the input for now to be safe.
        setInput(query);
    };

    // --- Custom Brochure Renderer ---
    const renderContent = (msg: Message) => {
        const content = getMessageContent(msg);

        // Simple keyword detection for "Brochures" (Mocking the AI's "Tool Use" or structured response)
        if (content.toLowerCase().includes("brochure") || content.toLowerCase().includes("web dev") || content.toLowerCase().includes("mobile app")) {
            // Check context to render a card
            if (content.toLowerCase().includes("web")) {
                return (
                    <div className="space-y-3">
                        <p>{content}</p>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="p-4 rounded-xl bg-gradient-to-br from-[#0c1220] to-[#1a2c4e] border border-blue-500/30 flex items-center gap-4 group cursor-pointer hover:border-blue-400 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-blue-100">Web Development 2026</h4>
                                <p className="text-xs text-blue-300/60">Comprehensive guide to our stacks & pricing.</p>
                            </div>
                            <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                                Download <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </motion.div>
                    </div>
                );
            }
        }

        return content;
    };


    return (
        <div className="flex flex-col h-full bg-[#030711] relative overflow-hidden font-sans">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[100px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] rounded-full bg-blue-600/10 blur-[100px]" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02] backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 border-2 border-[#030711]" />
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2px]">
                            <div className="w-full h-full rounded-full bg-[#030711] flex items-center justify-center">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">Nyembo Guide</h3>
                        <p className="text-xs text-indigo-400 font-medium">Always Online</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="text-white/40 hover:text-white hover:bg-white/5"
                >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar scroll-smooth" ref={scrollRef}>
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards" style={{ animationDelay: '0.2s' }}>
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-6">
                            <Sparkles className="w-10 h-10 text-indigo-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Good Afternoon!</h2>
                        <p className="text-white/40 max-w-xs mb-8">I'm your personal guide to Nyembotech. Ask me anything about our services, or check out our latest projects.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
                            {SUGGESTED_QUERIES.map((q) => (
                                <button
                                    key={q.label}
                                    onClick={() => handleChipClick(q.label)}
                                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-indigo-500/30 transition-all group text-left"
                                >
                                    <q.icon className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />
                                    <span className="text-sm text-white/70 group-hover:text-white font-medium">{q.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {messages.map((msg: Message) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={cn(
                                "flex gap-4 max-w-3xl group",
                                msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                            )}
                        >
                            {/* Avatar */}
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg border text-[10px]",
                                msg.role === "assistant"
                                    ? "bg-gradient-to-tr from-indigo-500 to-purple-600 border-transparent text-white"
                                    : "bg-white/10 border-white/20 text-white"
                            )}>
                                {msg.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            </div>

                            {/* Bubble */}
                            <div className={cn(
                                "p-4 rounded-2xl shadow-sm text-sm leading-relaxed relative max-w-[85%]",
                                msg.role === "assistant"
                                    ? "bg-gradient-to-br from-[#1e2330] to-[#13161f] border border-white/10 text-gray-200 rounded-tl-none shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                                    : "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-tr-none font-medium shadow-[0_4px_20px_rgba(79,70,229,0.2)]"
                            )}>
                                {renderContent(msg)}
                                <div className={cn(
                                    "text-[10px] opacity-0 group-hover:opacity-40 transition-opacity absolute -bottom-5 min-w-max",
                                    msg.role === "user" ? "right-0" : "left-0"
                                )}>
                                    {(msg.createdAt instanceof Date ? msg.createdAt : new Date(msg.createdAt || Date.now())).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 max-w-3xl">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                        </div>
                        <div className="bg-[#1e2330] border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0s' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0.1s' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#030711]/80 backdrop-blur-xl border-t border-white/5 pb-8">
                <form onSubmit={handleSend} className="relative max-w-4xl mx-auto flex gap-3">
                    <Button type="button" size="icon" variant="ghost" className="text-white/40 hover:text-white hover:bg-white/5 rounded-xl">
                        <Plus className="w-5 h-5" />
                    </Button>

                    <div className="relative flex-1 group">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        <input
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Type your message..."
                            className="relative w-full bg-[#0c101a] border border-white/10 rounded-xl py-3.5 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:bg-[#131825] placeholder:text-white/20 transition-all font-medium"
                        />
                        <div className="absolute right-2 top-2">
                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-9 w-9 text-white/30 hover:text-white"
                            >
                                <Paperclip className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className={cn(
                            "h-[46px] w-[46px] rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-105 transition-all p-0 flex items-center justify-center",
                            isLoading && "opacity-80 cursor-wait"
                        )}
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
                    </Button>
                </form>
            </div>
        </div>
    );
}


