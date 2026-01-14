"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Customer } from "@/types/firestore";
import { Copy, ShieldAlert, Lock, Unlock } from "lucide-react";

interface CustomerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customer?: Customer | null;
    onSubmit: (data: any) => Promise<void>;
}

export function CustomerDialog({ open, onOpenChange, customer, onSubmit }: CustomerDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        companyName: "",
        contactEmail: "",
        type: "company",
        plan: "starter",
        status: "active",
        trackingCode: ""
    });
    const [newPassword, setNewPassword] = useState("");

    const handleGeneratePassword = async (uid: string) => {
        if (!confirm("Are you sure? This will overwrite the current password.")) return;
        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "generatePassword", uid })
            });
            const data = await res.json();
            if (data.password) {
                setNewPassword(data.password);
            }
        } catch (error) {
            console.error("Failed to generate password", error);
        }
    };

    const handleToggleBlock = async (uid: string, currentStatus: string) => {
        const isBlocked = currentStatus === "suspended";
        const action = isBlocked ? "Unblock" : "Block";

        if (!confirm(`Are you sure you want to ${action.toLowerCase()} this user?`)) return;

        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "toggleBlock", uid, blocked: !isBlocked })
            });

            if (res.ok) {
                // Close dialog to force refresh or handle optimist update in parent
                onOpenChange(false);
            }
        } catch (error) {
            console.error("Failed to toggle block", error);
        }
    };

    useEffect(() => {
        if (customer) {
            setFormData({
                name: customer.name,
                companyName: customer.companyName || "",
                contactEmail: customer.contactEmail,
                type: customer.type,
                plan: customer.plan || "starter",
                status: customer.status,
                trackingCode: customer.trackingCode || ""
            });
        } else {
            setFormData({
                name: "",
                companyName: "",
                contactEmail: "",
                type: "company",
                plan: "starter",
                status: "active",
                trackingCode: ""
            });
        }
    }, [customer, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#121214] border-white/10 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{customer ? "Edit Customer" : "New Customer"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Contact Name</Label>
                        <Input
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="bg-black/40 border-white/10 focus-visible:ring-[#bef264]/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Company Name</Label>
                        <Input
                            value={formData.companyName}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            className="bg-black/40 border-white/10 focus-visible:ring-[#bef264]/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                            type="email"
                            required
                            value={formData.contactEmail}
                            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                            className="bg-black/40 border-white/10 focus-visible:ring-[#bef264]/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Project Tracking Code</Label>
                        <Input
                            value={formData.trackingCode}
                            placeholder="e.g. REQ-123XYZ"
                            onChange={(e) => setFormData({ ...formData, trackingCode: e.target.value })}
                            className="bg-black/40 border-white/10 focus-visible:ring-[#bef264]/50 font-mono text-xs tracking-wider uppercase"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(val: any) => setFormData({ ...formData, type: val })}
                            >
                                <SelectTrigger className="bg-black/40 border-white/10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#121214] border-white/10 text-white">
                                    <SelectItem value="company">Company</SelectItem>
                                    <SelectItem value="individual">Individual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(val: any) => setFormData({ ...formData, status: val })}
                            >
                                <SelectTrigger className="bg-black/40 border-white/10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#121214] border-white/10 text-white">
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="bg-[#bef264] text-black hover:bg-[#a3e635]">
                            {loading ? "Saving..." : "Save Customer"}
                        </Button>
                    </div>
                </form>

                {customer && (
                    <div className="border-t border-white/10 pt-6 mt-2">
                        <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Security Controls</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                <div>
                                    <p className="text-sm font-medium text-white">Temporary Credentials</p>
                                    <p className="text-xs text-muted-foreground">Generate a new password for this user.</p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleGeneratePassword(customer.id)}
                                    className="border-white/10 hover:bg-white/10 text-nyembo-sky"
                                >
                                    Generate New Password
                                </Button>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                <div>
                                    <p className="text-sm font-medium text-white">Account Access</p>
                                    <p className="text-xs text-muted-foreground">
                                        {customer.status === 'suspended' ? 'User is currently blocked.' : 'User has full access.'}
                                    </p>
                                </div>
                                <Button
                                    variant={customer.status === 'suspended' ? "default" : "destructive"}
                                    size="sm"
                                    onClick={() => handleToggleBlock(customer.id, customer.status)}
                                    className={customer.status === 'suspended' ? "bg-green-600 hover:bg-green-700" : ""}
                                >
                                    {customer.status === 'suspended' ? "Unblock Account" : "Block Account"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>

            {/* Password Result Dialog */}
            <Dialog open={!!newPassword} onOpenChange={(open) => !open && setNewPassword("")}>
                <DialogContent className="bg-[#121214] border-white/10 text-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-nyembo-sky">New Password Generated</DialogTitle>
                    </DialogHeader>
                    <div className="py-6 space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Share this password with the customer immediately. It will not be shown again.
                        </p>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 p-3 rounded-lg bg-black border border-white/10 font-mono text-center text-lg tracking-wider text-[#bef264]">
                                {newPassword}
                            </code>
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={() => {
                                    navigator.clipboard.writeText(newPassword);
                                    // Optional toast could go here
                                }}
                                className="border-white/10 bg-white/5 hover:bg-white/10"
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={() => setNewPassword("")} className="bg-white/10 hover:bg-white/20 text-white">
                            Done
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </Dialog>
    );
}
