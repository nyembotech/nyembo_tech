"use client";

import { Card } from "@/components/ui/card";
import { AlertTriangle, Terminal } from "lucide-react";

const MOCK_ERRORS = [
    { id: 1, type: "WARN", msg: "Middleware: High latency detected on /api/agent", time: "10:42 AM" },
    { id: 2, type: "INFO", msg: "System: Cache invalidated for project-7782", time: "10:40 AM" },
    { id: 3, type: "ERROR", msg: "Firestore: Read quota at 85% capacity", time: "10:15 AM" },
    { id: 4, type: "ERROR", msg: "Auth: Failed login attempt (IP: 192.168.1.55)", time: "09:55 AM" },
    { id: 5, type: "INFO", msg: "System: Deployment completed successfully", time: "09:30 AM" },
];

export function ErrorLogConsole() {
    return (
        <Card className="bg-black border border-white/10 overflow-hidden font-mono text-xs shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="bg-white/5 p-2 flex items-center border-b border-white/10 px-4">
                <Terminal className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-gray-400">System Logs /var/log/nyembo.sys</span>
                <div className="ml-auto flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
            </div>

            <div className="p-4 h-64 overflow-y-auto space-y-2 custom-scrollbar">
                {MOCK_ERRORS.map(e => (
                    <div key={e.id} className="flex gap-4 border-l-2 border-transparent hover:border-white/20 pl-2 transition-colors">
                        <span className="text-gray-500 w-20 shrink-0">{e.time}</span>
                        <span className={`w-16 shrink-0 font-bold ${e.type === 'ERROR' ? 'text-red-500' :
                                e.type === 'WARN' ? 'text-yellow-500' : 'text-blue-500'
                            }`}>{e.type}</span>
                        <span className="text-gray-300">{e.msg}</span>
                    </div>
                ))}
                <div className="animate-pulse text-nyembo-sky mt-4">_</div>
            </div>
        </Card>
    );
}
