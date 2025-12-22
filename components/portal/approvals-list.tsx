"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, FileText, ImageIcon } from "lucide-react";

interface ApprovalItem {
    id: string;
    title: string;
    type: "document" | "design";
    submittedDate: string;
    description: string;
    status: "pending" | "approved" | "rejected";
}

const mockApprovals: ApprovalItem[] = [
    {
        id: "1",
        title: "Q3 Architecture Blueprint",
        type: "document",
        submittedDate: "2024-10-24",
        description: "Detailed system diagram for the new microservices implementation.",
        status: "pending"
    },
    {
        id: "2",
        title: "Homepage Hero Concepts",
        type: "design",
        submittedDate: "2024-10-25",
        description: "Three variations of the landing page hero section.",
        status: "pending"
    }
];

export function ApprovalsList() {
    return (
        <div className="space-y-4">
            {mockApprovals.map((item) => (
                <Card key={item.id} className="bg-white/5 border-white/10 hover:border-nyembo-sky/30 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                                {item.type === "document" ? <FileText className="w-4 h-4 text-blue-400" /> : <ImageIcon className="w-4 h-4 text-purple-400" />}
                                {item.title}
                            </CardTitle>
                            <CardDescription>{item.description}</CardDescription>
                        </div>
                        <Badge variant="outline" className="border-yellow-500 text-yellow-500 bg-yellow-500/10 animate-pulse">
                            Needs Review
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-muted-foreground">Submitted on {item.submittedDate}</span>
                            <div className="flex gap-3">
                                <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-950/30">
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Request Changes
                                </Button>
                                <Button size="sm" className="bg-green-600 hover:bg-green-500 text-white">
                                    <CheckCircle2 className="w-4 h-4 mr-1" />
                                    Approve
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            {mockApprovals.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                    <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    <p>No items waiting for approval.</p>
                </div>
            )}
        </div>
    );
}
