"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Plus, Trash2, Bot, BarChart3, MessageSquare, Search, Zap } from "lucide-react";
import { motion } from "framer-motion";

// --- Mock Data ---
const TOP_QUERIES = [
    { query: "How much does a website cost?", count: 145, trend: "+12%" },
    { query: "Do you build mobile apps?", count: 98, trend: "+5%" },
    { query: "Portfolio / Case Studies", count: 87, trend: "+8%" },
    { query: "Contact Support", count: 65, trend: "-2%" },
    { query: "Hire dedicated developer", count: 42, trend: "+15%" },
];

const INIT_DOCUMENTS = [
    { id: "1", name: "Web_Development_Brochure_2026.pdf", type: "PDF", size: "2.4 MB", status: "Active", downloads: 342 },
    { id: "2", name: "Mobile_Apps_Guide_v2.pdf", type: "PDF", size: "1.8 MB", status: "Active", downloads: 215 },
    { id: "3", name: "Company_Profile_Q1.pdf", type: "PDF", size: "5.1 MB", status: "Archived", downloads: 54 },
];

export default function ChatBotManager() {
    const [documents, setDocuments] = useState(INIT_DOCUMENTS);

    const handleDelete = (id: string) => {
        setDocuments(documents.filter(d => d.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Chatbot Manager</h1>
                    <p className="text-muted-foreground mt-1">Train your AI, manage knowledge base documents, and analyze user intent.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Bot className="w-4 h-4 mr-2" /> Test Bot</Button>
                    <Button><Zap className="w-4 h-4 mr-2" /> Retrain Model</Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Conversations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">1,284</div>
                        <p className="text-xs text-emerald-500 mt-1 flex items-center">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                            +18% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Brochure Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">657</div>
                        <p className="text-xs text-muted-foreground mt-1">51% conversion rate</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Satisfaction</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">4.8/5.0</div>
                        <div className="flex mt-1">
                            {[1, 2, 3, 4, 5].map(s => <div key={s} className="w-1.5 h-1.5 rounded-full bg-nyembo-yellow mr-0.5" />)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Query Analysis */}
                <Card className="lg:col-span-1 border-white/10 bg-white/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-indigo-400" /> Top User Queries
                        </CardTitle>
                        <CardDescription>What customers are asking mostly about.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {TOP_QUERIES.map((q, i) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-muted-foreground">
                                            {i + 1}
                                        </div>
                                        <span className="text-sm font-medium group-hover:text-indigo-400 transition-colors">{q.query}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-sm font-bold">{q.count}</span>
                                        <span className={`text-[10px] ${q.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{q.trend}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full mt-6 text-xs">View Full Analysis</Button>
                    </CardContent>
                </Card>

                {/* Document Manager */}
                <Card className="lg:col-span-2 border-white/10 bg-white/5">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-nyembo-yellow" /> Knowledge Base Documents
                            </CardTitle>
                            <CardDescription>Upload brochures and guides the bot can share.</CardDescription>
                        </div>
                        <Button size="sm" className="bg-nyembo-yellow text-black hover:bg-nyembo-gold">
                            <Upload className="w-4 h-4 mr-2" /> Upload New
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border border-white/10">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10 hover:bg-white/5">
                                        <TableHead>Document Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {documents.map((doc) => (
                                        <TableRow key={doc.id} className="border-white/10 hover:bg-white/5">
                                            <TableCell className="font-medium flex items-center gap-2">
                                                <div className="p-2 rounded bg-indigo-500/20 text-indigo-400">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p>{doc.name}</p>
                                                    <p className="text-xs text-muted-foreground">{doc.size}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>{doc.type}</TableCell>
                                            <TableCell>
                                                <Badge variant={doc.status === 'Active' ? 'default' : 'secondary'} className={doc.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : ''}>
                                                    {doc.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                                    onClick={() => handleDelete(doc.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
