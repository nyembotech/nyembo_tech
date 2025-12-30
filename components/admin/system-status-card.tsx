"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Server, Database, Globe, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

export function SystemStatusCard() {
    return (
        <Card className="bg-card/50 border-sidebar-border shadow-neumo hover:border-nyembo-sky/50 transition-colors col-span-full lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Activity className="h-4 w-4 text-nyembo-sky animate-pulse" />
                    System Status
                </CardTitle>
                <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-mono text-emerald-500">OPERATIONAL</span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 pt-2">
                    <div className="grid gap-3">
                        {/* API Status */}
                        <div className="flex items-center justify-between rounded-lg bg-black/20 p-2 border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 rounded-md bg-nyembo-sky/10 text-nyembo-sky">
                                    <Globe className="h-3.5 w-3.5" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs font-medium text-white">API Gateway</p>
                                    <p className="text-[10px] text-muted-foreground">Europe-West1</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-mono text-emerald-400">99.9%</p>
                                <p className="text-[10px] text-muted-foreground">12ms</p>
                            </div>
                        </div>

                        {/* Database Status */}
                        <div className="flex items-center justify-between rounded-lg bg-black/20 p-2 border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 rounded-md bg-nyembo-gold/10 text-nyembo-gold">
                                    <Database className="h-3.5 w-3.5" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs font-medium text-white">Database Cluster</p>
                                    <p className="text-[10px] text-muted-foreground">Primary Shard</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-mono text-emerald-400">Healthy</p>
                                <p className="text-[10px] text-muted-foreground">45% Load</p>
                            </div>
                        </div>

                        {/* CDN Status */}
                        <div className="flex items-center justify-between rounded-lg bg-black/20 p-2 border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-400">
                                    <Server className="h-3.5 w-3.5" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs font-medium text-white">Compute Nodes</p>
                                    <p className="text-[10px] text-muted-foreground">Auto-Scaling</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-mono text-emerald-400">Stable</p>
                                <p className="text-[10px] text-muted-foreground">24/30 Active</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-white/5">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">Security Shield</span>
                            <span className="text-nyembo-sky font-mono flex items-center gap-1">
                                <Wifi className="h-3 w-3" /> ACTIVE
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
