"use client";

import { useState } from "react";
import { FolderPlus, Search, PenLine, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useKnowledgeArticles } from "@/hooks/firestore/use-knowledge-articles";
import { ArticleEditor } from "@/components/admin/knowledge/article-editor"; // Will create next
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function AdminKnowledgePage() {
    const { articles, loading, deleteArticle } = useKnowledgeArticles();
    const [search, setSearch] = useState("");
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<any>(null);

    const filteredArticles = articles.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.category.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (confirm("Delete this article?")) {
            await deleteArticle(id);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Knowledge Hub</h1>
                    <p className="text-muted-foreground">Manage articles and thought leadership content.</p>
                </div>
                <Button
                    onClick={() => { setEditingArticle(null); setIsEditorOpen(true); }}
                    className="bg-nyembo-sky text-black hover:bg-nyembo-sky/80"
                >
                    <FolderPlus className="w-4 h-4 mr-2" /> New Article
                </Button>
            </div>

            {/* Filter Bar */}
            <div className="flex gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                        placeholder="Search articles..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                </div>
            </div>

            {/* Articles List */}
            {loading ? (
                <div className="text-white">Loading content...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map(article => (
                        <Card key={article.id} className="bg-white/5 border-white/10 hover:border-nyembo-sky/50 transition-colors group">
                            <div className="h-2 w-full bg-gradient-to-r from-nyembo-sky/20 to-transparent" />
                            <div className="p-5 space-y-4">
                                <div className="flex justify-between items-start">
                                    <Badge variant="outline" className="border-white/10 text-gray-400">
                                        {article.category}
                                    </Badge>
                                    <Badge className={article.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}>
                                        {article.status}
                                    </Badge>
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-nyembo-sky transition-colors line-clamp-2">
                                    {article.title}
                                </h3>
                                <p className="text-sm text-gray-400 line-clamp-3">
                                    {article.summary}
                                </p>
                                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                    <span className="text-xs text-gray-500">
                                        {article.language.toUpperCase()} • {new Date(article.publishedAt?.seconds * 1000).toLocaleDateString()}
                                    </span>
                                    <div className="flex gap-2">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-nyembo-sky" onClick={() => { setEditingArticle(article); setIsEditorOpen(true); }}>
                                            <PenLine className="w-4 h-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-red-500" onClick={() => handleDelete(article.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Editor Dialog */}
            <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
                <DialogContent className="max-w-6xl h-[90vh] bg-[#0A0A0A] border-white/10 p-0 flex flex-col">
                    <ArticleEditor
                        article={editingArticle}
                        onClose={() => setIsEditorOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
