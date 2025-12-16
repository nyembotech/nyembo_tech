"use client";

import { useAuth } from "@/context/auth-context";
import { Building2, ChevronsUpDown, Plus } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function OrgSwitcher() {
    const { organization, switchOrganization, user } = useAuth();

    console.log("OrgSwitcher Render:", { organization, user });

    if (!organization) {
        return <div className="p-2 text-xs text-red-500">No Org Loaded</div>;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors w-full text-left outline-none focus:ring-2 focus:ring-nyembo-sky/20">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-nyembo-sky/10 border border-nyembo-sky/20 text-nyembo-sky">
                        {organization.logoUrl ? (
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={organization.logoUrl} alt={organization.name} />
                                <AvatarFallback className="rounded-lg">
                                    {organization.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        ) : (
                            <Building2 className="size-4" />
                        )}
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold text-white">
                            {organization.name}
                        </span>
                        <span className="truncate text-xs text-white/50">
                            {organization.slug}
                        </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4 text-white/50" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-[#020617] border-white/10 text-white"
                align="start"
                sideOffset={4}
            >
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Organizations
                </DropdownMenuLabel>

                {/* Current Org */}
                <DropdownMenuItem onClick={() => switchOrganization(organization.id)} className="gap-2 p-2 hover:bg-white/10 cursor-pointer">
                    <div className="flex size-6 items-center justify-center rounded-sm border border-white/10">
                        <Building2 className="size-4 shrink-0" />
                    </div>
                    {organization.name}
                </DropdownMenuItem>

                {/* Mock Second Org for Super Admins */}
                {user?.role === 'admin' && (
                    <DropdownMenuItem onClick={() => switchOrganization('demo-org')} className="gap-2 p-2 hover:bg-white/10 cursor-pointer text-white/70">
                        <div className="flex size-6 items-center justify-center rounded-sm border border-white/10">
                            <div className="size-4 rounded-full bg-yellow-500/20" />
                        </div>
                        Demo Corp (Mock)
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="gap-2 p-2 hover:bg-white/10 cursor-pointer">
                    <div className="flex size-6 items-center justify-center rounded-md border border-white/10 bg-white/5">
                        <Plus className="size-4" />
                    </div>
                    <div className="font-medium text-muted-foreground">Add organization</div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
