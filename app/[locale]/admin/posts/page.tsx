"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { usePosts } from "@/hooks/firestore/use-posts";

export default function AdminPostsPage() {
    const { posts, loading } = usePosts();

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Posts</h1>
                    <p className="text-muted-foreground">Manage your blog articles and content.</p>
                </div>
                <Link href="/admin/posts/new">
                    <Button className="bg-nyembo-sky text-black hover:bg-nyembo-sky/80">
                        <Plus className="w-4 h-4 mr-2" /> New Post
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search posts..." className="pl-9 bg-white/5 border-white/10" />
                </div>
                <Button variant="outline" className="text-gray-400 bg-white/5 border-white/10">
                    <Filter className="w-4 h-4 mr-2" /> Filter
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border border-white/10 bg-black/20 overflow-hidden">
                <Table>
                    <TableHeader className="bg-white/5">
                        <TableRow className="border-white/10 hover:bg-transparent">
                            <TableHead className="text-gray-400">Title</TableHead>
                            <TableHead className="text-gray-400">Status</TableHead>
                            <TableHead className="text-gray-400">Author</TableHead>
                            <TableHead className="text-gray-400">Date</TableHead>
                            <TableHead className="text-right text-gray-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <div className="flex justify-center items-center">
                                        <Loader2 className="w-6 h-6 animate-spin text-nyembo-sky" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : posts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No posts found. Create your first one!
                                </TableCell>
                            </TableRow>
                        ) : (
                            posts.map((post) => (
                                <TableRow key={post.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                    <TableCell className="font-medium text-white">
                                        {post.title}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={post.status === "published" ? "text-green-500 border-green-500/20 bg-green-500/10" : "text-yellow-500 border-yellow-500/20 bg-yellow-500/10"}>
                                            {post.status || "draft"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-400">{post.author}</TableCell>
                                    <TableCell className="text-gray-400">{post.publishedAt}</TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/admin/posts/${post.id}`}>
                                            <Button variant="ghost" size="sm" className="hover:text-nyembo-sky">
                                                Edit
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
