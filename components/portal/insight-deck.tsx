"use client";

import { Zap } from "lucide-react";
import { Insight } from "@/hooks/use-portal-data";

interface InsightDeckProps {
    insights: Insight[];
}

export function InsightDeck({ insights }: InsightDeckProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-white pl-1">Mission Insights</h3>
            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
                {insights.map((insight) => (
                    <div key={insight.id} className="min-w-[300px] p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-nyembo-sky/30 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3 mb-3">
                            <Zap className="w-5 h-5 text-nyembo-yellow group-hover:text-white transition-colors" />
                            <span className="text-sm font-medium text-nyembo-sky">{insight.title}</span>
                        </div>
                        <p className="text-lg font-bold text-white mb-1">{insight.statistic}</p>
                        <p className="text-xs text-muted-foreground">{insight.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
