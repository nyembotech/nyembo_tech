"use client";

import { useFeatureFlagsManagement } from "@/hooks/use-feature-flag";
import { FlagControlCard } from "@/components/admin/labs/flag-control-card";
import { FlaskConical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLabsPage() {
    const { flags, loading, toggleFlag, updateTargeting } = useFeatureFlagsManagement();

    // Sort: Enabled first? Or alphabetical? Let alphabetical by key for now.
    const sortedFlags = [...flags].sort((a, b) => a.key.localeCompare(b.key));

    return (
        <div className="p-6 space-y-8 min-h-screen bg-[#020617] text-white">
            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                    <FlaskConical className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold mb-1 tracking-tight">Nyembo Labs <span className="text-xs align-top px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">EXPERIMENTAL</span></h1>
                    <p className="text-gray-400 font-mono text-sm max-w-xl">
                        Caution: These modules enable experimental features. Toggling switches may cause instability in the spacetime continuum of the application.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {loading ? (
                    // Loading State
                    Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-48 w-full bg-white/5 rounded-xl" />
                    ))
                ) : flags.length > 0 ? (
                    sortedFlags.map(flag => (
                        <FlagControlCard
                            key={flag.id}
                            flag={flag}
                            onToggle={toggleFlag}
                            onUpdateTargeting={updateTargeting}
                        />
                    ))
                ) : (
                    <div className="col-span-2 text-center text-gray-500 py-12">No feature flags detected. Initialize them in Firestore.</div>
                )}
            </div>
        </div>
    );
}
