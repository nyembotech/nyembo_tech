"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, Thermometer, Lock, Camera, Activity, Power, LockOpen, RefreshCw, Zap } from "lucide-react";
import { SmartDevice } from "@/types/smart-space";
import { SmartSpacesClient } from "@/services/iot/iot-broker";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Mock initial data if DB is empty
const MOCK_DEVICES: SmartDevice[] = [
    {
        id: "dev-1", smartSpaceId: "space-1", name: "Living Room Main", type: "light", vendor: "philips-hue", status: "online", lastSeen: new Date(),
        state: { on: true, brightness: 80, color: "#ffaa00" }
    } as any,
    {
        id: "dev-2", smartSpaceId: "space-1", name: "Hallway Thermostat", type: "thermostat", vendor: "nest", status: "online", lastSeen: new Date(),
        state: { currentTemp: 21, targetTemp: 22, mode: "heat" }
    } as any,
    {
        id: "dev-3", smartSpaceId: "space-1", name: "Front Door", type: "lock", vendor: "august", status: "offline", lastSeen: new Date(Date.now() - 86400000),
        state: { locked: true }
    } as any
];

export default function SmartSpaceDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [devices, setDevices] = useState<SmartDevice[]>(MOCK_DEVICES);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Real-time listener for devices in this space
        // Using mock query logic for now, assumes 'devices' collection exists
        const q = query(collection(db, "devices"), where("smartSpaceId", "==", id));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const devs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SmartDevice));
                setDevices(devs);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [id]);

    const handleToggle = async (device: SmartDevice) => {
        // optimistic update logic would go here

        // Specific logic per type
        if (device.type === 'light') {
            const newState = !device.state.on;
            await SmartSpacesClient.sendCommand(device.id, newState ? 'TURN_ON' : 'TURN_OFF', {});
            // Manually firing event to simulate device response for demo
            await SmartSpacesClient.handleDeviceEvent(device.id, id, 'REPORT_STATE', { state: { ...device.state, on: newState } });
        } else if (device.type === 'lock') {
            const newState = !device.state.locked;
            await SmartSpacesClient.sendCommand(device.id, newState ? 'LOCK' : 'UNLOCK', {});
            await SmartSpacesClient.handleDeviceEvent(device.id, id, 'REPORT_STATE', { state: { ...device.state, locked: newState } });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Smart Space Control</h1>
                    <p className="text-muted-foreground">Managing Space ID: <span className="font-mono text-nyembo-sky">{id}</span></p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-nyembo-gold/50 text-nyembo-gold hover:bg-nyembo-gold/10">
                        <Zap className="w-4 h-4 mr-2" />
                        Run "Night Mode"
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {devices.map(device => (
                    <DeviceCard key={device.id} device={device} onToggle={() => handleToggle(device)} />
                ))}
            </div>

            {devices.length === 0 && !loading && (
                <div className="text-center py-20 bg-white/5 rounded-xl border border-dashed border-white/10">
                    <p className="text-muted-foreground">No devices linked to this space.</p>
                    <Button variant="link" className="text-nyembo-sky mt-2">Add Device +</Button>
                </div>
            )}
        </div>
    );
}

function DeviceCard({ device, onToggle }: { device: SmartDevice, onToggle: () => void }) {
    const isOnline = device.status === 'online';

    const getIcon = () => {
        switch (device.type) {
            case 'light': return <Lightbulb className={device.state.on ? "text-yellow-400 fill-yellow-400" : "text-gray-400"} />;
            case 'thermostat': return <Thermometer className="text-red-400" />;
            case 'lock': return device.state.locked ? <Lock className="text-green-400" /> : <LockOpen className="text-red-400" />;
            case 'camera': return <Camera className="text-blue-400" />;
            default: return <Activity />;
        }
    };

    const getStatusContent = () => {
        if (device.type === 'light') return device.state.on ? "On - 80%" : "Off";
        if (device.type === 'thermostat') return `${device.state.currentTemp}°C (Target: ${device.state.targetTemp}°C)`;
        if (device.type === 'lock') return device.state.locked ? "Locked" : "Unlocked";
        return "Idle";
    };

    return (
        <Card className={`bg-black/40 backdrop-blur-md border ${isOnline ? 'border-white/10' : 'border-red-500/30'} hover:border-nyembo-sky/30 transition-all group`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full bg-white/5 ${isOnline ? '' : 'opacity-50'}`}>
                        {getIcon()}
                    </div>
                    <div>
                        <CardTitle className="text-base text-white">{device.name}</CardTitle>
                        <CardDescription className="text-xs font-mono truncate max-w-[120px]">{device.vendor}</CardDescription>
                    </div>
                </div>
                <Badge variant={isOnline ? "default" : "destructive"} className={isOnline ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : ""}>
                    {device.status}
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between mt-2">
                    <div className="text-2xl font-bold text-white tracking-tight">
                        {getStatusContent()}
                    </div>

                    {['light', 'lock', 'switch'].includes(device.type) && (
                        <Button
                            onClick={onToggle}
                            size="icon"
                            className={`rounded-full w-10 h-10 transition-all ${(device.type === 'light' && device.state.on) || (device.type === 'lock' && device.state.locked)
                                    ? 'bg-white text-black hover:bg-gray-200'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <Power className="w-5 h-5" />
                        </Button>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Last update</span>
                    <span className="font-mono">
                        {/* Simple generic formatter */}
                        just now
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}
