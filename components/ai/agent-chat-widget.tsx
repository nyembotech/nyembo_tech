"use client";



import { useState, useRef, useEffect } from "react";
import { useChatAgent, type Message, getMessageContent } from "@/hooks/use-chat-agent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Sparkles, Volume2, VolumeX, FileText, ArrowRight, X, ChevronRight, Hash, Paperclip, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

// --- Sound Utility ---
const playSound = (type: 'send' | 'receive' | 'open') => {
    try {
        const audio = new Audio(
            type === 'send' ? '/assets/sounds/pop-up.mp3' :
                type === 'receive' ? '/assets/sounds/message.mp3' :
                    '/assets/sounds/open.mp3'
        );
        audio.volume = type === 'open' ? 0.3 : 0.5;
        audio.play().catch(() => { });
    } catch (e) { }
};

const FAQ_TOPICS = [
    {
        category: "General",
        items: [
            "What services do you offer?",
            "How does pricing work?",
            "View recent case studies"
        ]
    },
    {
        category: "Technical",
        items: [
            "What tech stack do you use?",
            "Do you offer maintenance?",
            "API Integration details"
        ]
    },
    {
        category: "Support",
        items: [
            "I have a bug report",
            "Check ticket status"
        ]
    }
];

interface AgentChatWidgetProps {
    agentType: "sales" | "support";
    projectId?: string;
    language?: string;
}

export function AgentChatWidget({ agentType, projectId, language = "en" }: AgentChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { messages, input, setInput, handleInputChange, handleSubmit, isLoading, isReady, sendMessage } = useChatAgent({ agentType, projectId, language });
    const scrollRef = useRef<HTMLDivElement>(null);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const isSupport = agentType === "support";

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Play receive sound
    useEffect(() => {
        if (!isLoading && messages.length > 0 && messages[messages.length - 1].role !== 'user' && isOpen) {
            if (soundEnabled) playSound('receive');
        }
    }, [messages, isLoading, soundEnabled, isOpen]);

    const toggleOpen = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        if (newState && soundEnabled) playSound('open');
    };

    const handleSend = (e: React.FormEvent) => {
        if (soundEnabled) playSound('send');
        handleSubmit(e);
    };

    const handleTopicClick = (query: string) => {
        if (soundEnabled) playSound('send');
        sendMessage(query);
    };

    // --- Custom Brochure Renderer ---
    const renderRichContent = (msg: Message) => {
        const content = getMessageContent(msg);
        if (content.toLowerCase().includes("brochure") && content.toLowerCase().includes("web")) {
            return (
                <div className="space-y-3 mt-2">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="p-3 rounded-xl bg-white/90 border border-blue-100 shadow-sm flex items-center gap-3 cursor-pointer hover:shadow-md transition-all group/card"
                    >
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 group-hover/card:scale-110 transition-transform">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-800 text-xs truncate">Web Development 2026</h4>
                            <p className="text-[10px] text-gray-500 truncate">PDF • 2.4 MB</p>
                        </div>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </motion.div>
                </div>
            );
        }
        return null;
    };

    if (!isReady) return null;

    return (
        <>
            {/* Expanded Chat View */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                            className="bg-white w-full max-w-5xl h-[85vh] rounded-[2.5rem] shadow-2xl flex overflow-hidden relative ring-4 ring-white/20"
                        >
                            {/* --- Sidebar (Left) --- */}
                            <div className="w-[280px] bg-gray-50 flex flex-col hidden md:flex border-r border-gray-100 relative overflow-hidden">
                                {/* Decorative Gradient Circle */}
                                <div className="absolute -top-20 -left-20 w-60 h-60 bg-gradient-to-br from-green-400/20 via-yellow-400/20 to-blue-500/20 rounded-full blur-3xl pointer-events-none" />

                                <div className="flex flex-col flex-1 overflow-hidden">
                                    {/* Sidebar Header */}
                                    <div className="p-6 pb-0 relative z-10 shrink-0">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 relative">
                                                <img src="/assets/images/logo/logo.png" alt="Nyembo" className="w-full h-full object-contain" />
                                            </div>
                                            <div>
                                                <h2 className="font-bold text-gray-900 tracking-tight">Chit-Chat</h2>
                                                <p className="text-[10px] text-gray-500 font-medium bg-gray-200 px-2 py-0.5 rounded-full w-fit">ONLINE</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Scrollable Content */}
                                    <div className="flex-1 overflow-y-auto px-6 py-2 relative z-10 custom-scrollbar">
                                        <div className="space-y-6">
                                            {FAQ_TOPICS.map((topic, idx) => (
                                                <div key={topic.category}>
                                                    <h3 className={cn(
                                                        "text-[10px] font-bold uppercase tracking-widest mb-3 px-2 flex items-center gap-2",
                                                        idx === 0 ? "text-blue-500" : idx === 1 ? "text-green-500" : "text-yellow-600"
                                                    )}>
                                                        <Hash className="w-3 h-3" /> {topic.category}
                                                    </h3>
                                                    <div className="space-y-1">
                                                        {topic.items.map((item) => (
                                                            <button
                                                                key={item}
                                                                onClick={() => handleTopicClick(item)}
                                                                className="w-full text-left text-xs font-medium py-2.5 px-3 rounded-xl text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 transition-all flex items-center justify-between group shadow-sm hover:shadow-md bg-white hover:scale-[1.02] border border-gray-100 hover:border-transparent"
                                                            >
                                                                {item}
                                                                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-white" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto p-6 pb-12 relative z-10 shrink-0">
                                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4 border border-green-200">
                                        <h4 className="font-bold text-green-900 text-sm mb-1">Need human help?</h4>
                                        <p className="text-xs text-green-700 mb-3">Our team is available 24/7 for you.</p>
                                        <Button size="sm" className="w-full bg-white text-green-700 hover:bg-green-50 hover:text-green-800 border border-green-200 shadow-sm h-8 text-xs font-bold">
                                            Contact Support
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* --- Main Chat Area (Right) --- */}
                            <div className="flex-1 flex flex-col bg-white relative">
                                {/* Header */}
                                <div className="h-20 border-b border-gray-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
                                    <div className="flex items-center gap-4">
                                        {/* Mobile Toggle or Logo */}
                                        <div className="md:hidden">
                                            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-green-400">
                                                <img src="/assets/images/chit-chat-avatar.png" alt="AI" className="w-full h-full object-cover" />
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                                Chit-Chat Assistant
                                                <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500 animate-pulse" />
                                            </h3>
                                            <p className="text-xs text-gray-400">Always here to help you</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full"
                                            onClick={() => setSoundEnabled(!soundEnabled)}
                                        >
                                            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <X className="w-6 h-6" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50/50 to-white" ref={scrollRef}>
                                    {messages.length === 0 && (
                                        <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ duration: 0.5 }}
                                                className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl mb-6 relative group"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-tr from-green-400 via-yellow-400 to-blue-500 opacity-20 group-hover:opacity-0 transition-opacity" />
                                                <img src="/assets/images/chit-chat-avatar.png" alt="AI" className="w-full h-full object-cover" />
                                            </motion.div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Hello! I'm Chit-Chat</h3>
                                            <p className="text-gray-500 max-w-xs mx-auto">I'm a realistic, charming AI assistant here to help you with anything you need.</p>

                                            <div className="flex gap-2 mt-8">
                                                <span className="w-2 h-2 rounded-full bg-green-400 animate-bounce [animation-delay:-0.3s]" />
                                                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-bounce [animation-delay:-0.15s]" />
                                                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                                            </div>
                                        </div>
                                    )}

                                    {messages.map((m: Message) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={m.id}
                                            className={cn("flex gap-4 max-w-3xl mx-auto group", m.role === "user" ? "flex-row-reverse" : "")}
                                        >
                                            {/* Avatar */}
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-2 shadow-md overflow-hidden border-2",
                                                m.role === "assistant" ? "border-white bg-white" : "border-blue-100 bg-blue-50"
                                            )}>
                                                {m.role === "assistant" ? (
                                                    <img src="/assets/images/chit-chat-avatar.png" alt="AI" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-5 h-5 text-blue-500" />
                                                )}
                                            </div>

                                            {/* Content Bubble */}
                                            <div className={cn(
                                                "flex-1 p-5 rounded-[1.5rem] text-sm leading-relaxed shadow-sm relative",
                                                m.role === "assistant"
                                                    ? "bg-white text-gray-700 rounded-tl-none border border-gray-100"
                                                    : "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-none shadow-blue-200"
                                            )}>
                                                {/* Markdown Rendering */}
                                                <div className={cn("markdown-prose", m.role === "user" ? "text-blue-50" : "")}>
                                                    <ReactMarkdown
                                                        components={{
                                                            ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 my-2 opacity-90" {...props} />,
                                                            ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1 my-2 opacity-90" {...props} />,
                                                            li: ({ node, ...props }) => <li className="ml-2" {...props} />,
                                                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                            strong: ({ node, ...props }) => <strong className="font-bold opacity-100" {...props} />,
                                                            a: ({ node, ...props }) => <a className="underline hover:no-underline font-medium" {...props} />
                                                        }}
                                                    >
                                                        {getMessageContent(m)}
                                                    </ReactMarkdown>
                                                </div>
                                                {renderRichContent(m)}

                                                {/* Timestamp/Status (Fake) */}
                                                <div className={cn(
                                                    "absolute -bottom-5 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity",
                                                    m.role === "user" ? "right-2 text-gray-400" : "left-2 text-gray-400"
                                                )}>
                                                    Just now
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {isLoading && (
                                        <div className="flex gap-4 max-w-3xl mx-auto">
                                            <div className="w-10 h-10 rounded-full bg-white border-2 border-white shadow-md overflow-hidden shrink-0 mt-2">
                                                <img src="/assets/images/chit-chat-avatar.png" alt="Thinking" className="w-full h-full object-cover animate-pulse" />
                                            </div>
                                            <div className="bg-white p-4 rounded-[1.5rem] rounded-tl-none border border-gray-100 flex items-center gap-2 shadow-sm">
                                                <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" />
                                                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Input Area */}
                                <div className="p-6 bg-white border-t border-gray-100 relative z-20">
                                    <form onSubmit={handleSend} className="max-w-3xl mx-auto relative flex items-center gap-3">
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 shrink-0"
                                        >
                                            <Paperclip className="w-5 h-5" />
                                        </Button>

                                        <div className="flex-1 relative">
                                            <Input
                                                value={input}
                                                onChange={handleInputChange}
                                                placeholder="Type your message..."
                                                className="bg-gray-50 border-gray-200 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 h-[56px] text-base pl-5 pr-4 rounded-2xl shadow-sm transition-all text-gray-900 placeholder:text-gray-400"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            size="icon"
                                            disabled={isLoading || !input.trim()}
                                            className="h-14 w-14 bg-gradient-to-tr from-green-400 via-yellow-400 to-blue-500 hover:opacity-90 transition-opacity rounded-2xl shrink-0 shadow-lg shadow-blue-500/20 text-white"
                                        >
                                            <Send className="w-6 h-6" />
                                        </Button>
                                    </form>
                                    <div className="text-center mt-3 flex items-center justify-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                        <p className="text-[10px] text-gray-400 font-medium">Chit-Chat Intelligence System</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Launch Button (Floating) */}
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed z-40 right-4 top-1/2 -translate-y-1/2 md:right-8 md:bottom-8 md:top-auto md:translate-y-0"
            >
                <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-green-400 via-yellow-400 to-blue-500 opacity-75 blur animate-pulse" />
                <Button
                    onClick={toggleOpen}
                    className={cn(
                        "h-16 w-16 p-0 rounded-full shadow-2xl border-4 border-white transition-all duration-300 relative overflow-hidden group",
                        isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
                    )}
                >
                    <img src="/assets/images/chit-chat-avatar.png" alt="Chat" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />

                    {/* Status Dot */}
                    <div className="absolute bottom-2 right-2 w-3 h-3 bg-green-500 border-2 border-white rounded-full z-10" />
                </Button>
            </motion.div>
        </>
    );
}
