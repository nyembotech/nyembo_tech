"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { motion } from "framer-motion";

const navItems = [
    { name: "Home", href: "/" },
    { name: "Solutions", href: "/solutions" },
    { name: "Industries", href: "/industries" },
    { name: "Smart Spaces", href: "/smart-spaces" },
    { name: "Academy", href: "/academy" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
            <nav className="flex items-center justify-between w-full max-w-7xl px-6 py-4 rounded-2xl bg-card/80 backdrop-blur-md border border-white/10 shadow-neumo min-h-[5rem]">
                {/* Logo */}
                <Link href="/" className="flex-shrink-0 -ml-4">
                    <Logo className="scale-125" />
                </Link>

                {/* Center Links */}
                <div className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative px-4 py-2 text-sm font-medium transition-colors hover:text-nyembo-sky",
                                    isActive ? "text-nyembo-sky" : "text-muted-foreground"
                                )}
                            >
                                {item.name}
                                {isActive && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-nyembo-sky shadow-[0_0_8px_var(--nyembo-sky)]"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="text-nyembo-sky hover:text-nyembo-white hover:bg-white/5 hidden sm:flex">
                        Login
                    </Button>
                    <Button className="bg-nyembo-yellow text-black hover:bg-nyembo-gold shadow-[0_0_15px_rgba(246,227,15,0.3)] hover:shadow-[0_0_20px_rgba(246,227,15,0.5)] transition-all">
                        Launch a project
                    </Button>
                </div>
            </nav>
        </header>
    );
}
