"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Program } from "@/hooks/use-academy-data";
import { ProgramCard } from "@/components/academy/program-card";

interface ProgramTabsProps {
    programs: Program[];
}

export function ProgramTabs({ programs }: ProgramTabsProps) {
    const categories = ["Engineers", "Business", "Leadership"];

    return (
        <section className="container px-4 py-16 -mt-10 relative z-10">
            <Tabs defaultValue="Engineers" className="w-full">
                <div className="flex justify-center mb-12">
                    <TabsList className="bg-black/50 border border-white/10 backdrop-blur-xl p-1 h-auto rounded-full">
                        {categories.map((category) => (
                            <TabsTrigger
                                key={category}
                                value={category}
                                className="rounded-full px-8 py-3 text-lg data-[state=active]:bg-nyembo-sky data-[state=active]:text-black text-white hover:text-white/80 transition-all"
                            >
                                {category}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {categories.map((category) => (
                    <TabsContent key={category} value={category}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {programs
                                .filter((p) => p.category === category)
                                .map((program, index) => (
                                    <ProgramCard key={program.id} program={program} index={index} />
                                ))}

                            {programs.filter((p) => p.category === category).length === 0 && (
                                <div className="col-span-full text-center py-20 text-muted-foreground">
                                    No programs currently available for this track.
                                </div>
                            )}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </section>
    );
}
