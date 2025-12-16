"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Customer, DeletionRequest } from "@/types/firestore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Mail, Building2, Calendar, ShieldAlert, Trash2, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CustomerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [customer, setCustomer] = useState<Customer | null>(null);
    const [deletionRequest, setDeletionRequest] = useState<DeletionRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                // Fetch Customer
                const docRef = doc(db, "customers", id);
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    setCustomer({ id: snap.id, ...snap.data() } as Customer);
                }

                // Fetch Deletion Requests
                // Assuming customer.uid is the link. If customer doc has uid.
                // If the customer doc IS the main record, we check by customerId corresponding to this doc ID?
                // In firestore rules I set customerId == auth.uid.
                // Usually customer doc ID matches auth UID? Or customer.uid field holds it.
                // Let's assume customer.uid is the user ID.
                const customerData = snap.data();
                const targetUid = customerData?.uid || id; // Fallback to ID if no UID field

                const q = query(
                    collection(db, "deletion_requests"),
                    where("customerId", "==", targetUid),
                    where("status", "in", ["pending", "processing"])
                );
                const reqSnap = await getDocs(q);
                if (!reqSnap.empty) {
                    setDeletionRequest({ id: reqSnap.docs[0].id, ...reqSnap.docs[0].data() } as DeletionRequest);
                }
            } catch (error) {
                console.error("Fetch Data Error", error);
                toast.error("Failed to load customer data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleAnonymize = async () => {
        if (!confirm("Are you sure? This will permanently anonymize the user data and disable login. This cannot be undone.")) return;

        setProcessing(true);
        try {
            const response = await fetch("/api/admin/customers/anonymize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerId: customer?.id,
                    uid: customer?.uid || customer?.id,
                    requestId: deletionRequest?.id
                }),
            });

            if (!response.ok) throw new Error("Anonymization failed");

            toast.success("Customer anonymized successfully.");
            setDeletionRequest(null); // Clear request from view
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Failed to process deletion.");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-nyembo-sky" /></div>;
    if (!customer) return <div className="p-10 text-white">Customer not found</div>;

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/10">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        {customer.name}
                        <Badge variant="outline" className={customer.status === 'active' ? 'text-green-400 border-green-400/30' : 'text-gray-400'}>
                            {customer.status}
                        </Badge>
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {customer.contactEmail}</span>
                        {customer.companyName && <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {customer.companyName}</span>}
                    </div>
                </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-white/5 border-white/10">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="security">Security & Privacy</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader><CardTitle className="text-white">Customer Details</CardTitle></CardHeader>
                        <CardContent className="text-gray-300">
                            <p>Joined: {customer.createdAt?.seconds ? new Date(customer.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown'}</p>
                            {/* Add more details/projects list/tickets here */}
                            <p className="mt-4 italic text-gray-500">More data modules (Projects/Tickets) to be implemented in this view.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="mt-6 space-y-6">
                    {/* Active Deletion Request Panel */}
                    {deletionRequest ? (
                        <Card className="bg-red-500/10 border-red-500/30">
                            <CardHeader>
                                <CardTitle className="text-red-400 flex items-center gap-2">
                                    <ShieldAlert className="w-5 h-5" />
                                    Account Deletion Requested
                                </CardTitle>
                                <CardDescription className="text-red-200/70">
                                    This customer requested account deletion on {new Date(deletionRequest.requestedAt?.seconds * 1000).toLocaleDateString()}.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-black/40 rounded-lg border border-red-500/10">
                                    <h4 className="font-semibold text-white mb-2">GDPR Compliance Action</h4>
                                    <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
                                        <li>Anonymize personal data in `users` and `customers` collections.</li>
                                        <li>Disable Firebase Auth account.</li>
                                        <li>Close this deletion request.</li>
                                        <li>Log administrative action.</li>
                                    </ul>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    variant="destructive"
                                    onClick={handleAnonymize}
                                    disabled={processing}
                                    className="bg-red-600 hover:bg-red-700 w-full md:w-auto"
                                >
                                    {processing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                                    Confirm Data Anonymization
                                </Button>
                            </CardFooter>
                        </Card>
                    ) : (
                        <Card className="bg-white/5 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    No Active Requests
                                </CardTitle>
                                <CardDescription>This customer has not requested any privacy actions.</CardDescription>
                            </CardHeader>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
