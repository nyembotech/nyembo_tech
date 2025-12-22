"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Warehouse, Server, Shield, Zap, Activity, Wifi, Lock } from "lucide-react";
import Link from "next/link";

interface SmartSpace {
    id: string;
    name: string;
    type: "zone" | "secure" | "utility" | "public";
    status: "active" | "maintenance" | "alert";
    devices: number;
    power_usage: string;
    security_level: "Level 1" | "Level 5" | "Omega";
    description: string;
    color: string;
}

const spaces: SmartSpace[] = [
    {
        id: "space-01",
        name: "Main Lobby & Reception",
        type: "public",
        status: "active",
        devices: 12,
        power_usage: "450W",
        security_level: "Level 1",
        description: "Primary access point. Automated greeting systems and biometric entry scanning operational.",
        color: "text-emerald-400"
    },
    {
        id: "space-02",
        name: "Server Core Alpha",
        type: "utility",
        status: "active",
        devices: 48,
        power_usage: "12.5kW",
        security_level: "Omega",
        description: "Central processing hub for AI agents. Temperature control critical. Access restricted.",
        color: "text-cyan-400"
    },
    {
        id: "space-03",
        name: "Executive Suite",
        type: "secure",
        status: "maintenance",
        devices: 8,
        power_usage: "800W",
        security_level: "Level 5",
        description: "High-level meeting area with anti-surveillance field generators.",
        color: "text-amber-400"
    },
    {
        id: "space-04",
        name: "Perimeter Defense",
        type: "zone",
        status: "alert",
        devices: 24,
        power_usage: "3.2kW",
        security_level: "Level 5",
        description: "External monitoring network. Motion sensors and drone docks.",
        color: "text-rose-500"
    }
];

import { useFeatureFlag } from "@/hooks/use-feature-flag";

function IotControls() {
    const { isEnabled } = useFeatureFlag("smart_spaces_iot");

    if (!isEnabled) return null;

    return (
        <Button className="bg-nyembo-sky/20 text-nyembo-sky border border-nyembo-sky/50 hover:bg-nyembo-sky/30">
            <Zap className="w-4 h-4 mr-2" />
            Add New Sector
        </Button>
    );
}

export default function SmartSpacesPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-white">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Environment Control Grid</h1>
                    <p className="text-muted-foreground">Monitor and manage connected physical infrastructure.</p>
                </div>
                <IotControls />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {spaces.map((space) => (
                    <Link href={`/admin/smart-spaces/${space.id}`} key={space.id} className="block group w-full h-[400px]">
                        <div className="relative h-full w-full transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:scale-[1.01] perspective-1000">

                            {/* Card Body */}
                            <div className={`absolute inset-0 bg-[#020617] rounded-2xl overflow-hidden border-2 transition-all duration-500 ${space.status === 'active' ? 'border-emerald-500/30' : space.status === 'alert' ? 'border-rose-500/50' : 'border-amber-500/30'} shadow-lg group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]`}>

                                {/* Background Tech Pattern */}
                                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%,rgba(255,255,255,0.1)_100%)] bg-[length:24px_24px]" />
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-bl-full opacity-20" />

                                <div className="relative h-full p-6 flex flex-col">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${space.color} shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
                                            {space.type === 'utility' ? <Server className="w-6 h-6" /> :
                                                space.type === 'secure' ? <Shield className="w-6 h-6" /> :
                                                    <Warehouse className="w-6 h-6" />}
                                        </div>
                                        <Badge variant="outline" className={`bg-black/50 backdrop-blur border-${space.color.replace('text-', '')} ${space.color}`}>
                                            {space.status.toUpperCase()}
                                        </Badge>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-4 mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white tracking-tight leading-tight mb-1">{space.name}</h3>
                                            <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">{space.id}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="bg-white/5 p-2 rounded border border-white/5">
                                                <div className="text-gray-500 mb-1 flex items-center gap-1"><Wifi className="w-3 h-3" /> Devices</div>
                                                <div className="text-white font-mono">{space.devices} CONNECTED</div>
                                            </div>
                                            <div className="bg-white/5 p-2 rounded border border-white/5">
                                                <div className="text-gray-500 mb-1 flex items-center gap-1"><Zap className="w-3 h-3" /> Power</div>
                                                <div className="text-white font-mono">{space.power_usage}</div>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-400 line-clamp-3 bg-black/20 p-2 rounded border border-white/5">
                                            {space.description}
                                        </p>
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10">
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                                            <Lock className="w-3 h-3" />
                                            SEC: {space.security_level}
                                        </div>
                                        <Activity className={`w-4 h-4 ${space.status === 'active' ? 'text-emerald-500 animate-pulse' : 'text-gray-600'}`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
