"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, where } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Loader2, Search, FileText, CheckCircle2, Clock, XCircle, Mail, DollarSign, Users, Building, Globe } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner"; // Assuming sonner is installed, or console log if not

interface Booking {
    id: string;
    companyName: string;
    contactName: string;
    contactEmail: string;
    programTitle: string;
    participants: number;
    format: string;
    status: "requested" | "proposal_sent" | "confirmed" | "completed" | "cancelled";
    createdAt: any;
    notes?: string;
    invoiceRef?: string;
    poNumber?: string;
    country?: string;
}

export default function AdminAcademyPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [filter, setFilter] = useState("requested");

    useEffect(() => {
        const q = query(collection(db, "academy_bookings"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items: Booking[] = [];
            snapshot.forEach((doc) => {
                items.push({ id: doc.id, ...doc.data() } as Booking);
            });
            setBookings(items);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching bookings:", error);
            setLoading(false);
            // Optionally set an error state here
        });

        return () => unsubscribe();
    }, []);

    const updateStatus = async (id: string, newStatus: Booking["status"], extraData?: any) => {
        try {
            await updateDoc(doc(db, "academy_bookings", id), {
                status: newStatus,
                ...extraData
            });
            setSelectedBooking(null); // Close drawer
        } catch (error) {
            console.error("Error updating booking:", error);
        }
    };

    const handleConfirm = async (booking: Booking) => {
        const invoiceRef = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
        await updateStatus(booking.id, "confirmed", { invoiceRef });
    };

    const filteredBookings = bookings.filter(b => {
        if (filter === "all") return true;
        return b.status === filter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "requested": return "text-yellow-400 border-yellow-400/50 bg-yellow-400/10";
            case "proposal_sent": return "text-blue-400 border-blue-400/50 bg-blue-400/10";
            case "confirmed": return "text-emerald-400 border-emerald-400/50 bg-emerald-400/10";
            case "completed": return "text-purple-400 border-purple-400/50 bg-purple-400/10";
            default: return "text-gray-400 border-gray-400/50 bg-gray-400/10";
        }
    };

    if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-white min-h-screen pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Academy Management</h1>
                    <p className="text-muted-foreground">Oversee training requests and corporate bookings.</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-lg">
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                    <span className="text-emerald-400 font-mono font-bold">
                        ${bookings.filter(b => b.status === 'confirmed').length * 5000} Est. Rev
                    </span>
                </div>
            </div>

            <Tabs defaultValue="requested" onValueChange={setFilter} className="w-full">
                <TabsList className="bg-black/40 border border-white/10 p-1">
                    <TabsTrigger value="requested">Requested <Badge className="ml-2 bg-yellow-500/20 text-yellow-500 border-0">{bookings.filter(b => b.status === "requested").length}</Badge></TabsTrigger>
                    <TabsTrigger value="proposal_sent">Proposal Sent</TabsTrigger>
                    <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="all">All Records</TabsTrigger>
                </TabsList>

                <div className="mt-6 grid grid-cols-1 gap-4">
                    {filteredBookings.length === 0 ? (
                        <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10 border-dashed text-muted-foreground">
                            No bookings found in this category.
                        </div>
                    ) : (
                        filteredBookings.map((booking) => (
                            <div
                                key={booking.id}
                                onClick={() => setSelectedBooking(booking)}
                                className="group cursor-pointer bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-full bg-white/5 border border-white/10`}>
                                        <Building className="w-5 h-5 text-white/70" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white group-hover:text-nyembo-sky transition-colors">{booking.companyName}</h3>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {booking.participants}</span>
                                            <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {booking.country || 'N/A'}</span>
                                            <span>•</span>
                                            <span>{booking.programTitle}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-sm text-gray-400 font-mono">
                                            {booking.createdAt?.seconds ? format(new Date(booking.createdAt.seconds * 1000), 'MMM d, yyyy') : 'Just now'}
                                        </p>
                                    </div>
                                    <Badge variant="outline" className={`capitalize ${getStatusColor(booking.status)}`}>
                                        {booking.status.replace('_', ' ')}
                                    </Badge>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Tabs>

            {/* DETAILS DRAWER */}
            <Sheet open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
                <SheetContent className="w-[400px] sm:w-[540px] bg-[#020617] border-l border-white/10 text-white overflow-y-auto">
                    {selectedBooking && (
                        <div className="space-y-8 mt-6">
                            <SheetHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <Badge variant="outline" className={`capitalize ${getStatusColor(selectedBooking.status)}`}>
                                        {selectedBooking.status.replace('_', ' ')}
                                    </Badge>
                                    <span className="font-mono text-xs text-gray-500">ID: {selectedBooking.id}</span>
                                </div>
                                <SheetTitle className="text-2xl">{selectedBooking.companyName}</SheetTitle>
                                <SheetDescription className="text-gray-400">
                                    Requester: {selectedBooking.contactName} ({selectedBooking.contactEmail})
                                </SheetDescription>
                            </SheetHeader>

                            <div className="space-y-6">
                                {/* Program Details */}
                                <div className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-3">
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-nyembo-sky flex items-center gap-2">
                                        <FileText className="w-4 h-4" /> Program Details
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-500">Program</p>
                                            <p className="font-medium text-white">{selectedBooking.programTitle}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Format</p>
                                            <p className="font-medium text-white capitalize">{selectedBooking.format}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Participants</p>
                                            <p className="font-medium text-white">{selectedBooking.participants} People</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Est. Revenue</p>
                                            <p className="font-medium text-nyembo-sky font-mono">${(selectedBooking.participants * 1500).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">PO Number</p>
                                            <p className="font-medium text-white font-mono">{selectedBooking.poNumber || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                {selectedBooking.notes && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-bold text-gray-400">Client Notes</h4>
                                        <p className="text-sm p-3 bg-black/40 rounded border border-white/5 text-gray-300 italic">
                                            "{selectedBooking.notes}"
                                        </p>
                                    </div>
                                )}

                                {/* Financials if Confirmed */}
                                {selectedBooking.invoiceRef && (
                                    <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-emerald-400 font-bold uppercase">Invoice Reference</p>
                                            <p className="font-mono text-emerald-300">{selectedBooking.invoiceRef}</p>
                                        </div>
                                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                    </div>
                                )}
                            </div>

                            <SheetFooter className="flex-col gap-3 sm:justify-start pt-6 border-t border-white/10">
                                <p className="text-xs text-gray-500 font-bold uppercase mb-2">Actions</p>
                                <div className="flex flex-wrap gap-3 w-full">
                                    {selectedBooking.status === "requested" && (
                                        <>
                                            <Button
                                                variant="outline"
                                                className="border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                                                onClick={() => updateStatus(selectedBooking.id, "proposal_sent")}
                                            >
                                                <Mail className="w-4 h-4 mr-2" /> Mark Proposal Sent
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20"
                                                onClick={() => updateStatus(selectedBooking.id, "cancelled")}
                                            >
                                                <XCircle className="w-4 h-4 mr-2" /> Decline
                                            </Button>
                                        </>
                                    )}

                                    {selectedBooking.status === "proposal_sent" && (
                                        <Button
                                            className="bg-emerald-500 text-black hover:bg-emerald-400 w-full"
                                            onClick={() => handleConfirm(selectedBooking)}
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-2" /> Confirm & Generate Invoice
                                        </Button>
                                    )}

                                    {selectedBooking.status === "confirmed" && (
                                        <Button
                                            variant="outline"
                                            className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                                            onClick={() => updateStatus(selectedBooking.id, "completed")}
                                        >
                                            Mark as Completed
                                        </Button>
                                    )}
                                </div>
                            </SheetFooter>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
