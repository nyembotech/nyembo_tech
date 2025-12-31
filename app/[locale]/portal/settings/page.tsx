"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Download, Trash2, AlertTriangle, ShieldCheck, FileDown, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { DeletionRequest } from "@/types/firestore";

export default function PortalSettingsPage() {
    const { user, profile } = useAuth();
    const [exporting, setExporting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleExportData = async () => {
        setExporting(true);
        toast.info("Preparing your data export...");
        try {
            const response = await fetch("/api/user/export", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid: user?.uid }),
            });

            if (!response.ok) throw new Error("Export failed");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `nyembotech-data-${user?.uid}.json`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            toast.success("Data export downloaded successfully.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate data export. Please try again.");
        } finally {
            setExporting(false);
        }
    };

    const handleRequestDeletion = async () => {
        if (!user) return;
        setDeleting(true);
        try {
            // Check if request already exists
            const q = query(collection(db, "deletion_requests"),
                where("customerId", "==", user.uid),
                where("status", "in", ["pending", "processing"])
            );
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                toast.warning("You already have a pending deletion request.");
                setShowDeleteConfirm(false);
                return;
            }

            await addDoc(collection(db, "deletion_requests"), {
                customerId: user.uid,
                customerEmail: user.email || "unknown",
                requestedAt: serverTimestamp(),
                status: "pending",
                organizationId: profile?.organizationId || "default"
            });

            toast.success("Deletion request submitted. Our team will process this shortly.");
            setShowDeleteConfirm(false);
        } catch (error) {
            console.error("Deletion request failed:", error);
            // Fallback: If write fails (rules), tell them to contact support
            toast.error("Could not submit request automatically. Please contact support@nyembo.tech");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-8 p-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Account Settings</h1>
                <p className="text-gray-400">Manage your data privacy and account preferences.</p>
            </div>

            {/* Data Export Card */}
            <Card className="bg-white/5 border-white/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <FileDown className="w-5 h-5 text-nyembo-sky" />
                        Your Data
                    </CardTitle>
                    <CardDescription>
                        Under GDPR and other privacy laws, you have the right to access your personal data.
                        Download a copy of your profile, projects, and activity logs.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <ShieldCheck className="w-6 h-6 text-blue-400 mt-1" />
                        <div>
                            <h4 className="font-semibold text-blue-300 text-sm">Secure Export</h4>
                            <p className="text-xs text-blue-200/60 mt-1">
                                The export file will be generated in JSON format. It may contain sensitive information.
                                Please store it securely.
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={handleExportData}
                        disabled={exporting}
                        className="bg-white/10 hover:bg-white/20 text-white"
                    >
                        {exporting ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating JSON...</>
                        ) : (
                            <><Download className="w-4 h-4 mr-2" /> Download My Data</>
                        )}
                    </Button>
                </CardFooter>
            </Card>

            {/* Account Deletion Card */}
            <Card className="bg-red-500/5 border-red-500/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-400">
                        <AlertTriangle className="w-5 h-5" />
                        Danger Zone
                    </CardTitle>
                    <CardDescription className="text-red-200/60">
                        Permanently delete your account and remove your data from our servers.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-red-200/80 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                        This action will queue your account for permanent deletion within 30 days.
                    </p>
                    <Button
                        variant="destructive"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="bg-red-500 hover:bg-red-600 text-white"
                    >
                        <Trash2 className="w-4 h-4 mr-2" /> Request Account Deletion
                    </Button>
                </CardContent>
            </Card>

            {/* Deletion Confirmation Dialog */}
            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent className="bg-[#020617] border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-red-500 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" /> Confirm Deletion Request
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Are you absolutely sure? This will notify our administrators to begin the deletion process.
                            Your access will be revoked upon approval.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={() => setShowDeleteConfirm(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleRequestDeletion}
                            disabled={deleting}
                        >
                            {deleting ? "Submitting..." : "Yes, Delete My Account"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
