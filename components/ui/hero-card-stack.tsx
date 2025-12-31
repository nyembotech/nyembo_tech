"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroCard } from "@/types/hero-card";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";


export function HeroCardStack() {
    const [cards, setCards] = useState<HeroCard[]>([]);
    const [selectedCard, setSelectedCard] = useState<HeroCard | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const q = query(collection(db, "hero_cards"), orderBy("order", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HeroCard));
            setCards(data);
        });
        return () => unsubscribe();
    }, []);

    // Auto-cycle cards
    useEffect(() => {
        if (cards.length === 0 || selectedCard) return;

        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % cards.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [cards.length, selectedCard]);

    // Handle card click
    const handleCardClick = (card: HeroCard, index: number) => {
        if (index === activeIndex) {
            setSelectedCard(card);
        } else {
            setActiveIndex(index);
        }
    };

    return (
        <div className="relative w-full h-[600px] flex items-center justify-center perspective-1000">
            <div className="relative w-full h-full flex items-center justify-center">
                <AnimatePresence mode="popLayout">
                    {cards.map((card, index) => {
                        // Effective offset logic
                        const count = cards.length;
                        const offset = (index - activeIndex + count) % count;

                        return (
                            <CardItem
                                key={card.id}
                                card={card}
                                offset={offset}
                                total={count}
                                isActive={index === activeIndex}
                                onClick={() => handleCardClick(card, index)}
                            />
                        );
                    })}
                </AnimatePresence>
            </div>

            <Dialog open={!!selectedCard} onOpenChange={(open) => !open && setSelectedCard(null)}>
                <DialogContent className="bg-black/80 border border-white/10 backdrop-blur-2xl text-white max-w-2xl sm:max-w-3xl overflow-hidden p-0 gap-0 rounded-3xl shadow-2xl">
                    {selectedCard && (
                        <div className="flex flex-col md:flex-row h-[80vh] md:h-auto">
                            <div className={cn(
                                "relative h-48 md:h-auto md:w-1/3 overflow-hidden",
                                "bg-gradient-to-br", selectedCard.color || "from-gray-800 to-black"
                            )}>
                                {selectedCard.imageUrl && (
                                    <img
                                        src={selectedCard.imageUrl}
                                        alt=""
                                        className="w-full h-full object-cover opacity-80 mix-blend-overlay"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <DialogTitle className="text-2xl font-bold text-white drop-shadow-md">
                                        {selectedCard.title}
                                    </DialogTitle>
                                    <DialogDescription className="text-xs text-white/80 font-mono">
                                        {selectedCard.subtitle}
                                    </DialogDescription>
                                </div>
                            </div>
                            <div className="flex-1 p-8 overflow-y-auto bg-black/50 backdrop-blur-3xl">
                                <div
                                    className="prose prose-invert prose-sm max-w-none text-gray-300"
                                    dangerouslySetInnerHTML={{ __html: selectedCard.modalContent }}
                                />
                                <div className="pt-8 flex justify-end">
                                    <button
                                        onClick={() => setSelectedCard(null)}
                                        className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm font-bold border border-white/5 flex items-center gap-2"
                                    >
                                        <X className="w-4 h-4" /> Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

function CardItem({ card, offset, total, isActive, onClick }: {
    card: HeroCard,
    offset: number,
    total: number,
    isActive: boolean,
    onClick: () => void
}) {
    // Visual settings

    // Position calculations for Wide Fan
    const rotate = offset * 8;
    const x = offset * 35;
    const y = offset * -15;
    const scale = isActive ? 1.1 : 1 - (offset * 0.05);
    const zIndex = total - offset;
    const opacity = 1 - (offset * 0.15);

    const gradientClass = card.color ? `bg-gradient-to-br ${card.color}` : "bg-gradient-to-br from-gray-800 to-gray-900";


    return (
        <motion.div
            layout
            animate={{
                top: "10%",
                left: `calc(50% - 160px)`,
                x: isActive ? 0 : x + 20,
                y: isActive ? 0 : -y + 20,
                rotateZ: isActive ? 0 : rotate + 5,
                scale: scale,
                zIndex: zIndex,
                opacity: opacity
            }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                mass: 1
            }}
            onClick={onClick}
            className={cn(
                "absolute w-72 h-96 rounded-[2rem] cursor-pointer shadow-2xl overflow-hidden transform-gpu",
                "backdrop-blur-3xl",
                isActive ? "bg-white/10" : "bg-black/40"
            )}
            style={{
                boxShadow: isActive
                    ? "0 20px 50px -12px rgba(0,0,0,0.5), 0 0 20px rgba(255,255,255,0.1)"
                    : "0 10px 30px -10px rgba(0,0,0,0.5)"
            }}
        >
            {/* Gradient Border */}
            <div
                className={
                    cn(
                        "absolute inset-0 rounded-[2rem] border-[2px] border-transparent transition-opacity duration-300",
                        "bg-gradient-to-br from-[#58ffff] via-[#ffff6c] to-[#F54633]",
                        isActive ? "opacity-100" : "opacity-40 hover:opacity-70"
                    )
                }
                style={{
                    mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                    maskComposite: "exclude",
                    WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor"
                }}
            />
            {/* Gradient Background Layer */}
            <div className={cn(
                "absolute inset-0 opacity-[0.85] mix-blend-soft-light transition-all duration-500",
                gradientClass
            )} />

            {/* Content */}
            <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
                <div>
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 shadow-inner">
                        <div className={cn("w-3 h-3 rounded-full", "bg-white shadow-[0_0_10px_white]")} />
                    </div>
                    <h3 className="text-2xl font-bold leading-tight drop-shadow-md">
                        {card.title}
                    </h3>
                    <p className="text-xs font-mono mt-1 uppercase tracking-wider text-white font-bold">
                        {card.subtitle}
                    </p>
                </div>

                <div className="space-y-4">
                    <p className="text-sm text-white line-clamp-3 leading-relaxed font-medium">
                        {card.description}
                    </p>

                    <div className={cn(
                        "h-10 rounded-xl flex items-center justify-center text-xs font-bold uppercase tracking-widest border transition-all duration-300",
                        isActive
                            ? "bg-white text-black border-white hover:bg-gray-200"
                            : "bg-white/5 border-white/10 text-white/50"
                    )}>
                        {isActive ? "Explore Now" : "View"}
                    </div>
                </div>
            </div>

            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 pointer-events-none" />
        </motion.div >
    );
}
