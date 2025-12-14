"use client";

import { AdminNotificationsMenu } from "@/components/admin/notifications-menu";
import { Input } from "@/components/ui/input";
import { Search, User, LogOut } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export function AdminTopbar() {
    return (
        <header className="h-20 glass-neumo mx-4 mt-4 mb-4 rounded-2xl flex items-center justify-between px-6 sticky top-4 z-30 transition-all duration-300">
            <div className="w-96 pl-4">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground z-10" />
                    <Input
                        placeholder="Search anything..."
                        className="pl-10 neumo-pressed bg-[#050a07] border-none text-white focus-visible:ring-1 focus-visible:ring-[#bef264]/50 rounded-xl h-10 placeholder:text-muted-foreground/50 shadow-inner"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <AdminNotificationsMenu />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sidebar-primary to-nyembo-gold flex items-center justify-center shadow-[0_0_10px_rgba(246,227,15,0.3)] cursor-pointer hover:scale-105 transition-transform">
                            <User className="w-4 h-4 text-black" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-[#0c131c] border-white/10 text-white">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem asChild className="hover:bg-white/5 cursor-pointer focus:bg-white/5 focus:text-white">
                            <Link href="/admin/profile" className="flex items-center w-full">
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer focus:bg-red-500/10 focus:text-red-300"
                            onClick={() => auth.signOut()}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
