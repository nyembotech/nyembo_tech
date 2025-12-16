"use client";

import { useParams } from "next/navigation";
import { useKnowledgeArticles } from "@/hooks/firestore/use-knowledge-articles";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ChevronLeft, Share2, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ArticleDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;

    // In a real app we'd likely use a dedicated `useArticleBySlug` hook or fetch logic
    // But re-using the list hook with a filter is "okay" dev-speed wise for now, though inefficient.
    // Let's improve it: The hook accepts a filter.
    const { articles, loading } = useKnowledgeArticles({ slug });

    const article = articles[0];

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

    if (!article) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white space-y-4">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="text-gray-400">Article not found.</p>
            <Link href="/knowledge" className="text-nyembo-sky hover:underline">Back to Hub</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-20">
            {/* Hero */}
            <div className="max-w-4xl mx-auto px-6 mb-12">
                <Link href="/knowledge" className="inline-flex items-center text-gray-500 hover:text-white transition-colors mb-8 group">
                    <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Knowledge Hub
                </Link>

                <div className="space-y-6">
                    <div className="flex gap-3">
                        <Badge className="bg-gradient-to-r from-nyembo-sky to-purple-500 text-black font-bold border-0">
                            {article.category}
                        </Badge>
                        <Badge variant="outline" className="border-white/10 text-gray-400">
                            {article.language.toUpperCase()}
                        </Badge>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-yellow-400 leading-tight">
                        {article.title}
                    </h1>

                    <div className="flex items-center gap-6 text-sm text-gray-400 border-b border-white/10 pb-8">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(article.publishedAt?.seconds * 1000).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Nyembotech Team
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto hover:text-nyembo-sky">
                            <Share2 className="w-4 h-4 mr-2" /> Share
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <article className="max-w-3xl mx-auto px-6">
                <div
                    className="prose prose-invert prose-lg max-w-none 
                        prose-headings:text-bold prose-headings:text-white 
                        prose-h1:text-nyembo-sky prose-h2:text-white prose-h2:mt-12 prose-h2:mb-6
                        prose-p:text-gray-300 prose-p:leading-relaxed
                        prose-a:text-nyembo-sky prose-a:no-underline hover:prose-a:text-yellow-400 hover:prose-a:underline
                        prose-strong:text-white
                        prose-code:text-yellow-400 prose-code:bg-white/10 prose-code:px-1 prose-code:rounded
                        prose-pre:bg-[#111] prose-pre:border prose-pre:border-white/10
                    "
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(article.content) }}
                />
            </article>
        </div>
    );
}

// Reusing specific simple parser for valid display if libraries are minimal
function parseMarkdown(text: string) {
    if (!text) return "";
    let html = text
        .replace(/^# (.*$)/gim, '') // Remove H1 as it's in hero
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
        .replace(/\*(.*)\*/gim, '<i>$1</i>')
        .replace(/^- (.*$)/gim, '<li class="ml-4 mb-2 list-disc text-gray-300">$1</li>')
        .replace(/\n\n/gim, '<br/><br/>');

    return html;
}
