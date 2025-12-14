"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Direct import for flexibility
import { PageContent } from "@/types/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, LayoutTemplate, Plus, Trash2, Eye, MonitorPlay } from "lucide-react";
import { updateDocument } from "@/services/firebase/database";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock Preview Components (In a real app, import actual components)
const PreviewHero = ({ data }: { data: any }) => (
    <div className="bg-black text-white p-10 text-center border-b border-white/10">
        <h1 className="text-4xl font-bold mb-4">{data.title || "Hero Title"}</h1>
        <p className="text-xl text-muted-foreground mb-6">{data.subtitle || "Hero Subtitle"}</p>
        <div className="flex gap-4 justify-center">
            {data.ctaPrimary && <Button>{data.ctaPrimary}</Button>}
            {data.ctaSecondary && <Button variant="outline">{data.ctaSecondary}</Button>}
        </div>
    </div>
);

export function ContentEditor({ pageId }: { pageId: string }) {
    const [content, setContent] = useState<PageContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [showPreview, setShowPreview] = useState(true);
    const [editorLocale, setEditorLocale] = useState("en"); // en, de, sw

    // Computed Document ID based on locale
    // English is default (no suffix) for backward compatibility, or strictly use suffixes?
    // Let's use suffix for non-default: pageId (en), pageId_de (de), pageId_sw (sw)
    const activeDocId = editorLocale === "en" ? pageId : `${pageId}_${editorLocale}`;

    // Initial load & Realtime sync
    useEffect(() => {
        setLoading(true); // Show loading when switching doc
        const unsubscribe = onSnapshot(doc(db, "site_content", activeDocId), (docSnap) => {
            if (docSnap.exists()) {
                if (!hasUnsavedChanges) {
                    setContent(docSnap.data() as PageContent);
                }
            } else {
                // Initialize empty if new
                setContent({
                    id: activeDocId, // Use active ID
                    hero: { title: "", subtitle: "", ctaPrimary: "Start Now", ctaSecondary: "Learn More" },
                    sections: [],
                    createdAt: undefined as any,
                    updatedAt: undefined as any
                });
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [activeDocId, hasUnsavedChanges]);

    const handleSave = async () => {
        if (!content) return;
        setSaving(true);
        try {
            await setDoc(doc(db, "site_content", activeDocId), {
                ...content,
                id: activeDocId, // Ensure ID matches
                updatedAt: new Date() // Firestore timestamp
            }, { merge: true });

            setHasUnsavedChanges(false);
            toast.success("Changes saved successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save changes");
        } finally {
            setSaving(false);
        }
    };

    const updateHero = (field: string, value: string) => {
        if (!content) return;
        setContent({
            ...content,
            hero: { ...content.hero, [field]: value }
        });
        setHasUnsavedChanges(true);
    };

    const addSection = () => {
        if (!content) return;
        const newSection = {
            key: `section-${Date.now()}`,
            type: "text",
            title: "New Section",
            description: "Section description",
            data: {}
        };
        setContent({
            ...content,
            // @ts-ignore
            sections: [...(content.sections || []), newSection]
        });
        setHasUnsavedChanges(true);
    };

    const updateSection = (index: number, field: string, value: string) => {
        if (!content) return;
        const newSections = [...content.sections];
        newSections[index] = { ...newSections[index], [field]: value };
        setContent({ ...content, sections: newSections });
        setHasUnsavedChanges(true);
    };

    const removeSection = (index: number) => {
        if (!content) return;
        const newSections = [...content.sections];
        newSections.splice(index, 1);
        setContent({ ...content, sections: newSections });
        setHasUnsavedChanges(true);
    };


    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-nyembo-sky" /></div>;
    if (!content) return <div>Error loading content</div>;

    return (
        <div className="flex h-full bg-[#09090b] text-white">
            {/* Editor Console */}
            <div className={cn("flex-1 flex flex-col h-full border-r border-white/10 overflow-hidden transition-all duration-300", showPreview ? "w-1/2" : "w-full")}>

                {/* Toolbar */}
                <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0c0c0e]">
                    <h2 className="font-bold flex items-center gap-2">
                        <LayoutTemplate className="w-4 h-4 text-nyembo-sky" />
                        Edit: {pageId}
                    </h2>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => setShowPreview(!showPreview)}
                            variant="ghost"
                            size="sm"
                            className={showPreview ? "text-nyembo-sky" : "text-muted-foreground"}
                        >
                            <MonitorPlay className="w-4 h-4 mr-2" />
                            {showPreview ? "Hide Preview" : "Show Preview"}
                        </Button>

                        {/* Language Selector */}
                        <div className="flex bg-[#121214] rounded-lg p-1 border border-white/10">
                            {(["en", "de", "sw"] as const).map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => !hasUnsavedChanges ? setEditorLocale(lang) : toast.error("Save changes before switching language")}
                                    className={cn(
                                        "px-3 py-1 rounded text-xs font-bold uppercase transition-all",
                                        editorLocale === lang ? "bg-nyembo-sky text-black shadow-sm" : "text-muted-foreground hover:text-white"
                                    )}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>

                        <Button
                            onClick={handleSave}
                            disabled={!hasUnsavedChanges || saving}
                            className={cn(
                                "relative overflow-hidden transition-all",
                                hasUnsavedChanges ? "bg-nyembo-sky text-black hover:bg-nyembo-sky/90 shadow-[0_0_20px_rgba(56,189,248,0.3)]" : "bg-white/10 text-muted-foreground"
                            )}
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            {hasUnsavedChanges ? "Save Changes" : "Saved"}
                        </Button>
                    </div>
                </div>

                {/* Scrollable Form */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* Hero Section */}
                    <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 relative group overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-nyembo-sky/20 group-hover:bg-nyembo-sky transition-colors" />
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                            <span className="w-2 h-2 rounded-full bg-nyembo-sky" />
                            Hero Section
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    value={content.hero.title}
                                    onChange={(e) => updateHero("title", e.target.value)}
                                    className="bg-black/50 border-white/10 focus-visible:ring-nyembo-sky/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Subtitle</Label>
                                <Textarea
                                    value={content.hero.subtitle}
                                    onChange={(e) => updateHero("subtitle", e.target.value)}
                                    className="bg-black/50 border-white/10 focus-visible:ring-nyembo-sky/50 min-h-[100px]"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Primary CTA</Label>
                                    <Input
                                        value={content.hero.ctaPrimary}
                                        onChange={(e) => updateHero("ctaPrimary", e.target.value)}
                                        className="bg-black/50 border-white/10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Secondary CTA</Label>
                                    <Input
                                        value={content.hero.ctaSecondary || ""}
                                        onChange={(e) => updateHero("ctaSecondary", e.target.value)}
                                        className="bg-black/50 border-white/10"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Sections */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">Content Sections</h3>
                            <Button onClick={addSection} size="sm" variant="outline" className="border-dashed border-white/20 hover:border-nyembo-sky/50">
                                <Plus className="w-4 h-4 mr-2" /> Add Section
                            </Button>
                        </div>

                        {content.sections?.map((section, index) => (
                            <div key={section.key} className="bg-[#121214] border border-white/5 rounded-2xl p-6 relative group transition-all hover:border-white/10">
                                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" onClick={() => removeSection(index)} className="hover:text-red-500 hover:bg-red-500/10">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-12 gap-6">
                                    <div className="col-span-12 md:col-span-4 space-y-4">
                                        <div className="space-y-2">
                                            <Label>Section Title</Label>
                                            <Input
                                                value={section.title || ""}
                                                onChange={(e) => updateSection(index, "title", e.target.value)}
                                                className="bg-black/50 border-white/10"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Type</Label>
                                            <select
                                                value={section.type}
                                                onChange={(e) => updateSection(index, "type", e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-sm text-white"
                                            >
                                                <option value="text">Text Block</option>
                                                <option value="cards">Feature Cards</option>
                                                <option value="timeline">Timeline</option>
                                                <option value="grid">Grid Layout</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-span-12 md:col-span-8">
                                        <div className="space-y-2">
                                            <Label>Description / Content</Label>
                                            <Textarea
                                                value={section.description || ""}
                                                onChange={(e) => updateSection(index, "description", e.target.value)}
                                                className="bg-black/50 border-white/10 min-h-[120px]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Live Preview Panel */}
            {showPreview && (
                <div className="flex-1 bg-black border-l border-white/10 overflow-hidden flex flex-col">
                    <div className="h-10 bg-[#121214] border-b border-white/10 flex items-center px-4 text-xs text-muted-foreground select-none">
                        <span className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                        <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
                        <span className="w-3 h-3 rounded-full bg-green-500 mr-4" />
                        Preview Mode - {pageId}
                    </div>
                    <div className="flex-1 overflow-y-auto bg-black scrollbar-hide">
                        {/* Render Preview Components */}
                        <PreviewHero data={content.hero} />

                        {/* Render Section Previews */}
                        <div className="p-10 space-y-20">
                            {content.sections?.map((section) => (
                                <div key={section.key} className="text-center">
                                    <h2 className="text-3xl font-bold text-white mb-4">{section.title}</h2>
                                    <p className="text-muted-foreground max-w-2xl mx-auto">{section.description}</p>
                                    <div className="mt-4 text-xs text-white/20 uppercase tracking-widest border border-dashed border-white/20 p-4 rounded-lg inline-block">
                                        Type: {section.type} (Placeholder)
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
