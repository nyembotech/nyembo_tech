"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

const data = [
    { name: "Jan", projects: 4, revenue: 2400 },
    { name: "Feb", projects: 3, revenue: 1398 },
    { name: "Mar", projects: 2, revenue: 9800 },
    { name: "Apr", projects: 7, revenue: 3908 },
    { name: "May", projects: 5, revenue: 4800 },
    { name: "Jun", projects: 9, revenue: 3800 },
    { name: "Jul", projects: 12, revenue: 12500 },
];

const ticketData = [
    { name: "Mon", open: 4, resolved: 2 },
    { name: "Tue", open: 3, resolved: 5 },
    { name: "Wed", open: 7, resolved: 6 },
    { name: "Thu", open: 2, resolved: 4 },
    { name: "Fri", open: 5, resolved: 8 },
    { name: "Sat", open: 1, resolved: 1 },
    { name: "Sun", open: 0, resolved: 0 },
];

export function AnalyticsCharts() {
    return (
        <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-card/30 border-white/5 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-white">Project Growth & Revenue</CardTitle>
                    <CardDescription>Monthly trends for project acquisition.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FBDA03" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#FBDA03" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                                    labelStyle={{ color: '#999' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#FBDA03" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                                <Area type="monotone" dataKey="projects" stroke="#3B82F6" fillOpacity={1} fill="url(#colorProjects)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-card/30 border-white/5 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-white">Support Ticket Velocity</CardTitle>
                    <CardDescription>Incoming vs Resolved tickets this week.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ticketData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                                />
                                <Legend />
                                <Bar dataKey="open" fill="#FF3B30" radius={[4, 4, 0, 0]} name="Opened" />
                                <Bar dataKey="resolved" fill="#4ADE80" radius={[4, 4, 0, 0]} name="Resolved" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
