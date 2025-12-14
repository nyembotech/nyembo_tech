"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, User, Shield, Mail, Phone } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is installed, or fallback to alert

export default function AdminProfilePage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        displayName: "",
        email: "",
        phoneNumber: "",
        role: "",
        bio: "",
        photoURL: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        displayName: data.displayName || user.displayName || "",
                        email: data.email || user.email || "",
                        phoneNumber: data.phoneNumber || "",
                        role: data.role || "user",
                        bio: data.bio || "",
                        photoURL: data.photoURL || user.photoURL || ""
                    });
                } else {
                    // Fallback to auth data if no firestore doc
                    setFormData({
                        displayName: user.displayName || "",
                        email: user.email || "",
                        phoneNumber: "",
                        role: "admin", // Assumed since they are here
                        bio: "",
                        photoURL: user.photoURL || ""
                    });
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSaving(true);

        try {
            const docRef = doc(db, "users", user.uid);
            await updateDoc(docRef, {
                displayName: formData.displayName,
                phoneNumber: formData.phoneNumber,
                bio: formData.bio,
                updatedAt: new Date().toISOString()
            });
            // Show success logic (e.g. toast)
            alert("Profile updated successfully!");
        } catch (error: any) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-nyembo-sky" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Profile Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-[1fr_250px]">
                <Card className="bg-card/30 border-sidebar-border shadow-neumo">
                    <CardHeader>
                        <CardTitle className="text-white">General Information</CardTitle>
                        <CardDescription>Update your public profile information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        value={formData.email}
                                        disabled
                                        className="pl-10 bg-sidebar-accent/50 border-sidebar-border text-muted-foreground cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground">Email change is restricted. Contact IT Support.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="displayName" className="text-white">Display Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="displayName"
                                            value={formData.displayName}
                                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                            className="pl-10 bg-white/5 border-sidebar-border text-white focus-visible:ring-nyembo-sky/50"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role" className="text-white">Clearance Level</Label>
                                    <div className="relative">
                                        <Shield className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="role"
                                            value={formData.role.toUpperCase()}
                                            disabled
                                            className="pl-10 bg-sidebar-accent/50 border-sidebar-border text-muted-foreground cursor-not-allowed font-mono"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-white">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        className="pl-10 bg-white/5 border-sidebar-border text-white focus-visible:ring-nyembo-sky/50"
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio" className="text-white">Bio / Notes</Label>
                                <Textarea
                                    id="bio"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="bg-white/5 border-sidebar-border text-white focus-visible:ring-nyembo-sky/50 min-h-[100px]"
                                    placeholder="Tell us a little bit about yourself..."
                                />
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-nyembo-sky text-black hover:bg-nyembo-sky/90"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Side Card for Avatar (Optional/Future) */}
                <div className="space-y-6">
                    <Card className="bg-card/30 border-sidebar-border shadow-neumo flex flex-col items-center p-6 text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sidebar-primary to-nyembo-gold flex items-center justify-center shadow-[0_0_20px_rgba(246,227,15,0.2)] mb-4">
                            {formData.photoURL ? (
                                <img src={formData.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <span className="text-2xl font-bold text-black">
                                    {(formData.displayName || "U").substring(0, 2).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <h3 className="text-lg font-bold text-white">{formData.displayName || "User"}</h3>
                        <p className="text-sm text-muted-foreground">{formData.email}</p>
                        <Button variant="outline" className="mt-4 w-full border-sidebar-border hover:bg-white/5" disabled>
                            Change Avatar
                        </Button>
                        <p className="text-[10px] text-muted-foreground mt-2">Avatar upload disabled in this view.</p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
