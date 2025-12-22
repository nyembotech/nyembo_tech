"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, AlertCircle, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { AIInsightsPanel } from "@/components/ai/ai-insights-panel";
import { useDashboardStats, formatRelativeTime } from "@/hooks/use-dashboard-stats";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardPage() {
    const { stats, projects, tickets, activities, loading } = useDashboardStats();

    return (
        <div className="relative min-h-screen -m-6 p-6 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[100px] animate-blob" />
                <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] animate-blob animation-delay-4000" />
            </div>

            <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Clock className="w-4 h-4" />
                        )}
                        <span>Last updated: Just now</span>
                    </div>
                </div>

                {/* AI Insights Layer */}
                <div className="mb-4">
                    <AIInsightsPanel role="admin" />
                </div>

                {/* Metrics Row */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-card/50 border-sidebar-border shadow-neumo hover:border-sidebar-primary/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
                            <Activity className="h-4 w-4 text-sidebar-primary" />
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <Skeleton className="h-8 w-16" />
                            ) : (
                                <>
                                    <div className="text-2xl font-bold text-white">{stats.activeProjects}</div>
                                    <p className="text-xs text-muted-foreground">{projects.length} total projects</p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-sidebar-border shadow-neumo hover:border-nyembo-sky/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Open Tickets</CardTitle>
                            <AlertCircle className="h-4 w-4 text-nyembo-sky" />
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <Skeleton className="h-8 w-16" />
                            ) : (
                                <>
                                    <div className="text-2xl font-bold text-white">{stats.openTickets}</div>
                                    <p className="text-xs text-muted-foreground">{tickets.length} total tickets</p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-sidebar-border shadow-neumo hover:border-green-500/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Recent Activity</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <Skeleton className="h-8 w-16" />
                            ) : (
                                <>
                                    <div className="text-2xl font-bold text-white">{stats.recentActivity}</div>
                                    <p className="text-xs text-muted-foreground">Activity logs</p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-sidebar-border shadow-neumo hover:border-nyembo-gold/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Projects by Status</CardTitle>
                            <Clock className="h-4 w-4 text-nyembo-gold" />
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <Skeleton className="h-8 w-full" />
                            ) : (
                                <div className="text-xs text-muted-foreground space-y-1">
                                    {Object.entries(stats.projectsByStatus).map(([status, count]) => (
                                        <div key={status} className="flex justify-between">
                                            <span className="capitalize">{status.replace('-', ' ')}</span>
                                            <span className="text-white font-medium">{count}</span>
                                        </div>
                                    ))}
                                    {Object.keys(stats.projectsByStatus).length === 0 && (
                                        <span>No projects yet</span>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Area */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4 bg-card/30 border-sidebar-border shadow-neumo">
                        <CardHeader>
                            <CardTitle className="text-white">Recent Projects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="projects" className="space-y-4">
                                <TabsList className="bg-sidebar-accent/50 border border-sidebar-border">
                                    <TabsTrigger value="projects" className="data-[state=active]:bg-sidebar-primary data-[state=active]:text-black">Projects</TabsTrigger>
                                    <TabsTrigger value="tickets" className="data-[state=active]:bg-sidebar-primary data-[state=active]:text-black">Tickets</TabsTrigger>
                                </TabsList>
                                <TabsContent value="projects" className="space-y-4">
                                    <div className="space-y-4">
                                        {loading ? (
                                            [1, 2, 3].map((i) => (
                                                <Skeleton key={i} className="h-16 w-full" />
                                            ))
                                        ) : projects.length === 0 ? (
                                            <p className="text-muted-foreground text-center py-8">No projects found</p>
                                        ) : (
                                            projects.slice(0, 5).map((project) => (
                                                <div key={project.id} className="flex items-center justify-between p-4 rounded-xl bg-sidebar-accent/30 border border-sidebar-border hover:border-sidebar-primary/30 transition-colors group cursor-pointer">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-lg bg-sidebar-primary/10 flex items-center justify-center text-sidebar-primary font-bold group-hover:bg-sidebar-primary group-hover:text-black transition-colors">
                                                            {project.title.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-white">{project.title}</h4>
                                                            <p className="text-sm text-muted-foreground capitalize">{project.status.replace('-', ' ')} • {project.progress}%</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">{formatRelativeTime(project.updatedAt)}</div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </TabsContent>
                                <TabsContent value="tickets" className="space-y-4">
                                    <div className="space-y-4">
                                        {loading ? (
                                            [1, 2, 3].map((i) => (
                                                <Skeleton key={i} className="h-16 w-full" />
                                            ))
                                        ) : tickets.length === 0 ? (
                                            <p className="text-muted-foreground text-center py-8">No tickets found</p>
                                        ) : (
                                            tickets.slice(0, 5).map((ticket) => (
                                                <div key={ticket.id} className="flex items-center justify-between p-4 rounded-xl bg-sidebar-accent/30 border border-sidebar-border hover:border-sidebar-primary/30 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center font-bold ${ticket.status === 'open' ? 'bg-yellow-500/20 text-yellow-500' :
                                                                ticket.status === 'in-progress' ? 'bg-blue-500/20 text-blue-500' :
                                                                    'bg-green-500/20 text-green-500'
                                                            }`}>
                                                            <AlertCircle className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-white">{ticket.subject}</h4>
                                                            <p className="text-sm text-muted-foreground capitalize">{ticket.status} • {ticket.priority}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">{formatRelativeTime(ticket.updatedAt)}</div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    <Card className="col-span-3 bg-card/30 border-sidebar-border shadow-neumo">
                        <CardHeader>
                            <CardTitle className="text-white">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {loading ? (
                                    [1, 2, 3, 4].map((i) => (
                                        <Skeleton key={i} className="h-12 w-full" />
                                    ))
                                ) : activities.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-8">No recent activity</p>
                                ) : (
                                    activities.slice(0, 6).map((activity, index) => (
                                        <div key={activity.id} className="flex items-start gap-4">
                                            <div className="relative mt-1">
                                                {index < activities.length - 1 && (
                                                    <div className="absolute top-2 left-1/2 -ml-px h-full w-px bg-sidebar-border" />
                                                )}
                                                <div className={`relative h-2 w-2 rounded-full ring-4 ring-background ${activity.type === 'success' ? 'bg-green-500' :
                                                        activity.type === 'warning' ? 'bg-yellow-500' :
                                                            activity.type === 'error' ? 'bg-red-500' :
                                                                'bg-sidebar-primary'
                                                    }`} />
                                            </div>
                                            <div className="space-y-1 min-w-0">
                                                <p className="text-sm font-medium text-white truncate">{activity.message}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {activity.actorName || 'System'} • {formatRelativeTime(activity.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
