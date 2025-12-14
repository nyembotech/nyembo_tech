"use client";

import { useState } from "react";
import { useMatches } from "@/hooks/firestore/use-matches";
import { Match } from "@/types/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Calendar, MapPin, Trophy, Filter } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function MatchesPage() {
    const { matches, loading } = useMatches();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("upcoming");

    if (loading) return <div className="p-8 text-white">Loading Matches...</div>;

    const filteredMatches = matches.filter(match => {
        const matchesSearch =
            match.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
            match.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
            match.venue.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        const isUpcoming = match.status === "upcoming";
        return activeTab === "upcoming" ? isUpcoming : !isUpcoming;
    });

    return (
        <div className="p-6 space-y-6 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Matches & Results</h1>
                    <p className="text-muted-foreground">Manage your season schedule and match outcomes.</p>
                </div>
                <Button className="bg-gradient-to-r from-nyembo-gold to-orange-500 text-black font-bold hover:shadow-[0_0_20px_rgba(249,168,37,0.4)] transition-all">
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Match
                </Button>
            </div>

            {/* Controls */}
            <div className="glass-neumo p-4 rounded-xl flex flex-col md:flex-row gap-4 justify-between items-center">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                    <TabsList className="bg-[#121214] border border-white/5">
                        <TabsTrigger value="upcoming" className="data-[state=active]:bg-nyembo-gold data-[state=active]:text-black">Upcoming</TabsTrigger>
                        <TabsTrigger value="previous" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">Previous</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search team or venue..."
                        className="pl-10 bg-[#121214] border-white/10 text-white rounded-xl focus-visible:ring-nyembo-gold/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Empty State */}
            {filteredMatches.length === 0 && (
                <div className="border border-dashed border-white/10 rounded-2xl h-96 flex flex-col items-center justify-center text-center p-8 bg-white/5">
                    <Filter className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-xl font-medium text-white mb-2">No matches found</h3>
                    <p className="text-muted-foreground max-w-sm mb-6">
                        Try adjusting your search or add a new match to the schedule.
                    </p>
                    <Button variant="outline" className="border-white/10 hover:bg-white/5">Load Sample Data</Button>
                </div>
            )}

            {/* Match Cards */}
            <div className="grid gap-4">
                {filteredMatches.map((match) => (
                    <div key={match.id} className="group relative overflow-hidden bg-[#18181b] rounded-xl border border-white/5 p-6 hover:border-nyembo-gold/30 transition-all duration-300 hover:shadow-lg hover:shadow-black/50">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                            {/* Date & Venue */}
                            <div className="flex flex-col items-center md:items-start min-w-[150px]">
                                <div className="flex items-center gap-2 text-nyembo-gold font-bold text-lg">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(match.date.seconds * 1000).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                    <MapPin className="w-3 h-3" />
                                    {match.venue}
                                </div>
                            </div>

                            {/* Teams & Score */}
                            <div className="flex-1 flex items-center justify-center gap-8">
                                <div className="text-right">
                                    <h3 className="text-xl font-bold text-white group-hover:text-nyembo-sky transition-colors">{match.homeTeam}</h3>
                                    {match.status === "completed" && <p className="text-2xl font-mono text-white">{match.score?.home}</p>}
                                </div>

                                <div className="flex flex-col items-center">
                                    <span className="text-muted-foreground text-xs uppercase tracking-widest mb-1">VS</span>
                                    {match.status === "upcoming" ? (
                                        <div className="bg-white/5 px-3 py-1 rounded text-xs text-nyembo-gold border border-nyembo-gold/20">
                                            {new Date(match.date.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    ) : (
                                        <div className="w-px h-8 bg-white/10" />
                                    )}
                                </div>

                                <div className="text-left">
                                    <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors">{match.awayTeam}</h3>
                                    {match.status === "completed" && <p className="text-2xl font-mono text-white">{match.score?.away}</p>}
                                </div>
                            </div>

                            {/* Status */}
                            <div className="min-w-[100px] flex justify-end">
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-xs font-medium border",
                                    match.status === "upcoming" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                        match.status === "completed" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                                            "bg-gray-500/10 text-gray-400 border-gray-500/20"
                                )}>
                                    {match.status.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
