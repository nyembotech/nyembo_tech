"use client";

import { useState } from "react";
import { FeatureFlag } from "@/types/firestore";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Settings2, Save, X, AlertTriangle } from "lucide-react";

interface FlagControlCardProps {
    flag: FeatureFlag;
    onToggle: (id: string, currentState: boolean) => void;
    onUpdateTargeting: (id: string, roles: string[], emails: string[]) => void;
}

export function FlagControlCard({ flag, onToggle, onUpdateTargeting }: FlagControlCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [rolesStr, setRolesStr] = useState(flag.targetRoles?.join(", ") || "");
    const [emailsStr, setEmailsStr] = useState(flag.targetEmails?.join(", ") || "");

    const handleSave = () => {
        const roles = rolesStr.split(",").map(s => s.trim()).filter(Boolean);
        const emails = emailsStr.split(",").map(s => s.trim()).filter(Boolean);
        onUpdateTargeting(flag.id, roles, emails);
        setIsEditing(false);
    };

    return (
        <Card className={`relative overflow-hidden group border transition-all duration-300 ${flag.enabled ? 'border-purple-500/50 bg-purple-500/5 shadow-[0_0_20px_rgba(168,85,247,0.1)]' : 'border-white/10 bg-black/40'}`}>
            {/* Status Indicator Stripe */}
            <div className={`absolute top-0 bottom-0 left-0 w-1 transition-colors ${flag.enabled ? 'bg-purple-500 shadow-[0_0_10px_#a855f7]' : 'bg-gray-800'}`} />

            <div className="p-6 pl-8">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-mono text-lg font-bold text-white flex items-center gap-2">
                            {flag.key}
                            {flag.enabled && <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse" />}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">{flag.description}</p>
                    </div>
                    <Switch
                        checked={flag.enabled}
                        onCheckedChange={() => onToggle(flag.id, flag.enabled)}
                        className="data-[state=checked]:bg-purple-500"
                    />
                </div>

                {/* Targeting Rules Display */}
                <div className="space-y-3 bg-black/20 rounded-lg p-3 border border-white/5">
                    <div className="flex justify-between items-center">
                        <span className="text-xs uppercase tracking-wider text-gray-500 font-bold">Targeting Rules</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-white/10"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            <Settings2 className="w-3.5 h-3.5 text-gray-400" />
                        </Button>
                    </div>

                    {!isEditing ? (
                        <div className="space-y-2">
                            <div className="flex flex-wrap gap-2 text-xs">
                                <span className="text-gray-500">Roles:</span>
                                {flag.targetRoles && flag.targetRoles.length > 0 ? (
                                    flag.targetRoles.map(r => <Badge key={r} variant="outline" className="text-xs bg-purple-500/10 border-purple-500/20 text-purple-300">{r}</Badge>)
                                ) : (
                                    <span className="text-gray-600 italic">None (All user roles)</span>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs">
                                <span className="text-gray-500">Emails:</span>
                                {flag.targetEmails && flag.targetEmails.length > 0 ? (
                                    flag.targetEmails.map(e => <Badge key={e} variant="outline" className="text-xs bg-blue-500/10 border-blue-500/20 text-blue-300">{e}</Badge>)
                                ) : (
                                    <span className="text-gray-600 italic">None</span>
                                )}
                            </div>
                            {flag.enabled && (!flag.targetRoles?.length && !flag.targetEmails?.length) && (
                                <div className="flex items-center gap-2 mt-2 text-[10px] text-yellow-500/80 bg-yellow-500/10 p-1.5 rounded border border-yellow-500/20">
                                    <AlertTriangle className="w-3 h-3" />
                                    <span>Global launch active (Visible to everyone)</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase text-gray-500">Roles (comma separated)</label>
                                <Input
                                    value={rolesStr}
                                    onChange={(e) => setRolesStr(e.target.value)}
                                    className="h-8 text-xs bg-black/50 border-white/10 font-mono"
                                    placeholder="admin, beta, staff"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase text-gray-500">Emails (comma separated)</label>
                                <Input
                                    value={emailsStr}
                                    onChange={(e) => setEmailsStr(e.target.value)}
                                    className="h-8 text-xs bg-black/50 border-white/10 font-mono"
                                    placeholder="ceo@nyembo.tech, tester@gmail.com"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-1">
                                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button size="sm" className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white" onClick={handleSave}>
                                    <Save className="w-3 h-3 mr-1.5" /> Save Rules
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
