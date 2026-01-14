"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Check } from "lucide-react";

type Currency = "EUR" | "USD" | "TZS";

const PRICING = {
    EUR: { amount: 300, symbol: "€", label: "Euro" },
    USD: { amount: 350, symbol: "$", label: "USD" },
    TZS: { amount: 1000000, symbol: "TSh", label: "Tanzanian Shilling" }
};

export function CurrencyConverter() {
    const [currency, setCurrency] = useState<Currency>("EUR");
    const [isAnimating, setIsAnimating] = useState(false);

    const handleSwitch = (newCurrency: Currency) => {
        if (newCurrency === currency) return;
        setIsAnimating(true);
        setCurrency(newCurrency);
        setTimeout(() => setIsAnimating(false), 500);
    };

    return (
        <div className="relative group max-w-md mx-auto w-full">
            {/* Gradient Border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#58ffff] via-[#ffff6c] to-[#F54633] rounded-3xl opacity-75 blur-sm group-hover:opacity-100 transition duration-1000" />

            <div className="relative bg-black/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 text-center">
                <h3 className="text-gray-400 text-sm font-medium tracking-wider uppercase mb-6">
                    Application Development
                </h3>

                <div className="bg-white/5 rounded-2xl p-6 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-nyembo-sky via-nyembo-yellow to-nyembo-red" />

                    <p className="text-gray-400 text-xs mb-2">Starting from</p>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currency}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-4xl lg:text-5xl font-bold text-white tracking-tight"
                        >
                            {PRICING[currency].symbol} {PRICING[currency].amount.toLocaleString()}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {(Object.keys(PRICING) as Currency[]).map((curr) => (
                        <button
                            key={curr}
                            onClick={() => handleSwitch(curr)}
                            className={`
                                relative py-3 rounded-xl text-sm font-bold transition-all duration-300
                                ${currency === curr
                                    ? 'bg-white text-black shadow-lg scale-105 ring-2 ring-nyembo-sky'
                                    : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'}
                            `}
                        >
                            {curr}
                            {currency === curr && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute inset-0 bg-white/10 rounded-xl"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                        <RefreshCw className={`w-3 h-3 ${isAnimating ? 'animate-spin' : ''}`} />
                        <span>Real-time conversion</span>
                    </div>
                    {currency === "TZS" && (
                        <span className="text-nyembo-yellow font-medium">Local Special</span>
                    )}
                </div>
            </div>
        </div>
    );
}
