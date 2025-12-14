"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Sparkles } from "lucide-react";

export function WelcomeTour() {
    const { user, profile } = useAuth();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Simple check: if not done, show. 
        // Ideally save 'onboardingCompleted' in user profile.
        // For now, let's just not show it automatically or show once per session if meaningful.
        // Or check localstorage?
        const hasSeenTour = localStorage.getItem("nyembo-portal-tour-seen");
        if (!hasSeenTour) {
            setOpen(true);
        }
    }, []);

    const handleClose = () => {
        setOpen(false);
        localStorage.setItem("nyembo-portal-tour-seen", "true");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="bg-[#0a0a0f] border-nyembo-sky/20 text-white max-w-2xl">
                <DialogHeader>
                    <div className="mx-auto bg-nyembo-sky/10 p-4 rounded-full mb-4 w-fit">
                        <Sparkles className="w-8 h-8 text-nyembo-sky" />
                    </div>
                    <DialogTitle className="text-2xl text-center font-bold">Welcome to the Portal</DialogTitle>
                    <DialogDescription className="text-center text-gray-400">
                        Hello {profile?.displayName || user?.email}, welcome to your mission control center.
                        Here you can track your active projects, submit tickets, and view real-time insights.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid md:grid-cols-3 gap-4 my-6">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                        <h4 className="font-bold text-nyembo-sky mb-2">Track Projects</h4>
                        <p className="text-xs text-gray-400">Real-time status updates on all engineering efforts.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                        <h4 className="font-bold text-nyembo-yellow mb-2">Get Support</h4>
                        <p className="text-xs text-gray-400">Direct line to our support team via tickets.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                        <h4 className="font-bold text-purple-400 mb-2">View Insights</h4>
                        <p className="text-xs text-gray-400">Data-driven metrics on your system performance.</p>
                    </div>
                </div>
                <DialogFooter>
                    <div className="w-full flex justify-center">
                        <Button onClick={handleClose} className="bg-nyembo-sky text-black hover:bg-nyembo-sky/90 min-w-[150px]">
                            Get Started
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
