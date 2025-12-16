import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    showText?: boolean;
}

export function Logo({ className, showText = false }: LogoProps) {
    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            <div className="relative h-24 w-24 transition-transform hover:scale-105 duration-300">
                <div className="absolute inset-0 bg-nyembo-sky/20 blur-xl rounded-full opacity-0 hover:opacity-100 transition-opacity duration-500" />
                <Image
                    src="/assets/images/logo/logo.png"
                    alt="Nyembotech logo"
                    fill
                    sizes="96px"
                    className="object-contain drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                    priority
                />
            </div>
        </div>
    );
}
