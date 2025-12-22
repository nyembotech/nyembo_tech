"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart } from "lucide-react";
import { generateCheckoutUrl } from "@/actions/checkout";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";

interface LemonBuyButtonProps {
    storeId: string;
    variantId: string;
    label?: string;
    className?: string; // Allow styling overrides
}

export function LemonBuyButton({ storeId, variantId, label = "Buy Now", className }: LemonBuyButtonProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleBuy = async () => {
        if (!user) {
            toast.error("Please login to purchase.");
            return;
        }

        setLoading(true);
        try {
            const url = await generateCheckoutUrl(storeId, variantId, user.uid, user.email || "");
            if (url) {
                // Open Checkout in new tab or specific logic (Lemon Squeezy Overlay handles it if configured, but URL redirect works too)
                window.location.href = url;
            } else {
                toast.error("Could not generate checkout.");
            }
        } catch (error) {
            console.error("Checkout Error:", error);
            toast.error("Failed to start checkout.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button onClick={handleBuy} disabled={loading} className={className}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShoppingCart className="w-4 h-4 mr-2" />}
            {label}
        </Button>
    );
}
