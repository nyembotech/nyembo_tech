"use client";

import { use } from "react";
import { PostEditor } from "@/components/admin/posts/post-editor";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const isNew = id === "new";

    // In real app, fetch data if !isNew
    const mockData = !isNew ? {
        id: "1",
        title: "The Future of AI-Driven System Architecture",
        slug: "future-of-ai-architecture",
        excerpt: "How autonomous agents are reshaping the way we design microservices boundaries and database schemas.",
        content: `Actual content would be here...`,
        coverImage: "",
        status: "published" as const,
        publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        author: "Nyembo Tech",
        tags: ["AI", "Architecture"]
    } : undefined;

    return <PostEditor initialData={mockData} isNew={isNew} />;
}
