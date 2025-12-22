"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight } from "lucide-react";
import Image from "next/image";

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string;
    publishedAt: string;
    author: string;
    tags: string[];
    status?: "draft" | "published";
    content?: string;
    createdAt?: any;
    updatedAt?: any;
}

export function BlogCard({ post }: { post: BlogPost }) {
    return (
        <Card className="flex flex-col h-full bg-white/5 border-white/10 hover:border-nyembo-gold/50 transition-all duration-300 overflow-hidden group">
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src={post.coverImage || "/assets/images/blog-placeholder.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                    {post.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} className="bg-black/50 backdrop-blur-md border-white/20 text-xs">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>

            <CardHeader className="flex-1 space-y-2 p-5">
                <h3 className="text-xl font-bold text-white group-hover:text-nyembo-gold transition-colors line-clamp-2">
                    {post.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-3">
                    {post.excerpt}
                </p>
            </CardHeader>

            <CardFooter className="p-5 pt-0 flex justify-between items-center text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {post.publishedAt}
                    </span>
                </div>
                <Link
                    href={`/blog/${post.slug}`}
                    className="flex items-center gap-1 text-white hover:text-nyembo-gold transition-colors font-medium"
                >
                    Read <ArrowRight className="w-3 h-3" />
                </Link>
            </CardFooter>
        </Card>
    );
}
