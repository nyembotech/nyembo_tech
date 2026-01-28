"use client";

export function AuroraDivider({ flip = false }: { flip?: boolean }) {
    return (
        <div className="relative w-full h-32 md:h-48 overflow-hidden select-none pointer-events-none" aria-hidden>
            <div
                className={`absolute inset-0 animate-aurora-pulse ${flip ? "scale-x-[-1]" : ""}`}
                style={{
                    background: `
                        radial-gradient(ellipse 80% 60% at 30% 50%, rgba(249,168,37,0.35) 0%, transparent 70%),
                        radial-gradient(ellipse 60% 50% at 70% 50%, rgba(59,130,246,0.25) 0%, transparent 70%)
                    `,
                }}
            />
            <div
                className="absolute inset-0 opacity-50"
                style={{
                    background: `
                        radial-gradient(ellipse 40% 40% at 50% 50%, rgba(249,168,37,0.2) 0%, transparent 60%)
                    `,
                }}
            />
        </div>
    );
}
