"use client";

import { useActivity } from "@/hooks/firestore/use-activity";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, CheckCircle2, AlertTriangle, Info, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

import { useAuth } from "@/hooks/use-auth";

export function AdminNotificationsMenu() {
    const { user } = useAuth();
    const { activities, loading } = useActivity({ visibility: "admin" }, { enabled: !!user }); // Only fetch when authed

    // Simple logic: assume top 5 are "recent/unread" for now since we don't track read state yet
    const recentActivities = activities.slice(0, 10);
    const unreadCount = activities.length > 0 ? activities.filter(a => a.createdAt && Date.now() - a.createdAt.toDate().getTime() < 24 * 60 * 60 * 1000).length : 0; // "Unread" = < 24h old for demo

    const getIcon = (type: string) => {
        switch (type) {
            case "success": return <CheckCircle2 className="w-4 h-4 text-green-400" />;
            case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
            case "error": return <XCircle className="w-4 h-4 text-red-400" />;
            default: return <Info className="w-4 h-4 text-blue-400" />;
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-white/5 text-white/70 hover:text-white">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-nyembo-sky rounded-full border-2 border-black animate-pulse" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-[#0c131c] border-white/10 text-white shadow-2xl" align="end">
                <div className="p-3 border-b border-white/5 flex justify-between items-center">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    {unreadCount > 0 && <Badge variant="secondary" className="text-[10px] h-5 bg-nyembo-sky/20 text-nyembo-sky border-0">{unreadCount} New</Badge>}
                </div>

                <ScrollArea className="h-[350px]">
                    <div className="flex flex-col">
                        {loading ? (
                            <div className="p-8 text-center text-muted-foreground text-xs">Loading updates...</div>
                        ) : recentActivities.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground text-xs">No recent activity</div>
                        ) : (
                            recentActivities.map((log) => (
                                <div key={log.id} className="p-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-default">
                                    <div className="flex gap-3">
                                        <div className="mt-1 shrink-0">
                                            {getIcon(log.type)}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none">{log.message}</p>
                                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                                <span>{log.actorName || "System"}</span>
                                                <span>•</span>
                                                <span>{log.createdAt ? formatDistanceToNow(log.createdAt.toDate(), { addSuffix: true }) : "Unknown date"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>

                <div className="p-2 border-t border-white/5 bg-black/20">
                    <Link href="/admin/activity">
                        <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-white justify-between">
                            View All Activity
                            <ArrowRight className="w-3 h-3" />
                        </Button>
                    </Link>
                </div>
            </PopoverContent>
        </Popover>
    );
}
