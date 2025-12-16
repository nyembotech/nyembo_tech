"use client";

import { Card } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

// Simulated Data Generator
const generateData = () => {
    const data = [];
    for (let i = 0; i < 24; i++) {
        data.push({
            time: `${i}:00`,
            latency: Math.floor(Math.random() * 50) + 10,
            errors: Math.floor(Math.random() * 5),
        });
    }
    return data;
};

const data = generateData();

export function MetricsGrid() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <Card className="bg-[#0A0A0A]/80 border-white/10 p-6 flex flex-col">
                <h3 className="text-sm font-mono text-gray-400 mb-4 uppercase">API Latency (ms) - Last 24h</h3>
                <div className="flex-1 min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="time" stroke="#666" fontSize={10} />
                            <YAxis stroke="#666" fontSize={10} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="latency" stroke="#38bdf8" fillOpacity={1} fill="url(#colorLatency)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card className="bg-[#0A0A0A]/80 border-white/10 p-6 flex flex-col">
                <h3 className="text-sm font-mono text-gray-400 mb-4 uppercase">Error Rate (PPM) - Last 24h</h3>
                <div className="flex-1 min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="time" stroke="#666" fontSize={10} />
                            <YAxis stroke="#666" fontSize={10} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="errors" stroke="#ef4444" fillOpacity={1} fill="url(#colorErrors)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}
