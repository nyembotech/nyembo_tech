"use client";

import { useSiteContent } from "@/hooks/use-site-content";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function IndustriesPage() {
    const { content, loading } = useSiteContent('industries');
    const data = content?.hero || {};
    const industries = content?.industries || [];

    if (loading) return <div className="min-h-screen bg-[#030912] flex items-center justify-center text-white/50">Loading Industries...</div>;

    return (
        <div className="min-h-screen bg-[#030912] text-white pt-24 pb-20">
            <div className="relative h-[400px] w-full mb-16 overflow-hidden">
                {data.image ? (
                    <div className="absolute inset-0">
                        <Image
                            src={data.image}
                            alt="Industries"
                            fill
                            className="object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#030912] via-[#030912]/50 to-transparent" />
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-nyembo-sky/10" />
                )}

                <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-end px-4 pb-12">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">{data.title || "Industries"}</h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-2xl">{data.subtitle || "Exploring our impact across sectors."}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {industries.map((ind: any, idx: number) => (
                        <Dialog key={idx}>
                            <DialogTrigger asChild>
                                <div className="group relative bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all cursor-pointer hover:border-nyembo-sky/50 hover:shadow-lg hover:shadow-nyembo-sky/10 flex flex-col h-full">
                                    <h3 className="text-2xl font-bold text-nyembo-yellow mb-4 group-hover:text-white transition-colors">{ind.title}</h3>
                                    <p className="text-base text-gray-400 mb-6 line-clamp-4 leading-relaxed">{ind.description}</p>
                                    <div className="flex items-center text-sm text-nyembo-sky font-mono mt-auto pt-6 border-t border-white/5 uppercase tracking-widest">
                                        View Details <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="bg-[#0c131c] border-white/10 text-white max-w-2xl max-h-[85vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black text-nyembo-yellow">{ind.title}</DialogTitle>
                                    <DialogDescription className="text-gray-400 text-lg mt-2">
                                        {ind.description}
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-6 mt-6">
                                    {ind.keyPains && (
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-bold uppercase tracking-widest text-red-400/80">Challenges</h4>
                                            <ul className="space-y-2">
                                                {ind.keyPains.map((pain: string, i: number) => (
                                                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-1.5 shrink-0" />
                                                        {pain}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {ind.whatNyembotechDelivers && (
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-bold uppercase tracking-widest text-green-400/80">Nyembotech Solution</h4>
                                            <ul className="space-y-2">
                                                {ind.whatNyembotechDelivers.map((sol: string, i: number) => (
                                                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                                                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                                        {sol}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {ind.signatureSolution && (
                                        <div className="bg-nyembo-sky/5 border border-nyembo-sky/20 rounded-xl p-4 mt-6">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-nyembo-sky mb-2">Signature Build</h4>
                                            <p className="text-sm text-white/90 italic">
                                                "{ind.signatureSolution}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>
            </div>
        </div>
    )
}
