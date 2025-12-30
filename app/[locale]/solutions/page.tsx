"use client";

import { useSiteContent } from "@/hooks/use-site-content";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function SolutionsPage() {
    const { content, loading } = useSiteContent('solutions');
    const data = content?.hero || {};
    // Depending on JSON, might be 'solutions' or 'services'
    const solutionsList = content?.solutions || content?.services || [];

    if (loading) return <div className="min-h-screen bg-[#030912] flex items-center justify-center text-white/50">Loading Solutions...</div>;

    return (
        <div className="min-h-screen bg-[#030912] text-white pt-24 pb-20">
            <div className="relative h-[400px] w-full mb-16 overflow-hidden">
                {data.image ? (
                    <div className="absolute inset-0">
                        <Image
                            src={data.image}
                            alt="Solutions"
                            fill
                            className="object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#030912] via-[#030912]/50 to-transparent" />
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-nyembo-yellow/5" />
                )}

                <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-end px-4 pb-12">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 text-white">{data.title || "Solutions"}</h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-2xl">{data.subtitle || "Future-proof engineering for scale."}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <div className="grid gap-8">
                    {solutionsList.map((sol: any, idx: number) => (
                        <div key={idx} className="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all flex flex-col md:flex-row">
                            {/* Content Side */}
                            <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
                                <h3 className="text-3xl font-bold text-white mb-4">{sol.title}</h3>
                                <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-xl">{sol.description}</p>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="self-start px-6 py-3 rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors flex items-center gap-2 font-medium">
                                            Learn More <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-[#0c131c] border-white/10 text-white max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-bold">{sol.title}</DialogTitle>
                                            <DialogDescription className="text-gray-400 mt-2">{sol.description}</DialogDescription>
                                        </DialogHeader>
                                        <div className="mt-4 space-y-4 text-gray-300">
                                            {/* Render features or details if available */}
                                            {sol.features && (
                                                <ul className="list-disc pl-5 space-y-1">
                                                    {sol.features.map((feat: string, i: number) => (
                                                        <li key={i}>{feat}</li>
                                                    ))}
                                                </ul>
                                            )}
                                            {/* Fallback info */}
                                            {!sol.features && <p>Detailed solution architecture and capabilities available upon request.</p>}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {/* Image or Visual Side */}
                            <div className="w-full md:w-2/5 min-h-[300px] relative bg-gradient-to-br from-white/5 to-white/0 border-l border-white/5">
                                {sol.image ? (
                                    <Image src={sol.image} alt={sol.title} fill className="object-cover opacity-80 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-white/5 font-black text-9xl overflow-hidden select-none">
                                        {idx + 1}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
