"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Copy, Globe, ArrowRight, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const LANGUAGES = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "sw", name: "Swahili", flag: "🇰🇪" },
    { code: "de", name: "German", flag: "🇩🇪" }
];

export default function TranslationStudioPage() {
    const [sourceText, setSourceText] = useState("");
    const [sourceLang, setSourceLang] = useState("en");
    const [targetLangs, setTargetLangs] = useState<string[]>(["sw", "de"]);
    const [translations, setTranslations] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const toggleTargetLang = (code: string) => {
        if (targetLangs.includes(code)) {
            setTargetLangs(targetLangs.filter(l => l !== code));
        } else {
            setTargetLangs([...targetLangs, code]);
        }
    };

    const handleTranslate = async () => {
        if (!sourceText.trim()) {
            toast.error("Please enter text to translate.");
            return;
        }
        if (targetLangs.length === 0) {
            toast.error("Please select at least one target language.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: sourceText,
                    sourceLang,
                    targetLangs
                }),
            });

            if (!response.ok) throw new Error("Translation failed");
            const data = await response.json();
            setTranslations(data.translations || {});
            toast.success("Translation complete!");
        } catch (error) {
            console.error(error);
            toast.error("Translation failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-yellow-500 flex items-center gap-2">
                        <Globe className="w-8 h-8" />
                        Translation Studio
                    </h1>
                    <p className="text-gray-400">AI-powered localization for Nyembotech content.</p>
                </div>
                <Button
                    onClick={handleTranslate}
                    disabled={loading || !sourceText}
                    className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:scale-105"
                >
                    {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Translating...</> : <><Sparkles className="w-4 h-4 mr-2" /> Generate Translations</>}
                </Button>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
                {/* SOURCE PANEL */}
                <Card className="bg-black/40 border-white/10 flex flex-col backdrop-blur-sm">
                    <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                        <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Source</span>
                        <div className="flex gap-2">
                            {LANGUAGES.map(lang => (
                                <button
                                    key={lang.code}
                                    onClick={() => setSourceLang(lang.code)}
                                    className={`px-3 py-1 text-xs rounded-full transition-all border ${sourceLang === lang.code
                                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                                            : "bg-white/5 text-gray-500 border-transparent hover:bg-white/10"
                                        }`}
                                >
                                    {lang.flag} {lang.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <CardContent className="flex-1 p-0">
                        <Textarea
                            value={sourceText}
                            onChange={(e) => setSourceText(e.target.value)}
                            placeholder="Enter text to translate..."
                            className="w-full h-full min-h-[300px] resize-none border-0 bg-transparent text-lg p-6 focus-visible:ring-0 placeholder:text-gray-600"
                        />
                    </CardContent>
                </Card>

                {/* TARGET PANEL */}
                <div className="flex flex-col gap-4 overflow-y-auto pr-2">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-400">Target Languages:</span>
                        {LANGUAGES.filter(l => l.code !== sourceLang).map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => toggleTargetLang(lang.code)}
                                className={`px-3 py-1 text-xs rounded-full transition-all border flex items-center gap-1 ${targetLangs.includes(lang.code)
                                        ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                                        : "bg-white/5 text-gray-500 border-transparent hover:bg-white/10"
                                    }`}
                            >
                                {lang.flag} {lang.name}
                                {targetLangs.includes(lang.code) && <Check className="w-3 h-3 ml-1" />}
                            </button>
                        ))}
                    </div>

                    {translations && Object.keys(translations).length > 0 ? (
                        Object.entries(translations).map(([langCode, text]) => {
                            const lang = LANGUAGES.find(l => l.code === langCode);
                            return (
                                <Card key={langCode} className="bg-white/5 border-blue-500/20 group hover:border-blue-500/40 transition-colors">
                                    <div className="p-3 border-b border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">{lang?.flag}</span>
                                            <span className="font-semibold text-blue-300">{lang?.name}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => copyToClipboard(text)}
                                            className="h-7 text-xs text-gray-400 hover:text-white"
                                        >
                                            <Copy className="w-3 h-3 mr-1" /> Copy
                                        </Button>
                                    </div>
                                    <CardContent className="p-4">
                                        <p className="whitespace-pre-wrap text-gray-200 leading-relaxed font-light">
                                            {text}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl text-gray-500">
                            <Sparkles className="w-12 h-12 mb-4 opacity-50" />
                            <p>Select targets and click generate to see AI magic.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
