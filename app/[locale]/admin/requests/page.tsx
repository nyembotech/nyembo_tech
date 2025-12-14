"use client";

import { useState } from "react";
import { useProjectRequests, ProjectRequest } from "@/hooks/firestore/use-requests";
import { updateDocument, createDocument } from "@/services/firebase/database";
import { logActivity } from "@/services/activity-log";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Filter, ArrowRight, CheckCircle, XCircle, Rocket } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminRequestsPage() {
    const { requests, loading, updateRequestStatus } = useProjectRequests();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<ProjectRequest["status"] | "all">("all");
    const [selectedRequest, setSelectedRequest] = useState<ProjectRequest | null>(null);
    const [processing, setProcessing] = useState(false);
    const router = useRouter();

    const filteredRequests = requests.filter(req => {
        const matchesSearch =
            req.contactInfo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.contactInfo.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.requestCode.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "all" || req.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleConvert = async () => {
        if (!selectedRequest) return;
        setProcessing(true);
        try {
            // 1. Create Project
            const projectTitle = `${selectedRequest.contactInfo.company} - ${selectedRequest.details.solutionType === 'web-app' ? 'Web App' : 'Project'}`;
            const projectId = await createDocument("projects", {
                title: projectTitle,
                description: selectedRequest.details.problem,
                status: "planning",
                progress: 0,
                customerId: "temp-customer-id", // In a real flow, checking/creating customer first is better
                tags: [selectedRequest.details.solutionType, "converted-request"],
                // Date fields are auto-handled by createDocument usually, but types might valid dates
                startDate: new Date(),
                targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // +30 days dummy
            });

            // 2. Update Request
            await updateRequestStatus(selectedRequest.id, "converted", "Converted to project via Admin Console", { projectId });

            toast.success("Mission Converted", { description: `Project ${projectTitle} initialized.` });
            setSelectedRequest(null);
            router.push("/admin/projects"); // Option to go to projects
        } catch (error) {
            console.error("Conversion failed", error);
            toast.error("Conversion Failed");
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!selectedRequest) return;
        setProcessing(true);
        try {
            await updateRequestStatus(selectedRequest.id, "rejected", "Rejected via Admin Console");
            toast.info("Request Rejected");
            setSelectedRequest(null);
        } catch (error) {
            toast.error("Action Failed");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter">MISSION CONTROL</h1>
                    <p className="text-muted-foreground">Incoming project requests.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search requests..."
                            className="pl-8 bg-black/20 border-white/10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 p-1 bg-black/20 rounded-lg w-fit border border-white/5">
                {(["all", "new", "in-review", "converted", "rejected"] as const).map(status => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${statusFilter === status
                                ? "bg-nyembo-sky/20 text-nyembo-sky border border-nyembo-sky/30 shadow-[0_0_10px_rgba(88,255,255,0.2)]"
                                : "text-muted-foreground hover:text-white"
                            }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            {/* Data Table */}
            <div className="border border-white/10 rounded-xl overflow-hidden bg-black/40 backdrop-blur-sm">
                <Table>
                    <TableHeader className="bg-white/5">
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead className="text-white">Code</TableHead>
                            <TableHead className="text-white">Client / Company</TableHead>
                            <TableHead className="text-white">Solution Type</TableHead>
                            <TableHead className="text-white">Budget</TableHead>
                            <TableHead className="text-white">Status</TableHead>
                            <TableHead className="text-white text-right">Received</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-nyembo-sky" />
                                </TableCell>
                            </TableRow>
                        ) : filteredRequests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No requests found in this sector.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRequests.map((req) => (
                                <TableRow
                                    key={req.id}
                                    className="cursor-pointer border-white/5 hover:bg-white/5 transition-colors group"
                                    onClick={() => setSelectedRequest(req)}
                                >
                                    <TableCell className="font-mono text-nyembo-sky group-hover:text-nyembo-sky/80">{req.requestCode}</TableCell>
                                    <TableCell>
                                        <div className="font-bold text-white">{req.contactInfo.company}</div>
                                        <div className="text-xs text-muted-foreground">{req.contactInfo.name}</div>
                                    </TableCell>
                                    <TableCell className="capitalize">
                                        <Badge variant="outline" className="border-white/20 bg-white/5 text-white">
                                            {req.details.solutionType.replace("-", " ")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{req.details.budget}</TableCell>
                                    <TableCell>
                                        <StatusBadge status={req.status} />
                                    </TableCell>
                                    <TableCell className="text-right text-xs text-muted-foreground">
                                        {req.createdAt?.seconds ? formatDistanceToNow(new Date(req.createdAt.seconds * 1000), { addSuffix: true }) : "-"}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Details Drawer */}
            <Sheet open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
                <SheetContent className="w-[400px] sm:w-[540px] border-l border-white/10 bg-[#0a0a0f] text-white">
                    {selectedRequest && (
                        <>
                            <SheetHeader className="mb-6">
                                <SheetTitle className="text-2xl font-black text-white flex items-center gap-3">
                                    {selectedRequest.requestCode}
                                    <StatusBadge status={selectedRequest.status} />
                                </SheetTitle>
                                <SheetDescription>
                                    Reviewing mission request details.
                                </SheetDescription>
                            </SheetHeader>

                            <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] pr-2 custom-scrollbar">
                                {/* Contact Section */}
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Contact Intelligence</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground block text-xs">Name</span>
                                            <span className="font-medium">{selectedRequest.contactInfo.name}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block text-xs">Email</span>
                                            <span className="font-medium text-nyembo-sky">{selectedRequest.contactInfo.email}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block text-xs">Company</span>
                                            <span className="font-medium">{selectedRequest.contactInfo.company}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block text-xs">Location</span>
                                            <span className="font-medium">{selectedRequest.contactInfo.country}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Mission Parameters */}
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Mission Parameters</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-muted-foreground block text-xs mb-1">Problem Statement</span>
                                            <p className="text-sm border-l-2 border-white/20 pl-3 py-1 italic text-white/80">
                                                "{selectedRequest.details.problem}"
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-muted-foreground block text-xs">Solution Type</span>
                                                <span className="font-medium capitalize">{selectedRequest.details.solutionType.replace("-", " ")}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground block text-xs">Timeline</span>
                                                <span className="font-medium capitalize">{selectedRequest.details.timeline.replace("-", " ")}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground block text-xs">Budget Band</span>
                                                <span className="font-medium text-green-400">{selectedRequest.details.budget}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Admin Actions Area */}
                                {selectedRequest.status === "new" && (
                                    <div className="p-4 rounded-xl bg-nyembo-sky/5 border border-nyembo-sky/20">
                                        <h3 className="text-xs uppercase tracking-widest text-nyembo-sky mb-4">Command Actions</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button
                                                variant="outline"
                                                className="border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                                                onClick={handleReject}
                                                disabled={processing}
                                            >
                                                {processing ? <Loader2 className="animate-spin" /> : <><XCircle className="mr-2 w-4 h-4" /> Reject</>}
                                            </Button>
                                            <Button
                                                className="bg-nyembo-sky text-black hover:bg-nyembo-sky/90 font-bold"
                                                onClick={handleConvert}
                                                disabled={processing}
                                            >
                                                {processing ? <Loader2 className="animate-spin" /> : <><Rocket className="mr-2 w-4 h-4" /> Initialize Project</>}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {selectedRequest.status === "converted" && (
                                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                        <h3 className="text-green-500 font-bold mb-1">Mission Initialized</h3>
                                        <p className="text-xs text-muted-foreground">This request has been converted to Project ID: {selectedRequest.projectId}</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        new: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        "in-review": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        converted: "bg-green-500/20 text-green-400 border-green-500/30",
        rejected: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return (
        <Badge variant="outline" className={`capitalize ${styles[status as keyof typeof styles] || styles.new}`}>
            {status.replace("-", " ")}
        </Badge>
    );
}
