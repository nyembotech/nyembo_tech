import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

/**
 * Ensures the Lemon Squeezy client is initialized with the API key.
 * Should be called before any Lemon Squeezy API calls.
 */
export function configureLemonSqueezy() {
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    if (!apiKey) {
        console.warn("LEMONSQUEEZY_API_KEY is not defined in environment variables. Lemon Squeezy calls will fail.");
        // We warn instead of throw to allow build/start without the key present immediately, 
        // but runtime calls should check.
        // Actually, for setup, we can't really do much if it's missing.
        return;
    }
    lemonSqueezySetup({ apiKey, onError: (error) => console.error("Lemon Squeezy Error:", error) });
}
