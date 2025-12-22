import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Mock Fetch Function
async function getPost(slug: string) {
    // In real app: fetch from Firestore where slug == params.slug
    return {
        id: "1",
        slug: slug,
        title: "The Future of AI-Driven System Architecture",
        excerpt: "How autonomous agents are reshaping the way we design microservices boundaries and database schemas.",
        content: `
            <p>The landscape of software architecture is undergoing a seismic shift. As AI agents become more capable, the traditional role of the software architect is evolving from "builder" to "orchestrator".</p>
            
            <h2>The Age of Agentic Workflows</h2>
            <p>Agents don't just write code; they plan it. By analyzing requirements and existing infrastructure, AI can propose optimal microservices boundaries that humans might miss due to cognitive load limits.</p>

            <blockquote>"The architect of the future manages intelligence, not just interfaces."</blockquote>

            <h2>Adaptive Schemas</h2>
            <p>Imagine a database schema that self-optimizes based on query patterns identified by an AI monitor. This isn't science fiction; it's the next step in adaptive infrastructure.</p>
        `,
        coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80",
        publishedAt: "Dec 15, 2024",
        author: "Nyembo Tech",
        tags: ["AI", "Architecture"]
    };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);
    if (!post) return { title: "Post Not Found" };
    return {
        title: `${post.title} | Nyembo Tech Blog`,
        description: post.excerpt,
        openGraph: {
            images: [post.coverImage]
        }
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPost(slug);
    if (!post) return notFound();

    return (
        <article className="min-h-screen bg-[#030711] pb-24">
            {/* Header / Hero */}
            <div className="relative h-[400px] w-full">
                <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030711] via-black/50 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-12 lg:p-24 max-w-5xl mx-auto">
                    <Link href="/blog" className="inline-flex items-center text-sm text-gray-300 hover:text-white mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Insights
                    </Link>

                    <div className="flex gap-2 mb-4">
                        {post.tags.map(tag => (
                            <Badge key={tag} className="bg-nyembo-gold/20 text-nyembo-gold border-nyembo-gold/30">
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4 shadow-lg">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-6 text-gray-300 text-sm">
                        <span className="flex items-center gap-2">
                            <User className="w-4 h-4" /> {post.author}
                        </span>
                        <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> {post.publishedAt}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-3xl mx-auto px-6 mt-12">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-8">
                    <p className="text-xl text-muted-foreground italic font-light">
                        {post.excerpt}
                    </p>
                    {/* Share Button Placeholder */}
                    <Button variant="outline" size="icon" className="shrink-0 ml-4 rounded-full border-white/20 hover:bg-white/10">
                        <Share2 className="w-4 h-4" />
                    </Button>
                </div>

                <div
                    className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-nyembo-blue hover:prose-a:text-blue-400 prose-blockquote:border-l-nyembo-gold prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </div>
        </article>
    );
}
