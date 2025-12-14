"use client";

import { useState, useEffect } from "react";

export interface Program {
    id: string;
    title: string;
    description: string;
    duration: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    format: "Online" | "In-Person" | "Hybrid";
    nextDate: string;
    category: "Engineers" | "Business" | "Leadership";
}

export function useAcademyData() {
    const [loading, setLoading] = useState(true);
    const [programs, setPrograms] = useState<Program[]>([]);

    useEffect(() => {
        // Simulate API fetch
        setTimeout(() => {
            setPrograms([
                {
                    id: "1",
                    title: "AI Engineering Bootcamp",
                    description: "Master the fundamentals of LLMs, RAG, and agentic workflows.",
                    duration: "12 Weeks",
                    level: "Advanced",
                    format: "Hybrid",
                    nextDate: "Jan 15, 2026",
                    category: "Engineers"
                },
                {
                    id: "2",
                    title: "Full-Stack React & Next.js",
                    description: "Build modern, scalable web applications with the T3 stack.",
                    duration: "8 Weeks",
                    level: "Intermediate",
                    format: "Online",
                    nextDate: "Feb 01, 2026",
                    category: "Engineers"
                },
                {
                    id: "3",
                    title: "AI for Business Strategy",
                    description: "Learn how to leverage AI to drive business growth and efficiency.",
                    duration: "4 Weeks",
                    level: "Beginner",
                    format: "Online",
                    nextDate: "Jan 20, 2026",
                    category: "Business"
                },
                {
                    id: "4",
                    title: "Product Management in AI Era",
                    description: "Frameworks for managing AI-driven products and teams.",
                    duration: "6 Weeks",
                    level: "Intermediate",
                    format: "In-Person",
                    nextDate: "March 10, 2026",
                    category: "Business"
                },
                {
                    id: "5",
                    title: "Executive AI Leadership",
                    description: "Strategic decision making and governance for C-Suite executives.",
                    duration: "3 Days",
                    level: "Advanced",
                    format: "In-Person",
                    nextDate: "Feb 15, 2026",
                    category: "Leadership"
                }
            ]);
            setLoading(false);
        }, 800);
    }, []);

    return { programs, loading };
}
