"use client";

import { useState } from "react";
import { SmartDevice } from "@/types/smart-space";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Lamp, Lock, Thermometer, Wind } from "lucide-react";

// Mock Data for Portal Demo
const PORTAL_DEVICES = [
    { id: "1", type: "light", name: "Living Room Mood", state: { on: true, brightness: 65 } },
    { id: "2", type: "light", name: "Kitchen Overhead", state: { on: false, brightness: 100 } },
    { id: "3", type: "thermostat", name: "Main HVAC", state: { currentTemp: 22, targetTemp: 24 } },
    { id: "4", type: "lock", name: "Front Entry", state: { locked: true } },
];

export default function CustomerSmartSpaces() {
    const [activeTab, setActiveTab] = useState("living-room");

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white">My Smart Spaces</h1>
                <p className="text-muted-foreground">Control your environment with neural precision.</p>
            </div>

            {/* Room Selector */}
            <Tabs defaultValue="living-room" className="w-full">
                <TabsList className="bg-white/5 p-1 border border-white/10 rounded-xl mb-8">
                    <TabsTrigger value="living-room">Living Room</TabsTrigger>
                    <TabsTrigger value="bedroom">Master Suite</TabsTrigger>
                    <TabsTrigger value="office">Office</TabsTrigger>
                </TabsList>

                <TabsContent value="living-room" className="space-y-6">
                    {/* Scene Selection */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <SceneCard name="Focus" icon={<Wind className="w-5 h-5" />} color="bg-blue-500" />
                        <SceneCard name="Relax" icon={<Lamp className="w-5 h-5" />} color="bg-orange-500" active />
                        <SceneCard name="Night" icon={<Lock className="w-5 h-5" />} color="bg-indigo-500" />
                    </div>

                    {/* Device Controls */}
                    <div className="space-y-4">
                        <ControlTile
                            icon={<Lamp className="w-5 h-5 text-yellow-400" />}
                            label="Ambient Lighting"
                            value="65%"
                            type="slider"
                        />
                        <ControlTile
                            icon={<Thermometer className="w-5 h-5 text-red-400" />}
                            label="Temperature"
                            value="22°C"
                            type="value"
                        />
                        <ControlTile
                            icon={<Lock className="w-5 h-5 text-green-400" />}
                            label="Door Lock"
                            value="Locked"
                            type="toggle"
                            checked={true}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="bedroom">
                    <div className="text-center py-20 bg-white/5 rounded-2xl">
                        <p className="text-white/40">No devices configured in this zone.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function SceneCard({ name, icon, color, active }: any) {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`h-24 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all ${active ? `border-${color} bg-${color}/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]` : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
        >
            <div className={`p-2 rounded-full ${active ? color + ' text-white' : 'bg-white/10 text-white/60'}`}>
                {icon}
            </div>
            <span className={`text-xs font-bold ${active ? 'text-white' : 'text-white/60'}`}>{name}</span>
        </motion.button>
    )
}

function ControlTile({ icon, label, value, type, checked }: any) {
    return (
        <div className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl hover:border-nyembo-sky/30 transition-colors group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-nyembo-sky/10 transition-colors">
                    {icon}
                </div>
                <div>
                    <h4 className="text-sm font-bold text-white">{label}</h4>
                    <p className="text-xs text-muted-foreground">Current: {value}</p>
                </div>
            </div>

            <div className="w-1/3 flex justify-end">
                {type === 'toggle' && (
                    <Switch checked={checked} className="data-[state=checked]:bg-nyembo-sky" />
                )}
                {type === 'slider' && (
                    <Slider defaultValue={[65]} max={100} step={1} className="w-full" />
                )}
            </div>
        </div>
    )
}
