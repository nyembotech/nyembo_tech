"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Activity, Database, Lock, HardDrive, AlertTriangle, CheckCircle2 } from "lucide-react";

interface HealthData {
    firestore: { status: string; latency?: number };
    auth: { status: string };
    storage: { status: string };
    overall: string;
}

export function HealthStatusBoard({ refreshTrigger }: { refreshTrigger: number }) {
    const [data, setData] = useState<HealthData | null>(null);
    const [loading, setLoading] = useState(true);

    const checkHealth = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/health");
            const json = await res.json();
            setData(json);
        } catch (e) {
            console.error("Health check failed", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkHealth();
        const interval = setInterval(checkHealth, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [refreshTrigger]);

    const getStatusColor = (status: string) => {
        if (status === 'ok' || status === 'healthy') return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
        if (status === 'degraded') return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
        return "text-red-400 bg-red-400/10 border-red-400/20";
    };

    const StatusTile = ({ title, icon: Icon, status, metric }: any) => (
        <Card className={`relative overflow-hidden border p-4 ${getStatusColor(status)} backdrop-blur-md`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <p className="text-xs font-mono opacity-80 uppercase tracking-wider">{title}</p>
                    <p className="text-xl font-bold mt-1 uppercase">{status}</p>
                    {metric && <p className="text-xs font-mono mt-2">{metric}</p>}
                </div>
                <Icon className={`w-8 h-8 opacity-50`} />
            </div>
            {/* Animated Pulser */}
            <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 ${status === 'ok' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
        </Card>
    );

    if (!data) return <div className="text-white font-mono animate-pulse">Establishing Uplink...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatusTile
                title="System Overall"
                icon={Activity}
                status={data.overall}
                metric={loading ? "Scanning..." : "Active"}
            />
            <StatusTile
                title="Firestore DB"
                icon={Database}
                status={data.firestore.status}
                metric={`Latency: ${data.firestore.latency || 0}ms`}
            />
            <StatusTile
                title="Authentication"
                icon={Lock}
                status={data.auth.status}
                metric="Identity Service"
            />
            <StatusTile
                title="Storage Bucket"
                icon={HardDrive}
                status={data.storage.status}
                metric="Asset Vault"
            />
        </div>
    );
}
