"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { seedDatabase } from "@/services/firebase/seed";
import { useState } from "react";
import { Database, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminSettingsPage() {
    const [seeding, setSeeding] = useState(false);
    const [seedSuccess, setSeedSuccess] = useState(false);

    const handleSeed = async () => {
        setSeeding(true);
        try {
            await seedDatabase();
            setSeedSuccess(true);
            setTimeout(() => setSeedSuccess(false), 3000);
        } catch (error) {
            console.error("Seeding failed:", error);
        } finally {
            setSeeding(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage system configurations and data.</p>
            </div>

            <div className="grid gap-6">
                <Card className="bg-card/30 border-white/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Database className="w-5 h-5 text-nyembo-sky" />
                            System Data
                        </CardTitle>
                        <CardDescription>Manage database content and test data.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                            <div>
                                <h3 className="text-white font-medium">Seed Database</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Populate the database with sample Customers, Projects, and Requests.
                                    <br />
                                    <span className="text-yellow-500/80 flex items-center gap-1 mt-1 text-xs">
                                        <AlertTriangle className="w-3 h-3" />
                                        Use this only for testing. It adds new documents.
                                    </span>
                                </p>
                            </div>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={`min-w-[140px] border-nyembo-sky/20 hover:bg-nyembo-sky/10 ${seedSuccess ? 'text-green-400 border-green-500/30' : 'text-nyembo-sky'}`}
                                        disabled={seeding}
                                    >
                                        {seeding ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Seeding...
                                            </>
                                        ) : seedSuccess ? (
                                            <>
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                Done!
                                            </>
                                        ) : (
                                            "Seed Data"
                                        )}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-black/90 border-white/10 text-white">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-white/60">
                                            This will create multiple sample documents in your Customers, Projects, and Project Requests collections.
                                            This action is intended for development and testing purposes.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/5">Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleSeed} className="bg-nyembo-sky text-black hover:bg-nyembo-sky/90">
                                            Confirm Seed
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
