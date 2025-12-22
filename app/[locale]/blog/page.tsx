import { BlogCard, BlogPost } from "@/components/blog/blog-card";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Insight Hub | Nyembo Tech",
    description: "Trends in AI Architecture, System Design, and Modern Development."
};

import { adminDb } from "@/lib/firebase-admin";

async function getPosts() {
    try {
        // Note: 'orderBy' might require a composite index in Firestore.
        // If it fails, check console and create link.
        const snapshot = await adminDb.collection("content")
            .where("type", "==", "post")
            .where("status", "==", "published")
            // .orderBy("publishedAt", "desc") // Commenting out to avoid index error initially
            .get();

        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BlogPost[];
    } catch (error) {
        console.error("Failed to fetch blog posts:", error);
        return [];
    }
}

export default async function BlogIndexPage() {
    const posts = await getPosts();
    return (
        <div className="min-h-screen bg-[#030711] pb-20">
            {/* Hero Section */}
            <div className="relative py-20 px-6 sm:px-12 lg:px-24 overflow-hidden">
                <div className="absolute inset-0 bg-nyembo-blue/5 z-0" />
                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Insights & <span className="text-nyembo-gold">Thoughts</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Exploring the intersection of AI, Design, and Scalable Infrastructure.
                    </p>
                </div>
            </div>

            {/* Posts Grid */}
            <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map(post => (
                    <BlogCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}
