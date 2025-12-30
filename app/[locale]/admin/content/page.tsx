"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchCollection } from "@/services/firebase/database";
import { PageContent } from "@/types/firestore";
import { Loader2, FileText, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import { HeroCardsManager } from "@/components/admin/hero-cards-manager";
import { seedHeroCards } from "@/lib/seed-hero-cards";

export default function AdminContentPage() {
    const [pages, setPages] = useState<PageContent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPages() {
            try {
                // @ts-ignore - generic type inference issue with helper
                const data = await fetchCollection("site_content");
                setPages(data as PageContent[]);
            } catch (error) {
                console.error("Error fetching content pages:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchPages();
    }, []);

    const defaultPages = [
        { id: "home", hero: { title: "Home Page" } },
        { id: "solutions", hero: { title: "Solutions Page" } },
        { id: "smart-spaces", hero: { title: "Smart Spaces Page" } },
        { id: "academy", hero: { title: "Academy Page" } },
    ];

    return (
        <div className="p-8 min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">Content Manager</h1>
                    <p className="text-muted-foreground">Manage site content and assets.</p>
                </div>
                <button
                    onClick={() => seedHeroCards()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-bold shadow-lg transition-colors"
                >
                    Seed Data
                </button>
            </div>

            {/* HERO CARDS MANAGEMENT SECTION */}
            <div className="mb-12">
                <HeroCardsManager />
            </div>

            <h2 className="text-2xl font-bold text-white mb-6">Page Content</h2>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-nyembo-sky animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Render all unique pages found in DB (excluding localized variants) */}
                    {pages
                        .filter(p => !p.id.includes('_')) // Show only base pages (EN)
                        .map((page) => {
                            const title = page.hero?.title || page.id;

                            return (
                                <Link key={page.id} href={`/admin/content/${page.id}`}>
                                    <div className="group relative h-48 bg-[#121214] border border-white/5 rounded-3xl p-6 overflow-hidden hover:border-nyembo-sky/50 transition-all duration-300">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="relative z-10 flex flex-col h-full justify-between">
                                            <div className="flex items-start justify-between">
                                                <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-nyembo-sky/10 transition-colors">
                                                    <FileText className="w-6 h-6 text-white group-hover:text-nyembo-sky transition-colors" />
                                                </div>
                                                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                                                    <ArrowRight className="w-4 h-4 text-nyembo-sky" />
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{title}</h3>
                                                <p className="text-sm text-muted-foreground uppercase tracking-wider">/{page.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                </div>
            )}
        </div>
    );
}
