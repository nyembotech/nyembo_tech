"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Save, Eye, Plus, Trash2, Loader2 } from "lucide-react";
import { FuturisticPanel } from "@/components/ui/futuristic-panel";
import { Bot, Cloud, LayoutTemplate, Building2 } from "lucide-react";

// Mock data for initial load if Firestore is empty/fails
const initialData = {
    hero: {
        title: "Future-grade AI software for Africa.",
        subtitle: "European engineering standards met with African speed and agility.",
        ctaPrimary: "Launch a project",
        ctaSecondary: "Explore Solutions"
    },
    sections: [
        {
            key: "solutions",
            type: "cards",
            data: [
                { title: "AI Agents", subtitle: "Autonomous digital workers...", icon: "Bot", variant: "primary" },
                { title: "Cloud Modernization", subtitle: "Migrate legacy systems...", icon: "Cloud", variant: "ghost" }
            ]
        }
    ]
};

export default function ContentEditorPage() {
    const params = useParams();
    const pageId = params.pageId as string;
    const [content, setContent] = useState<any>(initialData);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        async function loadContent() {
            setLoading(true);
            try {
                const docRef = doc(db, "site_content", pageId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setContent(docSnap.data());
                } else {
                    // Use initial data if doc doesn't exist
                    console.log("No such document, using initial data");
                }
            } catch (e) {
                console.error("Error loading document: ", e);
            } finally {
                setLoading(false);
            }
        }
        loadContent();
    }, [pageId]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, "site_content", pageId), content);
            setHasUnsavedChanges(false);
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setSaving(false);
        }
    };

    const updateHero = (field: string, value: string) => {
        setContent((prev: any) => ({
            ...prev,
            hero: { ...prev.hero, [field]: value }
        }));
        setHasUnsavedChanges(true);
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Content Editor: <span className="text-nyembo-sky capitalize">{pageId}</span></h1>
                    <p className="text-muted-foreground">Manage content for the {pageId} page.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        <Eye className="mr-2 h-4 w-4" /> Preview
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className={`bg-nyembo-yellow text-black hover:bg-nyembo-gold shadow-neumo transition-all ${hasUnsavedChanges ? "animate-pulse shadow-[0_0_20px_rgba(246,227,15,0.5)]" : ""}`}
                    >
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 h-full min-h-0">
                {/* Editor Column */}
                <div className="space-y-6 overflow-y-auto pr-2 pb-20">
                    {/* Hero Section Editor */}
                    <Card className="bg-card/30 border-sidebar-border shadow-neumo">
                        <CardHeader>
                            <CardTitle className="text-white">Hero Section</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    value={content.hero?.title || ""}
                                    onChange={(e) => updateHero("title", e.target.value)}
                                    className="bg-sidebar-accent/50 border-sidebar-border"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Subtitle</Label>
                                <Textarea
                                    value={content.hero?.subtitle || ""}
                                    onChange={(e) => updateHero("subtitle", e.target.value)}
                                    className="bg-sidebar-accent/50 border-sidebar-border"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Primary CTA</Label>
                                    <Input
                                        value={content.hero?.ctaPrimary || ""}
                                        onChange={(e) => updateHero("ctaPrimary", e.target.value)}
                                        className="bg-sidebar-accent/50 border-sidebar-border"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Secondary CTA</Label>
                                    <Input
                                        value={content.hero?.ctaSecondary || ""}
                                        onChange={(e) => updateHero("ctaSecondary", e.target.value)}
                                        className="bg-sidebar-accent/50 border-sidebar-border"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dynamic Sections */}
                    {content.sections?.map((section: any, idx: number) => (
                        <Card key={idx} className="bg-card/30 border-sidebar-border shadow-neumo relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-nyembo-sky" />
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-white capitalize">{section.key} Section</CardTitle>
                                <Badge variant="outline" className="border-nyembo-sky text-nyembo-sky">{section.type}</Badge>
                            </CardHeader>
                            <CardContent>
                                {section.type === "cards" && (
                                    <div className="space-y-4">
                                        {section.data.map((item: any, itemIdx: number) => (
                                            <div key={itemIdx} className="p-4 rounded-xl bg-sidebar-accent/30 border border-sidebar-border flex items-start justify-between gap-4">
                                                <div className="space-y-2 flex-1">
                                                    <Input
                                                        value={item.title}
                                                        onChange={(e) => {
                                                            const newSections = [...content.sections];
                                                            newSections[idx].data[itemIdx].title = e.target.value;
                                                            setContent({ ...content, sections: newSections });
                                                            setHasUnsavedChanges(true);
                                                        }}
                                                        className="h-8 bg-transparent border-none p-0 text-white font-bold focus-visible:ring-0"
                                                    />
                                                    <Textarea
                                                        value={item.subtitle}
                                                        onChange={(e) => {
                                                            const newSections = [...content.sections];
                                                            newSections[idx].data[itemIdx].subtitle = e.target.value;
                                                            setContent({ ...content, sections: newSections });
                                                            setHasUnsavedChanges(true);
                                                        }}
                                                        className="bg-transparent border-none p-0 text-sm text-muted-foreground focus-visible:ring-0 min-h-[40px]"
                                                    />
                                                </div>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button variant="outline" className="w-full border-dashed border-sidebar-border text-muted-foreground hover:text-white hover:border-white/20">
                                            <Plus className="mr-2 h-4 w-4" /> Add Card
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Live Preview Column */}
                <div className="bg-black rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-2xl">
                    <div className="bg-white/5 p-3 border-b border-white/10 flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <div className="flex-1 text-center text-xs text-muted-foreground font-mono bg-black/50 rounded py-1">
                            nyembotech.com/{pageId}
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto bg-background p-8 relative">
                        {/* Preview Content */}
                        <div className="space-y-12 scale-90 origin-top">
                            <div className="text-center space-y-4">
                                <h1 className="text-4xl font-bold text-white">{content.hero?.title}</h1>
                                <p className="text-muted-foreground">{content.hero?.subtitle}</p>
                                <div className="flex justify-center gap-4">
                                    <Button className="bg-nyembo-yellow text-black">{content.hero?.ctaPrimary}</Button>
                                    <Button variant="outline" className="border-nyembo-sky text-nyembo-sky">{content.hero?.ctaSecondary}</Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {content.sections?.[0]?.data?.map((item: any, idx: number) => (
                                    <FuturisticPanel
                                        key={idx}
                                        title={item.title}
                                        subtitle={item.subtitle}
                                        icon={item.icon === "Bot" ? Bot : item.icon === "Cloud" ? Cloud : LayoutTemplate}
                                        variant={item.variant}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
