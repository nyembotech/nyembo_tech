"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Customer } from "@/types/firestore";

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
        status: "active"
    });

    useEffect(() => {
        if (customer) {
            setFormData({
                name: customer.name,
                companyName: customer.companyName || "",
                contactEmail: customer.contactEmail,
                type: customer.type,
                plan: customer.plan || "starter",
                status: customer.status
            });
        } else {
            setFormData({
                name: "",
                companyName: "",
                contactEmail: "",
                type: "company",
                plan: "starter",
                status: "active"
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
            </DialogContent>
        </Dialog>
    );
}
