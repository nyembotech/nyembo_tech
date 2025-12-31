import { useState, useEffect } from "react";
import { KnowledgeArticle } from "@/types/firestore";
import { subscribeToCollection, createDocument, updateDocument, deleteDocument } from "@/services/firebase/database";
import { where, orderBy, QueryConstraint } from "firebase/firestore";

interface UseKnowledgeArticlesFilters {
    category?: string;
    status?: KnowledgeArticle["status"];
    language?: string;
    slug?: string;
}

export function useKnowledgeArticles(filters?: UseKnowledgeArticlesFilters) {
    const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const constraints: QueryConstraint[] = [orderBy("publishedAt", "desc")];

        if (filters?.category) {
            constraints.push(where("category", "==", filters.category));
        }
        if (filters?.status) {
            constraints.push(where("status", "==", filters.status));
        }
        if (filters?.language) {
            constraints.push(where("language", "==", filters.language));
        }
        // Note: slug query usually needs a separate index or is done via a separate 'get' if unique, 
        // but for a list filter this works if we want exact match in list.
        if (filters?.slug) {
            constraints.push(where("slug", "==", filters.slug));
        }

        const unsubscribe = subscribeToCollection<KnowledgeArticle>(
            "knowledge_articles",
            constraints,
            (data) => {
                setArticles(data);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching articles:", err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [filters?.category, filters?.status, filters?.language, filters?.slug]);

    const addArticle = async (data: Omit<KnowledgeArticle, "id" | "createdAt" | "updatedAt">) => {
        return createDocument("knowledge_articles", data);
    };

    const updateArticle = async (id: string, data: Partial<KnowledgeArticle>) => {
        return updateDocument("knowledge_articles", id, data);
    };

    const deleteArticle = async (id: string) => {
        return deleteDocument("knowledge_articles", id);
    };

    return { articles, loading, error, addArticle, updateArticle, deleteArticle };
}
