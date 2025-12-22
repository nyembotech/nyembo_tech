"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Activity, Server, Clock, AlertTriangle, DollarSign, Database } from "lucide-react";

interface MetricsSummary {
    apiLatency: { avg: number; p95: number; p99: number };
    errorRate: number;
    cacheHitRate: number;
    requestCount: number;
    aiApiCalls: number;
    aiApiCost: number;
}

interface HealthStatus {
    overall: "healthy" | "degraded" | "unhealthy";
    firebase: { status: string; latency?: number };
    openai: { status: string; latency?: number };
    uptime: number;
}

export default function MetricsPage() {
    const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
    const [health, setHealth] = useState<HealthStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch health status
            const healthRes = await fetch("/api/health");
            const healthData = await healthRes.json();
            setHealth(healthData);

            // Mock metrics for now (would come from /api/metrics in production)
            setMetrics({
                apiLatency: { avg: 145, p95: 280, p99: 450 },
                errorRate: 0.5,
                cacheHitRate: 68,
                requestCount: 1250,
                aiApiCalls: 156,
                aiApiCost: 2.34,
            });

            setLastUpdated(new Date());
        } catch (error) {
            console.error("Failed to fetch metrics:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "healthy":
            case "connected":
                return "text-green-500";
            case "degraded":
                return "text-yellow-500";
            default:
                return "text-red-500";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">System Metrics</h1>
                    <p className="text-muted-foreground">
                        Real-time monitoring dashboard
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {lastUpdated && (
                        <span className="text-sm text-muted-foreground">
                            Last updated: {lastUpdated.toLocaleTimeString()}
                        </span>
                    )}
                    <Button
                        variant="outline"
                        onClick={fetchData}
                        disabled={loading}
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Health Status */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="neumo-surface">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">System Status</CardTitle>
                        <Server className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold capitalize ${getStatusColor(health?.overall || "unhealthy")}`}>
                            {health?.overall || "Unknown"}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Uptime: {health?.uptime ? Math.floor(health.uptime / 60) : 0} min
                        </p>
                    </CardContent>
                </Card>

                <Card className="neumo-surface">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Firebase</CardTitle>
                        <Database className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold capitalize ${getStatusColor(health?.firebase?.status || "")}`}>
                            {health?.firebase?.status || "Unknown"}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Latency: {health?.firebase?.latency || 0}ms
                        </p>
                    </CardContent>
                </Card>

                <Card className="neumo-surface">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">OpenAI API</CardTitle>
                        <Activity className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold capitalize ${getStatusColor(health?.openai?.status || "")}`}>
                            {health?.openai?.status || "Unknown"}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Latency: {health?.openai?.latency || 0}ms
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="neumo-surface">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
                        <Clock className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics?.apiLatency.avg || 0}ms</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            p95: {metrics?.apiLatency.p95 || 0}ms | p99: {metrics?.apiLatency.p99 || 0}ms
                        </p>
                    </CardContent>
                </Card>

                <Card className="neumo-surface">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                        <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${(metrics?.errorRate || 0) > 5 ? "text-red-500" : "text-green-500"}`}>
                            {metrics?.errorRate.toFixed(2) || 0}%
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Target: &lt;1%
                        </p>
                    </CardContent>
                </Card>

                <Card className="neumo-surface">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
                        <Database className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${(metrics?.cacheHitRate || 0) > 50 ? "text-green-500" : "text-yellow-500"}`}>
                            {metrics?.cacheHitRate.toFixed(1) || 0}%
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Target: &gt;60%
                        </p>
                    </CardContent>
                </Card>

                <Card className="neumo-surface">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">AI API Cost</CardTitle>
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${metrics?.aiApiCost.toFixed(2) || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {metrics?.aiApiCalls || 0} calls (last hour)
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Request Volume */}
            <Card className="neumo-surface">
                <CardHeader>
                    <CardTitle>Request Volume</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold">{metrics?.requestCount.toLocaleString() || 0}</div>
                    <p className="text-muted-foreground">Total requests in the last hour</p>
                </CardContent>
            </Card>
        </div>
    );
}
