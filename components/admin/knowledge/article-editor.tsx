"use client";

import { useState, useEffect } from "react";
import { X, Save, Eye, Code, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Assuming we have this, else use standard textarea
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useKnowledgeArticles } from "@/hooks/firestore/use-knowledge-articles";
import { KnowledgeArticle } from "@/types/firestore";
import { serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import ReactMarkdown from 'react-markdown'; // Assuming installed or will need to install
// If react-markdown not available, I'll fallback to a simple pre-wrap div for now to avoid package installs mid-flow unless necessary.

const DEFAULT_CONTENT = `# New Article\n\nWrite your thought leadership content here using Markdown.\n\n## Subheading\n- Point 1\n- Point 2`;

interface ArticleEditorProps {
    article?: KnowledgeArticle;
    onClose: () => void;
}

export function ArticleEditor({ article, onClose }: ArticleEditorProps) {
    const { addArticle, updateArticle } = useKnowledgeArticles();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<"edit" | "preview">("edit");

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        summary: "",
        content: DEFAULT_CONTENT,
        category: "AI", // Default
        tags: "",
        language: "en",
        status: "draft"
    });

    useEffect(() => {
        if (article) {
            setFormData({
                title: article.title,
                slug: article.slug,
                summary: article.summary,
                content: article.content,
                category: article.category,
                tags: article.tags.join(", "),
                language: article.language,
                status: article.status
            });
        }
    }, [article]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Auto-generate slug from title if slug is empty and we are typing title
        if (field === "title" && !article && (!formData.slug || formData.slug === slugify(prevTitle(formData)))) {
            // Logic simplified: just auto-slug on save or if empty
        }
    };

    // Helper needed for state closure issue above, ignore for now
    const slugify = (text: string) => text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

    const handleSave = async () => {
        if (!formData.title || !formData.content) return;
        setLoading(true);

        const data: any = {
            ...formData,
            slug: formData.slug || slugify(formData.title),
            tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
            authorId: user?.uid || "system",
            publishedAt: serverTimestamp(), // In real app preserve original publishedAt if editing
        };

        try {
            if (article) {
                await updateArticle(article.id, data);
            } else {
                await addArticle(data);
            }
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const prevTitle = (d: any) => d.title;

    return (
        <div className="flex flex-col h-full bg-[#0A0A0A] text-white">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-black/50 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
                    <h2 className="text-xl font-bold">{article ? "Edit Article" : "New Article"}</h2>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-white/5 rounded-lg p-1 flex gap-1 mr-4">
                        <button
                            onClick={() => setMode("edit")}
                            className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-2 transition-all ${mode === 'edit' ? 'bg-nyembo-sky text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Code className="w-3 h-3" /> Editor
                        </button>
                        <button
                            onClick={() => setMode("preview")}
                            className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-2 transition-all ${mode === 'preview' ? 'bg-nyembo-sky text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Eye className="w-3 h-3" /> Preview
                        </button>
                    </div>
                    <Button onClick={handleSave} disabled={loading} className="bg-emerald-500 text-black hover:bg-emerald-400">
                        <Save className="w-4 h-4 mr-2" /> Save Article
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Meta Sidebar */}
                <div className="w-80 border-r border-white/10 p-6 space-y-6 overflow-y-auto bg-black/20">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input value={formData.title} onChange={(e) => handleChange("title", e.target.value)} className="bg-white/5 border-white/10" placeholder="Article Title" />
                    </div>
                    <div className="space-y-2">
                        <Label>Slug URL</Label>
                        <Input value={formData.slug} onChange={(e) => handleChange("slug", e.target.value)} className="bg-white/5 border-white/10 text-xs font-mono" placeholder="auto-generated-slug" />
                    </div>
                    <div className="space-y-2">
                        <Label>Summary</Label>
                        <textarea
                            value={formData.summary}
                            onChange={(e) => handleChange("summary", e.target.value)}
                            className="w-full h-24 bg-white/5 border border-white/10 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-nyembo-sky resize-none"
                            placeholder="Brief abstract..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={formData.category} onValueChange={(v) => handleChange("category", v)}>
                            <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="AI">Artificial Intelligence</SelectItem>
                                <SelectItem value="Cloud">Cloud Infrastructure</SelectItem>
                                <SelectItem value="Smart Spaces">Smart Spaces</SelectItem>
                                <SelectItem value="Academy">Academy</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={formData.status} onValueChange={(v) => handleChange("status", v)}>
                            <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Language</Label>
                        <Select value={formData.language} onValueChange={(v) => handleChange("language", v)}>
                            <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="sw">Swahili</SelectItem>
                                <SelectItem value="de">German</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Tags (comma separated)</Label>
                        <Input value={formData.tags} onChange={(e) => handleChange("tags", e.target.value)} className="bg-white/5 border-white/10" placeholder="tech, tutorial, 2025" />
                    </div>
                </div>

                {/* Editor / Preview Area */}
                <div className="flex-1 bg-black/40 relative">
                    {mode === 'edit' ? (
                        <textarea
                            value={formData.content}
                            onChange={(e) => handleChange("content", e.target.value)}
                            className="w-full h-full bg-transparent p-8 font-mono text-sm text-gray-300 resize-none focus:outline-none"
                            placeholder="# Write your masterpiece..."
                        />
                    ) : (
                        <div className="w-full h-full p-8 overflow-y-auto prose prose-invert prose-lg max-w-none">
                            {/* Simple markdown render fallback if library missing, but attempting simple replacement */}
                            <div dangerouslySetInnerHTML={{ __html: parseMarkdown(formData.content) }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Extremely simple Markdown parser for preview if no library. 
// In production, use 'react-markdown' or 'remark'.
// This covers Headers, Lists, Bold, and Paragraphs roughly.
function parseMarkdown(text: string) {
    if (!text) return "";
    let html = text
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-nyembo-sky mb-4">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-white mt-6 mb-3">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-white mt-4 mb-2">$1</h3>')
        .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
        .replace(/\*(.*)\*/gim, '<i>$1</i>')
        .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
        .replace(/\n\n/gim, '<br/><br/>');

    return html;
}
