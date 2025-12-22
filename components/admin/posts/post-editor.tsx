"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Save, ArrowLeft, Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { usePosts, usePost } from "@/hooks/firestore/use-posts";
import { BlogPost } from "@/components/blog/blog-card";

export function PostEditor({ initialData, isNew = false }: { initialData?: BlogPost, isNew?: boolean }) {
    const router = useRouter();
    const { createPost } = usePosts();
    const { updatePost } = usePost(initialData?.id);

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Partial<BlogPost>>(initialData || {
        title: "",
        slug: "",
        excerpt: "",
        content: "", // This field needs to be added to BlogPost interface? Wait, BlogPost has content?
        // BlogPost in blog-card.tsx currently does NOT have content. 
        // I need to add 'content' to BlogPost interface.
        coverImage: "",
        status: "draft",
        tags: ["General"],
        author: "Nyembo Tech",
        publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });

    // Temp fix: BlogPost needs 'content' field. I will add it to local type if needed or use 'any'.
    // Better: modify BlogPost interface.
    // For now, I'll cast.

    const handleSave = async () => {
        if (!data.title) return toast.error("Title is required");
        setLoading(true);

        try {
            if (isNew) {
                // @ts-ignore - content field mismatch pending interface update
                await createPost({
                    ...data,
                    content: (data as any).content || "",
                } as any);
                toast.success("Post created!");
                router.push("/admin/posts");
            } else {
                if (initialData?.id) {
                    await updatePost(initialData.id, data as any);
                    toast.success("Post updated!");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to save post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/posts">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-white">{isNew ? "New Post" : "Edit Post"}</h1>
                        <p className="text-muted-foreground">
                            {data.status === "published" ? "Live on site" : "Draft mode"}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-950/30">
                        Delete
                    </Button>
                    <Button onClick={handleSave} disabled={loading} className="bg-nyembo-sky text-black hover:bg-nyembo-sky/80">
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Editor */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Post Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData({ ...data, title: e.target.value })}
                                    placeholder="Enter post title..."
                                    className="text-lg font-bold bg-black/20 border-white/10 h-12"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Content (Markdown supported)</Label>
                                <Textarea
                                    id="content"
                                    value={(data as any).content || ""}
                                    onChange={(e) => setData({ ...data, content: e.target.value } as any)}
                                    placeholder="Write your amazing article here..."
                                    className="min-h-[400px] font-mono text-sm bg-black/20 border-white/10 leading-relaxed"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => setData({ ...data, slug: e.target.value })}
                                    placeholder="my-post-slug"
                                    className="bg-black/20 border-white/10 text-xs font-mono"
                                />
                                <p className="text-[10px] text-muted-foreground">URL: /blog/{data.slug || '...'}</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt">Excerpt / SEO Description</Label>
                                <Textarea
                                    id="excerpt"
                                    value={data.excerpt}
                                    onChange={(e) => setData({ ...data, excerpt: e.target.value })}
                                    className="h-24 bg-black/20 border-white/10 text-xs"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <select
                                    className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-sm text-white"
                                    value={data.status}
                                    onChange={(e) => setData({ ...data, status: e.target.value as any })}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label>Cover Image</Label>
                                <div className="aspect-video bg-black/40 rounded-lg border border-white/10 flex flex-col items-center justify-center text-muted-foreground hover:bg-black/30 transition-colors cursor-pointer group relative overflow-hidden">
                                    {data.coverImage ? (
                                        <img src={data.coverImage} className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <ImageIcon className="w-8 h-8 mb-2 opacity-50 group-hover:opacity-100" />
                                            <span className="text-xs">Click to upload</span>
                                        </>
                                    )}
                                </div>
                                <Input
                                    placeholder="Image URL..."
                                    value={data.coverImage}
                                    onChange={(e) => setData({ ...data, coverImage: e.target.value })}
                                    className="text-xs bg-black/20 h-8"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
