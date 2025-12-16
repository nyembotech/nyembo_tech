"use client";

import { useParams } from "next/navigation";
import { Link } from "lucide-react"; // Wait, wrong Link
import { ChevronLeft } from "lucide-react";
import NextLink from "next/link"; // Workaround for duplicate name if I imported Link from next/link
import { useAuth } from "@/hooks/use-auth";
import { DocumentVault } from "@/components/projects/document-vault";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function PortalProjectDetailsPage() {
    const params = useParams();
    const projectId = params?.id as string;
    const { user } = useAuth();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            if (!projectId) return;
            try {
                const docRef = doc(db, "projects", projectId);
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    setProject({ id: snap.id, ...snap.data() });
                }
            } catch (e) {
                console.error("Error fetching project", e);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [projectId]);

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-nyembo-sky" /></div>;
    if (!project) return <div className="p-8 text-white">Project not found.</div>;

    // Security check (basic client-side, Firestore rules handle backend)
    // if (project.customerId !== user?.uid) return <div>Access Denied</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8 min-h-screen text-white">
            <div className="flex flex-col gap-2">
                <NextLink href="/portal" className="inline-flex items-center text-sm text-gray-500 hover:text-white transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Dashboard
                </NextLink>
                <h1 className="text-3xl font-bold">{project.title}</h1>
                <p className="text-gray-400">Project Workspace</p>
            </div>

            <div className="p-6 bg-[#020617] border border-white/10 rounded-xl space-y-6">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                        Secure Document Vault
                    </h2>
                    <p className="text-sm text-gray-400 mb-6 max-w-2xl">
                        Securely upload and access your project contracts, designs, and assets.
                        Files are encrypted and only accessible by authorized personnel.
                    </p>

                    <DocumentVault
                        projectId={projectId}
                        customerId={user?.uid || ""}
                        userRole="customer"
                    />
                </div>
            </div>
        </div>
    );
}
