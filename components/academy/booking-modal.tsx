"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ChevronRight, Loader2, Building, Users, Calendar, FileText } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Program } from "@/hooks/use-academy-data";

interface BookingModalProps {
    isOpen: boolean;
    onMakeOpen: (open: boolean) => void;
    preSelectedProgram?: Program | null;
}

type Step = 1 | 2 | 3 | 4;

export function BookingModal({ isOpen, onMakeOpen, preSelectedProgram }: BookingModalProps) {
    const [step, setStep] = useState<Step>(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: "",
        contactName: "",
        contactEmail: "",
        country: "",
        companySize: "",
        programId: preSelectedProgram?.id || "",
        programTitle: preSelectedProgram?.title || "",
        dates: [] as string[],
        participants: 5,
        format: "Online",
        notes: "",
        poNumber: ""
    });

    const handleNext = () => {
        if (step < 4) setStep((s) => (s + 1) as Step);
    };

    const handleBack = () => {
        if (step > 1) setStep((s) => (s - 1) as Step);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await addDoc(collection(db, "academy_bookings"), {
                ...formData,
                status: "requested",
                createdAt: serverTimestamp(),
            });
            onMakeOpen(false);
            setStep(1); // Reset
            // Ideally trigger a toast here
            alert("Booking request sent successfully!");
        } catch (error) {
            console.error("Error booking:", error);
            alert("Failed to submit booking.");
        } finally {
            setLoading(false);
        }
    };

    // Update formData when preSelectedProgram changes and we are on step 1
    // This is simple effect; in real app might need more robust selection logic
    if (preSelectedProgram && formData.programId !== preSelectedProgram.id && !formData.programId) {
        setFormData(prev => ({ ...prev, programId: preSelectedProgram.id, programTitle: preSelectedProgram.title }));
    }

    return (
        <Dialog open={isOpen} onOpenChange={onMakeOpen}>
            <DialogContent className="max-w-2xl bg-black/95 border-white/10 text-white backdrop-blur-xl">
                <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-5 pointer-events-none" />

                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                            <span className="text-nyembo-sky">0{step}</span>
                            <span className="text-white/20">/</span>
                            {step === 1 ? "Company Details" :
                                step === 2 ? "Program Selection" :
                                    step === 3 ? "Group Logistics" : "Finalize Request"}
                        </DialogTitle>
                        {/* Stepper Dots */}
                        <div className="flex gap-2">
                            {[1, 2, 3, 4].map((s) => (
                                <div key={s} className={`w-2 h-2 rounded-full transition-colors ${s === step ? 'bg-nyembo-sky' : s < step ? 'bg-nyembo-sky/50' : 'bg-white/10'}`} />
                            ))}
                        </div>
                    </div>
                    <DialogDescription className="text-white/60">
                        {step === 1 && "Tell us about your organization."}
                        {step === 2 && "Choose the training track and preferred timeline."}
                        {step === 3 && "How many people and where?"}
                        {step === 4 && "Any specific requirements or PO references?"}
                    </DialogDescription>
                </DialogHeader>

                <div className="my-6 relative z-10 min-h-[300px]">
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Company Name</Label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                                        <Input
                                            placeholder="Acme Inc."
                                            className="pl-9 bg-white/5 border-white/10 text-white"
                                            value={formData.companyName}
                                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Country / HQ</Label>
                                    <Input
                                        placeholder="Germany"
                                        className="bg-white/5 border-white/10 text-white"
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Company Size</Label>
                                    <Select onValueChange={(val) => setFormData({ ...formData, companySize: val })}>
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue placeholder="Select size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1-50">1-50 employees</SelectItem>
                                            <SelectItem value="51-200">51-200 employees</SelectItem>
                                            <SelectItem value="201-1000">201-1000 employees</SelectItem>
                                            <SelectItem value="1000+">1000+ employees</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Contact Person</Label>
                                    <Input
                                        placeholder="Full Name"
                                        className="bg-white/5 border-white/10 text-white"
                                        value={formData.contactName}
                                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email Address</Label>
                                    <Input
                                        placeholder="name@company.com"
                                        className="bg-white/5 border-white/10 text-white"
                                        value={formData.contactEmail}
                                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-3">
                                <Label>Selected Program</Label>
                                <div className="p-4 rounded-lg border border-nyembo-sky/30 bg-nyembo-sky/10 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-white">{formData.programTitle || "No Program Selected"}</p>
                                        <p className="text-xs text-nyembo-sky">Standard Enterprise Curriculum</p>
                                    </div>
                                    <CheckCircle2 className="text-nyembo-sky w-5 h-5" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Preferred Start Date (Approximate)</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                                    <Input
                                        type="date"
                                        className="pl-9 bg-white/5 border-white/10 text-white w-full"
                                        onChange={(e) => setFormData({ ...formData, dates: [e.target.value] })}
                                    />
                                </div>
                                <p className="text-xs text-white/40">We will confirm exact availability in the proposal.</p>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-2">
                                <Label>Number of Participants</Label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                                    <Input
                                        type="number"
                                        className="pl-9 bg-white/5 border-white/10 text-white"
                                        value={formData.participants}
                                        onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Delivery Format</Label>
                                <div className="grid grid-cols-3 gap-4">
                                    {['Online', 'Onsite', 'Hybrid'].map((fmt) => (
                                        <div
                                            key={fmt}
                                            onClick={() => setFormData({ ...formData, format: fmt })}
                                            className={`cursor-pointer border rounded-lg p-4 text-center transition-all ${formData.format === fmt ? 'border-nyembo-sky bg-nyembo-sky/10 text-nyembo-sky' : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'}`}
                                        >
                                            <p className="font-bold">{fmt}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-2">
                                <Label>Purchase Order / Cost Center (Optional)</Label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                                    <Input
                                        placeholder="PO-2024-..."
                                        className="pl-9 bg-white/5 border-white/10 text-white"
                                        value={formData.poNumber}
                                        onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Additional Notes</Label>
                                <Textarea
                                    placeholder="Any specific focus areas or requirements?"
                                    className="bg-white/5 border-white/10 text-white min-h-[100px]"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex justify-between border-t border-white/10 pt-4">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={step === 1 || loading}
                        className="text-white/60 hover:text-white"
                    >
                        Back
                    </Button>

                    {step < 4 ? (
                        <Button
                            onClick={handleNext}
                            disabled={
                                (step === 1 && (!formData.companyName || !formData.contactEmail))
                            }
                            className="bg-nyembo-sky text-black hover:bg-nyembo-sky/80"
                        >
                            Next Step <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-emerald-500 text-black hover:bg-emerald-400"
                        >
                            {loading && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
                            Submit Request
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
