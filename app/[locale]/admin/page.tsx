"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { AIInsightsPanel } from "@/components/ai/ai-insights-panel";
import { SystemStatusCard } from "@/components/admin/system-status-card";

export default function AdminDashboardPage() {
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
                        <Clock className="w-4 h-4" />
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
                            <div className="text-2xl font-bold text-white">12</div>
                            <p className="text-xs text-muted-foreground">+2 from last month</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-sidebar-border shadow-neumo hover:border-nyembo-sky/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Open Tickets</CardTitle>
                            <AlertCircle className="h-4 w-4 text-nyembo-sky" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">24</div>
                            <p className="text-xs text-muted-foreground">-4 from yesterday</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-sidebar-border shadow-neumo hover:border-green-500/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Tasks Completed</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">145</div>
                            <p className="text-xs text-muted-foreground">+12% from last week</p>
                        </CardContent>
                    </Card>
                    <SystemStatusCard />
                </div>

                {/* Main Content Area */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4 bg-card/30 border-sidebar-border shadow-neumo">
                        <CardHeader>
                            <CardTitle className="text-white">Today's Operations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="projects" className="space-y-4">
                                <TabsList className="bg-sidebar-accent/50 border border-sidebar-border">
                                    <TabsTrigger value="projects" className="data-[state=active]:bg-sidebar-primary data-[state=active]:text-black">Projects</TabsTrigger>
                                    <TabsTrigger value="tasks" className="data-[state=active]:bg-sidebar-primary data-[state=active]:text-black">Tasks</TabsTrigger>
                                    <TabsTrigger value="alerts" className="data-[state=active]:bg-sidebar-primary data-[state=active]:text-black">Alerts</TabsTrigger>
                                </TabsList>
                                <TabsContent value="projects" className="space-y-4">
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-sidebar-accent/30 border border-sidebar-border hover:border-sidebar-primary/30 transition-colors group cursor-pointer">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-lg bg-sidebar-primary/10 flex items-center justify-center text-sidebar-primary font-bold group-hover:bg-sidebar-primary group-hover:text-black transition-colors">
                                                        P{i}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-white">Project Alpha {i}</h4>
                                                        <p className="text-sm text-muted-foreground">Deployment phase</p>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-muted-foreground">Updated 2h ago</div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                                <TabsContent value="tasks">
                                    <div className="text-muted-foreground">Tasks content placeholder.</div>
                                </TabsContent>
                                <TabsContent value="alerts">
                                    <div className="text-muted-foreground">Alerts content placeholder.</div>
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
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="relative mt-1">
                                            <div className="absolute top-0 left-1/2 -ml-px h-full w-px bg-sidebar-border" />
                                            <div className="relative h-2 w-2 rounded-full bg-sidebar-primary ring-4 ring-background" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-white">New project created</p>
                                            <p className="text-xs text-muted-foreground">User X started Project Y</p>
                                            <p className="text-xs text-muted-foreground">2 hours ago</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
