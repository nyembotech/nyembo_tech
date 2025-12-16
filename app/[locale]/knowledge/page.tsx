"use client";

import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useKnowledgeArticles } from "@/hooks/firestore/use-knowledge-articles";
import Link from "next/link";
import { motion } from "framer-motion";

export default function KnowledgePage() {
    const { articles, loading } = useKnowledgeArticles({ status: "published" });
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = ["All", "AI", "Cloud", "Smart Spaces", "Academy"];

    const filtered = articles.filter(a => {
        const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
            a.summary.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory && selectedCategory !== 'All' ? a.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-20 px-6">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="space-y-4 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
                        Knowledge Hub
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Insights, tutorials, and thought leadership from the Nyembotech team.
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between sticky top-20 z-10 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search topics..."
                            className="pl-9 bg-white/5 border-white/10 rounded-full"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${(selectedCategory === cat || (!selectedCategory && cat === 'All'))
                                        ? "bg-nyembo-sky text-black shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                                        : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Articles Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => <div key={i} className="h-96 bg-white/5 animate-pulse rounded-2xl" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map((article, idx) => (
                            <Link href={`/knowledge/${article.slug}`} key={article.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group relative h-full bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden hover:border-nyembo-sky/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(56,189,248,0.1)] hover:-translate-y-1"
                                >
                                    <div className="h-3 bg-gradient-to-r from-nyembo-sky via-purple-500 to-emerald-500" />
                                    <div className="p-8 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <Badge variant="outline" className="border-white/10 text-gray-400 group-hover:border-nyembo-sky/30 group-hover:text-nyembo-sky transition-colors">
                                                {article.category}
                                            </Badge>
                                            <span className="text-xs text-gray-600 font-mono">
                                                {new Date(article.publishedAt?.seconds * 1000).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">
                                            {article.title}
                                        </h2>

                                        <p className="text-gray-400 line-clamp-3 mb-6 flex-1">
                                            {article.summary}
                                        </p>

                                        <div className="flex items-center text-sm font-bold text-nyembo-sky gap-2 group-hover:translate-x-2 transition-transform">
                                            Read Article <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
