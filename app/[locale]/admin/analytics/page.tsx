"use client";

import { useProjects } from "@/hooks/firestore/use-projects";
import { useCustomers } from "@/hooks/firestore/use-customers";
import { useAllTickets } from "@/hooks/firestore/use-tickets";
import { useProjectRequests } from "@/hooks/firestore/use-requests";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, TrendingUp, Users, FolderKanban, Ticket as TicketIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const COLORS = ['#F6E30F', '#0EA5E9', '#A855F7', '#F54633'];

export default function AnalyticsPage() {
    const { projects, loading: projectsLoading } = useProjects();
    const { customers, loading: customersLoading } = useCustomers();
    const { tickets, loading: ticketsLoading } = useAllTickets();
    const { requests, loading: requestsLoading } = useProjectRequests();

    const loading = projectsLoading || customersLoading || ticketsLoading || requestsLoading;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-nyembo-sky" />
            </div>
        );
    }

    // --- Aggregations ---

    // 1. Mission Metrics
    const totalCustomers = customers.length;
    const activeProjects = projects.filter(p => p.status === "in-progress" || p.status === "planning").length;
    const openTickets = tickets.filter(t => t.status === "open" || t.status === "in-progress").length;

    // Project Conversion Rate (Converted / Total Requests)
    const convertedRequests = requests.filter(r => r.status === "converted").length;
    const conversionRate = requests.length > 0 ? Math.round((convertedRequests / requests.length) * 100) : 0;

    // 2. Charts Data

    // Projects by Status
    const projectsByStatus = [
        { name: "Planning", value: projects.filter(p => p.status === "planning").length, color: "#F6E30F" }, // Yellow
        { name: "In Progress", value: projects.filter(p => p.status === "in-progress").length, color: "#0EA5E9" }, // Sky
        { name: "Review", value: projects.filter(p => p.status === "review").length, color: "#A855F7" }, // Purple
        { name: "Completed", value: projects.filter(p => p.status === "completed").length, color: "#22C55E" }, // Green
    ].filter(d => d.value > 0);

    // Tickets by Status
    const ticketsByStatus = [
        { name: "Open", value: tickets.filter(t => t.status === "open").length, fill: "#F54633" }, // Red
        { name: "In Progress", value: tickets.filter(t => t.status === "in-progress").length, fill: "#F6E30F" }, // Yellow
        { name: "Resolved", value: tickets.filter(t => t.status === "resolved").length, fill: "#22C55E" }, // Green
        { name: "Closed", value: tickets.filter(t => t.status === "closed").length, fill: "#9ca3af" }, // Grey
    ];

    // 3. Top Customers (By Project Count)
    const topCustomers = customers.map(c => {
        const customerProjects = projects.filter(p => p.customerId === c.id);
        const customerTickets = tickets.filter(t => t.customerId === c.id);
        const activeCount = customerProjects.filter(p => p.status !== "completed" && p.status !== "on-hold").length;

        return {
            ...c,
            projectCount: customerProjects.length,
            activeCount,
            ticketCount: customerTickets.length
        };
    })
        .sort((a, b) => b.projectCount - a.projectCount)
        .slice(0, 5);


    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Mission Control Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Analytics Console</h1>
                    <p className="text-muted-foreground">Real-time intelligence on missions, assets, and anomalies.</p>
                </div>
                <div className="flex gap-2">
                    {/* Add date range picker here in future */}
                </div>
            </div>

            {/* Metric Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Active Customers"
                    value={totalCustomers}
                    icon={<Users className="w-5 h-5 text-nyembo-sky" />}
                    trend="+2 this month" // Fake trend for now
                    color="border-nyembo-sky/30 bg-nyembo-sky/5"
                />
                <MetricCard
                    title="Active Missions"
                    value={activeProjects}
                    icon={<FolderKanban className="w-5 h-5 text-nyembo-yellow" />}
                    trend={`${projects.length} total`}
                    color="border-nyembo-yellow/30 bg-nyembo-yellow/5"
                />
                <MetricCard
                    title="Open Tickets"
                    value={openTickets}
                    icon={<TicketIcon className="w-5 h-5 text-red-400" />}
                    trend={`${tickets.length} lifetime`}
                    color="border-red-500/30 bg-red-500/5"
                />
                <MetricCard
                    title="Mission Conversion"
                    value={`${conversionRate}%`}
                    icon={<TrendingUp className="w-5 h-5 text-green-400" />}
                    trend={`${convertedRequests}/${requests.length} requests`}
                    color="border-green-500/30 bg-green-500/5"
                />
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Project Distributions */}
                <Card className="bg-[#0c131c] border-white/10 shadow-neumo">
                    <CardHeader>
                        <CardTitle className="text-lg">Mission Status Distribution</CardTitle>
                        <CardDescription>Breakdown of active and archived projects</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={projectsByStatus}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {projectsByStatus.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-4 mt-4 text-xs font-mono uppercase">
                            {projectsByStatus.map(status => (
                                <div key={status.name} className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
                                    <span className="text-muted-foreground">{status.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Ticket Volume */}
                <Card className="bg-[#0c131c] border-white/10 shadow-neumo">
                    <CardHeader>
                        <CardTitle className="text-lg">Support Volume</CardTitle>
                        <CardDescription>Ticket distribution by current status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ticketsByStatus} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                                    <XAxis type="number" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis dataKey="name" type="category" stroke="#ffffff80" fontSize={12} tickLine={false} axisLine={false} width={80} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff' }}
                                    />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Customers */}
            <Card className="bg-[#0c131c] border-white/10 shadow-neumo overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-lg">Elite Clients</CardTitle>
                    <CardDescription>Top partners by mission volume</CardDescription>
                </CardHeader>
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-white/5 text-muted-foreground font-mono">
                            <tr>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4 text-center">Active Missions</th>
                                <th className="px-6 py-4 text-center">Total Missions</th>
                                <th className="px-6 py-4 text-center">Tickets</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {topCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No data available</td>
                                </tr>
                            ) : (
                                topCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-nyembo-sky">
                                                {customer.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold">{customer.companyName || customer.name}</div>
                                                <div className="text-xs text-muted-foreground">{customer.contactEmail}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {customer.activeCount > 0 ? (
                                                <Badge className="bg-nyembo-sky/10 text-nyembo-sky hover:bg-nyembo-sky/20 border-nyembo-sky/20 font-mono">
                                                    {customer.activeCount}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono">{customer.projectCount}</td>
                                        <td className="px-6 py-4 text-center font-mono text-muted-foreground">{customer.ticketCount}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/admin/customers/${customer.id}`}>
                                                <Button size="sm" variant="ghost" className="text-nyembo-yellow opacity-0 group-hover:opacity-100 hover:text-white hover:bg-white/10 transition-all">
                                                    View Profile
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

function MetricCard({ title, value, icon, trend, color }: { title: string, value: string | number, icon: React.ReactNode, trend: string, color: string }) {
    return (
        <Card className={`bg-[#0c131c] border-white/5 hover:border-white/20 transition-all shadow-neumo overflow-hidden relative group`}>
            <div className={`absolute top-0 inset-x-0 h-1 ${color.split(' ')[0].replace('border-', 'bg-')}`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white">{value}</div>
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                    {trend}
                </p>
                {/* Glow effect */}
                <div className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity ${color.split(' ')[1]}`} />
            </CardContent>
        </Card>
    );
}
