"use client";

import { useActivity } from "@/hooks/firestore/use-activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, AlertTriangle, XCircle, Info, Activity } from "lucide-react";
import { format } from "date-fns";

export default function AdminActivityPage() {
    const { activities, loading } = useActivity({ visibility: "admin" });

    const getIcon = (type: string) => {
        switch (type) {
            case "success": return <CheckCircle2 className="w-5 h-5 text-green-400" />;
            case "warning": return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
            case "error": return <XCircle className="w-5 h-5 text-red-400" />;
            default: return <Info className="w-5 h-5 text-blue-400" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "project": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
            case "request": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
            case "customer": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
            case "system": return "bg-gray-500/10 text-gray-400 border-gray-500/20";
            default: return "bg-white/10 text-white/70 border-white/20";
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">System Activity</h1>
                <p className="text-muted-foreground mt-1">Audit log of all system events and operations.</p>
            </div>

            <Card className="bg-card/30 border-white/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <Activity className="w-5 h-5 text-nyembo-sky" />
                        Log Entries
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-12">
                            <Loader2 className="h-8 w-8 animate-spin text-nyembo-sky" />
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="text-center p-12 text-muted-foreground">
                            No activity recorded yet.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activities.map((log) => (
                                <div key={log.id} className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-colors">
                                    <div className="mt-1">
                                        {getIcon(log.type)}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-medium text-white">{log.message}</p>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                                                {format(log.createdAt.toDate(), "MMM d, yyyy HH:mm")}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <span className="text-white/60">By:</span>
                                                <Badge variant="outline" className="text-xs font-normal bg-white/5 border-white/10">
                                                    {log.actorName || "System"}
                                                </Badge>
                                            </div>
                                            <span>•</span>
                                            <Badge variant="outline" className={`text-xs font-normal capitalize ${getTypeColor(log.targetType)}`}>
                                                {log.targetType}
                                            </Badge>
                                            {log.customerId && (
                                                <>
                                                    <span>•</span>
                                                    <span className="text-xs">Customer ID: {log.customerId.substr(0, 8)}...</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
