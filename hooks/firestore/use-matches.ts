"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Match } from "@/types/firestore";

export function useMatches() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const q = query(collection(db, "matches"), orderBy("date", "asc"));

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const matchesData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Match[];

                // FALLBACK: If no matches found, show the requested sample match
                if (matchesData.length === 0) {
                    const sampleMatch: Match = {
                        id: "sample-match-1",
                        homeTeam: "Dar City",
                        awayTeam: "Nyembo Tech",
                        venue: "UDSM Arena",
                        status: "upcoming",
                        date: { seconds: new Date("2025-12-23T20:38:00").getTime() / 1000, nanoseconds: 0 } as any,
                        ticketLink: "/tickets/match-001",
                        createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
                        updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any
                    };
                    setMatches([sampleMatch]);
                } else {
                    setMatches(matchesData);
                }
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching matches:", err);
                // Fallback on error too
                const sampleMatch: Match = {
                    id: "sample-match-1",
                    homeTeam: "Dar City",
                    awayTeam: "Nyembo Tech",
                    venue: "UDSM Arena",
                    status: "upcoming",
                    date: { seconds: new Date("2025-12-23T20:38:00").getTime() / 1000, nanoseconds: 0 } as any,
                    ticketLink: "/tickets/match-001",
                    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
                    updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any
                };
                setMatches([sampleMatch]);
                setLoading(false); // Do not show error state, show sample
            }
        );

        return () => unsubscribe();
    }, []);

    return { matches, loading, error };
}
