"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useLocale } from "next-intl";

export function useSiteContent(section: string) {
    const locale = useLocale();
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Construct doc ID
        // If locale is 'en', seed script saves to 'section'
        // If locale is other, seed script saves to 'section_locale'
        const docId = locale === 'en' ? section : `${section}_${locale}`;

        const unsubscribe = onSnapshot(doc(db, "site_content", docId), (doc) => {
            if (doc.exists()) {
                setContent(doc.data());
            } else {
                console.warn(`No content found in DB for ${docId}`);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching site content:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [section, locale]);

    return { content, loading };
}
