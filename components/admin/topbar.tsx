"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Bell, User } from "lucide-react";

export function AdminTopbar() {
    return (
        <header className="h-16 border-b border-sidebar-border bg-sidebar/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="w-96">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search anything..."
                        className="pl-10 bg-sidebar-accent/50 border-sidebar-border focus-visible:ring-sidebar-primary rounded-full h-9"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-full">
                    <Bell className="w-5 h-5" />
                </Button>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sidebar-primary to-nyembo-gold flex items-center justify-center shadow-[0_0_10px_rgba(246,227,15,0.3)] cursor-pointer hover:scale-105 transition-transform">
                    <User className="w-4 h-4 text-black" />
                </div>
            </div>
        </header>
    );
}
