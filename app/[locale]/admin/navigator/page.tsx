"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Map, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminNavigatorPage() {
    // Mock data for now - would fetch from 'navigator_sessions'
    const sessions = [
        { id: "1001", user: "Acme Corp", topic: "Logistics Optimization", status: "completed", risk: "low", date: "2025-12-26" },
        { id: "1002", user: "Tanzania Brew", topic: "AI Marketing", status: "active", risk: "medium", date: "2025-12-27" },
        { id: "1003", user: "FinTech Ltd", topic: "Crypto Integration", status: "flagged", risk: "high", date: "2025-12-27" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                        <Map className="w-8 h-8 text-nyembo-yellow" />
                        NAVIGATOR CONTROL
                    </h1>
                    <p className="text-muted-foreground">Oversight of AI strategic sessions and risk analysis.</p>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard title="Total Sessions" value="142" icon={<Map className="text-nyembo-sky" />} />
                <MetricCard title="Active Now" value="3" icon={<Users className="text-green-400" />} />
                <MetricCard title="Flagged Topics" value="5" icon={<AlertTriangle className="text-red-400" />} />
                <MetricCard title="Conversion Rate" value="12%" icon={<TrendingUp className="text-nyembo-yellow" />} />
            </div>

            {/* Sessions Table */}
            <div className="border border-white/10 rounded-xl overflow-hidden bg-black/40 backdrop-blur-sm">
                <Table>
                    <TableHeader className="bg-white/5">
                        <TableRow className="border-white/10">
                            <TableHead className="text-white">Session ID</TableHead>
                            <TableHead className="text-white">User / Company</TableHead>
                            <TableHead className="text-white">Active Topic</TableHead>
                            <TableHead className="text-white text-center">Risk Score</TableHead>
                            <TableHead className="text-white text-center">Status</TableHead>
                            <TableHead className="text-right text-white">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sessions.map((session) => (
                            <TableRow key={session.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                <TableCell className="font-mono text-nyembo-sky">#{session.id}</TableCell>
                                <TableCell className="font-medium text-white">{session.user}</TableCell>
                                <TableCell className="text-gray-400">{session.topic}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="outline" className={
                                        session.risk === 'high' ? "border-red-500 text-red-500" :
                                            session.risk === 'medium' ? "border-yellow-500 text-yellow-500" :
                                                "border-green-500 text-green-500"
                                    }>
                                        {session.risk.toUpperCase()}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <StatusBadge status={session.status} />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" variant="ghost" className="text-nyembo-sky hover:text-white hover:bg-nyembo-sky/20">
                                        Inspect
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon }: { title: string, value: string, icon: any }) {
    return (
        <Card className="bg-[#0c131c] border-white/5 shadow-neumo">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{title}</CardTitle>
                <div className="w-5 h-5 opacity-80">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white">{value}</div>
            </CardContent>
        </Card>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        active: "bg-green-500/20 text-green-400 border-green-500/30",
        completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        flagged: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return (
        <Badge variant="outline" className={`capitalize ${styles[status as keyof typeof styles]}`}>
            {status}
        </Badge>
    );
}
