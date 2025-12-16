"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { FileText, Upload, Shield, Eye, Lock, Download, FileCode, Paperclip, CheckCircle2, Loader2, Image as ImageIcon } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { useEffect } from "react";

// --- TYPES ---
export interface ProjectDocument {
    id: string;
    projectId: string;
    customerId: string;
    title: string;
    type: "contract" | "architecture" | "ux" | "training" | "other";
    url: string; // In a real app avoiding mock strings, this would come from storage
    uploadedBy: "admin" | "customer";
    visibility: "admin" | "customer" | "both";
    createdAt: any;
    size?: string;
    mimeType?: string;
    organizationId?: string;
}

// --- UPLOAD DIALOG COMPONENT ---
interface UploadDialogProps {
    projectId: string;
    customerId: string;
    userRole: "admin" | "customer";
    onOpenChange: (open: boolean) => void;
    open: boolean;
}

export function DocumentUploadDialog({ projectId, customerId, userRole, onOpenChange, open }: UploadDialogProps) {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [type, setType] = useState<ProjectDocument["type"]>("contract");
    const [visibility, setVisibility] = useState<ProjectDocument["visibility"]>("admin");
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0); // 2. Add progress state

    const handleUpload = async () => {
        if (!file || !title) return;

        // 3. Add validation
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
            alert("File size exceeds 50MB limit."); // In a real app, use a toast notification
            return;
        }

        setLoading(true);
        setProgress(0);

        // 3. Simulate Progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 95) {
                    clearInterval(interval);
                    return 95;
                }
                return prev + 5;
            });
        }, 100);

        try {
            // SIMULATED UPLOAD (In real app, upload to Storage here)
            // const storageRef = ref(storage, `docs/${projectId}/${file.name}`);
            // await uploadBytes(storageRef, file);
            // const url = await getDownloadURL(storageRef);

            await new Promise(resolve => setTimeout(resolve, 1500)); // Fake latency
            clearInterval(interval);
            setProgress(100);

            const mockUrl = `https://firebasestorage.googleapis.com/v0/b/mock-bucket/o/${file.name}?alt=media`;

            await addDoc(collection(db, "documents"), {
                projectId,
                customerId,
                title,
                type,
                url: mockUrl,
                uploadedBy: userRole,
                // Logic: Admin chooses visibility. Customer uploads are always 'both' (visible to admin and customer).
                visibility: userRole === 'customer' ? 'both' : visibility,
                createdAt: serverTimestamp(),
                size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                mimeType: file.type
            });

            onOpenChange(false);
            setFile(null);
            setTitle("");
            setProgress(0); // Reset progress on success
        } catch (error) {
            console.error("Upload failed", error);
            // In a real app, show an error toast
        } finally {
            setLoading(false);
            clearInterval(interval); // Ensure interval is cleared even on error
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md bg-black/95 border-white/10 text-white backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5 text-nyembo-sky" />
                        Upload Document
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* DROPZONE */}
                    <div
                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors ${file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 hover:border-nyembo-sky/50 hover:bg-white/5'}`}
                    >
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    setFile(e.target.files[0]);
                                    if (!title) setTitle(e.target.files[0].name.split('.')[0]);
                                }
                            }}
                        />
                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                            {file ? (
                                <>
                                    <FileText className="w-10 h-10 text-emerald-500 mb-2" />
                                    <p className="font-bold text-emerald-300 text-sm truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-xs text-emerald-500/60 ">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-10 h-10 text-white/20 mb-2" />
                                    <p className="font-bold text-white/60 text-sm">Click to select file</p>
                                    <p className="text-xs text-white/40">PDF, DOCX, PNG, JPG (Max 50MB)</p>
                                </>
                            )}
                        </label>
                    </div>

                    {/* 5. Render Progress Bar */}
                    {loading && (
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-nyembo-sky transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Document Title</Label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-white/5 border-white/10 text-white"
                            placeholder="e.g. Master Services Agreement"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Tag / Type</Label> {/* Updated Label */}
                            <Select value={type} onValueChange={(v: any) => setType(v)}>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* 4. Updated Select options */}
                                    <SelectItem value="contract">Contract</SelectItem>
                                    <SelectItem value="architecture">Layout/Architecture</SelectItem>
                                    <SelectItem value="ux">UX/Design</SelectItem>
                                    <SelectItem value="training">Training Material</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {userRole === 'admin' && (
                            <div className="space-y-2">
                                <Label>Visibility</Label>
                                <Select value={visibility} onValueChange={(v: any) => setVisibility(v)}>
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin Only (Internal)</SelectItem>
                                        <SelectItem value="customer">Customer Only</SelectItem>
                                        <SelectItem value="both">All (Shared)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" className="text-white/60 hover:text-white" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        onClick={handleUpload}
                        disabled={!file || !title || loading}
                        className="bg-nyembo-sky text-black hover:bg-nyembo-sky/80"
                    >
                        {loading ? (
                            <>Uploading {progress}%...</> // Updated button text
                        ) : (
                            "Upload Securely"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// --- DOCUMENT CARD COMPONENT ---
function DocumentCard({ document, userRole }: { document: ProjectDocument, userRole: "admin" | "customer" }) {
    const getTypeIcon = () => {
        switch (document.type) {
            case 'contract': return <FileText className="w-8 h-8 text-yellow-500" />;
            case 'architecture': return <FileCode className="w-8 h-8 text-blue-500" />;
            case 'ux': return <ImageIcon className="w-8 h-8 text-purple-500" />;
            case 'training': return <CheckCircle2 className="w-8 h-8 text-emerald-500" />;
            default: return <Paperclip className="w-8 h-8 text-gray-500" />;
        }
    };

    const getTypeColor = () => {
        switch (document.type) {
            case 'contract': return "border-yellow-500/30 bg-yellow-500/5 text-yellow-500";
            case 'architecture': return "border-blue-500/30 bg-blue-500/5 text-blue-500";
            case 'ux': return "border-purple-500/30 bg-purple-500/5 text-purple-500";
            case 'training': return "border-emerald-500/30 bg-emerald-500/5 text-emerald-500";
            default: return "border-gray-500/30 bg-gray-500/5 text-gray-500";
        }
    };

    return (
        <Card className="group relative overflow-hidden bg-white/5 border-white/10 hover:border-nyembo-sky/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(56,189,248,0.1)]">
            <div className={`absolute top-0 left-0 w-1 h-full ${getTypeColor().split(' ')[0].replace('border-', 'bg-')}`} />

            <div className="p-5 flex items-start gap-4">
                <div className={`p-3 rounded-xl border ${getTypeColor()}`}>
                    {getTypeIcon()}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-white truncate pr-2 group-hover:text-nyembo-sky transition-colors">{document.title}</h4>
                        {userRole === 'admin' && (
                            <Badge variant="outline" className="text-[10px] h-5 border-white/10 text-gray-500">
                                {document.visibility === 'both' ? <Eye className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                                {document.visibility.toUpperCase()}
                            </Badge>
                        )}
                    </div>

                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <span className="capitalize">{document.type}</span>
                        <span>•</span>
                        <span>{document.size || 'Unknown Size'}</span>
                        <span>•</span>
                        <span>{new Date(document.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                    </p>

                    <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                        <Button size="sm" variant="secondary" className="h-8 text-xs w-full bg-white/10 hover:bg-white/20 text-white">
                            <Download className="w-3 h-3 mr-1" /> Download
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}

// --- MAIN VAULT COMPONENT ---
export function DocumentVault({ projectId, customerId, userRole }: { projectId: string; customerId: string; userRole: "admin" | "customer" }) {
    const [docs, setDocs] = useState<ProjectDocument[]>([]);
    const [openUpload, setOpenUpload] = useState(false);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        let q = query(
            collection(db, "documents"),
            where("projectId", "==", projectId),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            let items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ProjectDocument));

            // Client-side filtering for visibility (redundant security but good UI)
            if (userRole === 'customer') {
                items = items.filter(d => d.visibility !== 'admin');
            }

            setDocs(items);
        });

        return () => unsubscribe();
    }, [projectId, userRole]);

    const filteredDocs = docs.filter(d => filter === 'all' || d.type === filter);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/10">
                    {['all', 'contract', 'architecture', 'ux', 'training'].map(t => (
                        <button
                            key={t}
                            onClick={() => setFilter(t)}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${filter === t ? 'bg-nyembo-sky text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <Button onClick={() => setOpenUpload(true)} className="bg-emerald-500 text-black hover:bg-emerald-400">
                    <Upload className="w-4 h-4 mr-2" /> Upload New Asset
                </Button>
            </div>

            {filteredDocs.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-2xl bg-white/5">
                    <Shield className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <p className="text-white/40 font-mono">No secure documents found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDocs.map(doc => (
                        <DocumentCard key={doc.id} document={doc} userRole={userRole} />
                    ))}
                </div>
            )}

            <DocumentUploadDialog
                open={openUpload}
                onOpenChange={setOpenUpload}
                projectId={projectId}
                customerId={customerId}
                userRole={userRole}
            />
        </div>
    );
}
