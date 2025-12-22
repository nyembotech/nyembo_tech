import { useState, useEffect } from "react";
import { subscribeToCollection, subscribeToDocument, createDocument, updateDocument, deleteDocument } from "@/services/firebase/database";
import { where, orderBy, QueryConstraint, Timestamp } from "firebase/firestore";
import { BlogPost } from "@/components/blog/blog-card"; // Reusing interface, or define here

// Extend BlogPost for Firestore if needed (e.g. timestamps)
export interface FirestorePost extends BlogPost {
    type: "post";
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export function usePosts() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const constraints: QueryConstraint[] = [
            where("type", "==", "post"),
            orderBy("publishedAt", "desc")
        ];

        const unsubscribe = subscribeToCollection<FirestorePost>(
            "content",
            constraints,
            (data) => {
                // Map Firestore data to BlogPost (if needed, but structure matches)
                setPosts(data);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching posts:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const createPost = async (data: Omit<BlogPost, "id">) => {
        return createDocument("content", {
            ...data,
            type: "post",
            createdAt: new Date(),
            updatedAt: new Date()
        });
    };

    const deletePost = async (id: string) => {
        return deleteDocument("content", id);
    };

    return { posts, loading, createPost, deletePost };
}

export function usePost(id?: string) {
    const [post, setPost] = useState<FirestorePost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id || id === "new") {
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToDocument<FirestorePost>(
            "content",
            id,
            (data) => {
                setPost(data);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching post:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [id]);

    const updatePost = async (id: string, data: Partial<BlogPost>) => {
        return updateDocument("content", id, {
            ...data,
            updatedAt: new Date()
        });
    };

    return { post, loading, updatePost };
}
