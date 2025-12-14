"use client";

import { useActivity } from "@/hooks/firestore/use-activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, CheckCircle2, AlertTriangle, XCircle, Info, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function RecentActivityFeed({ customerId }: { customerId?: string }) {
    // Only fetch customer visible logs. 
    // If customerId is provided, the hook will also filter by that.
    const { activities, loading } = useActivity({ visibility: "customer", customerId }, { enabled: !!customerId });

    // Limit for the widget
    const recentActivities = activities.slice(0, 5);

    const getIcon = (type: string) => {
        switch (type) {
            case "success": return <CheckCircle2 className="w-4 h-4 text-green-400" />;
            case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
            case "error": return <XCircle className="w-4 h-4 text-red-400" />;
            default: return <Info className="w-4 h-4 text-blue-400" />;
        }
    };

    return (
        <Card className="bg-card/30 border-white/5 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-nyembo-sky" />
                    Recent Updates
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[200px] pr-4">
                    {loading ? (
                        <div className="text-xs text-muted-foreground text-center py-8">Loading updates...</div>
                    ) : recentActivities.length === 0 ? (
                        <div className="text-xs text-muted-foreground text-center py-8">No recent updates.</div>
                    ) : (
                        <div className="space-y-4">
                            {recentActivities.map((log) => (
                                <div key={log.id} className="relative pl-6 pb-1 group">
                                    {/* Timeline line */}
                                    <div className="absolute left-[7px] top-6 bottom-[-16px] w-[1px] bg-white/10 group-last:hidden" />

                                    <div className="absolute left-0 top-1">
                                        {getIcon(log.type)}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-white/90 leading-tight">{log.message}</p>
                                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                            <span className="capitalize flex items-center gap-1">
                                                <Tag className="w-3 h-3 opacity-50" />
                                                {log.targetType}
                                            </span>
                                            <span>•</span>
                                            {formatDistanceToNow(log.createdAt.toDate(), { addSuffix: true })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
