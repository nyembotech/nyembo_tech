"use client";

import { useState, useEffect } from "react";
import { HealthStatusBoard } from "@/components/admin/system/health-status-board";
import { MetricsGrid } from "@/components/admin/system/metrics-grid";
import { ErrorLogConsole } from "@/components/admin/system/error-log-console";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export default function AdminSystemPage() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    return (
        <div className="p-6 space-y-8 min-h-screen bg-[#020617] text-white">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-1 glowing-text">System Command Center</h1>
                    <p className="text-gray-400 font-mono text-sm">Real-time telemetry and health monitoring.</p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => setRefreshTrigger(prev => prev + 1)}
                    className="border-nyembo-sky/50 text-nyembo-sky hover:bg-nyembo-sky/10 font-mono"
                >
                    <RefreshCcw className="w-4 h-4 mr-2" /> REFRESH
                </Button>
            </div>

            {/* Health Status Tiles */}
            <HealthStatusBoard refreshTrigger={refreshTrigger} />

            {/* Metrics Graphs */}
            <div className="h-96 w-full">
                <MetricsGrid />
            </div>

            {/* Error Logs */}
            <ErrorLogConsole />
        </div>
    );
}

// Add global glowing text style locally content if needed or rely on main css
// .glowing-text { text-shadow: 0 0 20px rgba(56,189,248,0.5); }
