"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { createDocument, updateDocument } from "@/services/firebase/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2, Plus, UserPlus, Building2, User, Link as LinkIcon, Copy, Check } from "lucide-react";
import { useCustomerInvites } from "@/hooks/firestore/use-invites";
import { logActivity } from "@/services/activity-log";

export default function AddCustomerPage() {
    const { user } = useAuth();
    const { generateInvite, loading: inviteLoading } = useCustomerInvites();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [inviteLink, setInviteLink] = useState("");
    const [copied, setCopied] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        type: "individual",
        companyName: "",
    });

    const updateForm = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        setInviteLink("");

        try {
            // 1. Create Customer Document
            const customerData = {
                name: formData.type === "company" ? formData.companyName : formData.name,
                contactEmail: formData.email,
                domain: formData.email.split('@')[1] || "",
                status: "active",
                plan: "starter",
                type: formData.type,
                companyName: formData.companyName,
                onboardingStatus: "pending"
            };

            const customerId = await createDocument("customers", customerData);

            // 2. Generate Invite Link
            const token = await generateInvite(customerId, formData.email);
            const link = `${window.location.origin}/onboarding?token=${token}`;
            setInviteLink(link);

            // 3. Log Activity
            await logActivity({
                type: "info",
                actorId: user?.uid || "admin",
                targetType: "customer",
                targetId: customerId,
                message: `Client ${customerData.name} created and invited.`,
                visibility: "admin"
            });

            setSuccess(true);
            setFormData({
                name: "",
                email: "",
                type: "individual",
                companyName: "",
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-8">Onboard New Client</h1>

            <Card className="bg-card/40 border-white/10 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle className="text-2xl text-white">Customer Details</CardTitle>
                    <CardDescription>Add a new client and generate their onboarding invite.</CardDescription>
                </CardHeader>
                <CardContent>
                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground">Client Type</label>
                                    <Select value={formData.type} onValueChange={v => updateForm("type", v)}>
                                        <SelectTrigger className="bg-white/5 border-white/10">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="individual">Individual</SelectItem>
                                            <SelectItem value="company">Company</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground">Primary Contact Name</label>
                                    <Input
                                        placeholder="John Doe"
                                        className="bg-white/5 border-white/10"
                                        value={formData.name}
                                        onChange={e => updateForm("name", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {formData.type === "company" && (
                                <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground">Company Name</label>
                                    <Input
                                        placeholder="Acme Corp"
                                        className="bg-white/5 border-white/10"
                                        value={formData.companyName}
                                        onChange={e => updateForm("companyName", e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm text-muted-foreground">Email Address</label>
                                <Input
                                    type="email"
                                    placeholder="client@example.com"
                                    className="bg-white/5 border-white/10"
                                    value={formData.email}
                                    onChange={e => updateForm("email", e.target.value)}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-nyembo-sky text-black hover:bg-nyembo-sky/90 font-bold"
                                disabled={loading || inviteLoading}
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                                Create Client & Generate Invite
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-xl flex flex-col items-center gap-4 text-center">
                                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                    <Check className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Client Successfully Added!</h3>
                                    <p className="text-muted-foreground">An invite link has been generated. Share this with the client to let them complete onboarding.</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-muted-foreground">Onboarding Link</label>
                                <div className="flex gap-2">
                                    <Input
                                        value={inviteLink}
                                        readOnly
                                        className="bg-black/30 border-white/10 font-mono text-xs text-nyembo-sky"
                                    />
                                    <Button onClick={copyToClipboard} variant="outline" className="shrink-0 border-white/10 hover:bg-white/5">
                                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                </div>
                                <p className="text-xs text-yellow-500/80 flex items-center gap-1 mt-2">
                                    This link is valid for 7 days.
                                </p>
                            </div>

                            <Button
                                variant="ghost"
                                className="w-full text-white/50 hover:text-white"
                                onClick={() => setSuccess(false)}
                            >
                                Add Another Client
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
