"use client";

import Link from "next/link";
import { usePathname, useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { motion } from "framer-motion";
import { Globe, Menu } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";

import { useTranslations } from 'next-intl';

const languages = [
    { code: "en", label: "English" },
    { code: "sw", label: "Swahili" },
    { code: "de", label: "Deutsch" },
];

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const params = useParams();
    const currentLocale = (params.locale as string) || "en";
    const t = useTranslations('Navigation');
    const [isOpen, setIsOpen] = useState(false);

    // Helper to switch language while keeping path
    const switchLanguage = (locale: string) => {
        const pathSegments = pathname.split('/');
        // pathSegments[0] is empty, [1] is locale usually
        if (languages.some(l => l.code === pathSegments[1])) {
            pathSegments[1] = locale;
        } else {
            // No locale present (middleware handles this, but for client side Nav)
            pathSegments.splice(1, 0, locale);
        }
        const newPath = pathSegments.join('/') || '/';
        router.push(newPath);
    };

    // Helper to get localized href
    const getLocalizedHref = (href: string) => {
        // If href is '/', it becomes '/en'
        if (href === '/') return `/${currentLocale}`;
        return `/${currentLocale}${href}`;
    };

    // Dynamic nav items from translation
    const navItems = [
        { name: t('home'), href: "/" },
        { name: t('solutions'), href: "/solutions" },
        { name: t('industries'), href: "/industries" },
        { name: t('smartSpaces'), href: "/smart-spaces" },
        { name: t('academy'), href: "/academy" },
        { name: t('about'), href: "/about" },
    ];

    return (
        <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
            <nav className="flex items-center justify-between w-full max-w-7xl px-6 py-4 rounded-2xl bg-card/80 backdrop-blur-md border border-white/10 shadow-neumo min-h-[5rem]">
                {/* Logo */}
                <Link href={`/${currentLocale}`} className="flex-shrink-0 -ml-4">
                    <Logo className="scale-125" />
                </Link>

                {/* Center Links (Desktop) */}
                <div className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => {
                        const localizedHref = getLocalizedHref(item.href);
                        // Simple active check: pathname matches localized Href exactly or starts with it (for child routes)
                        const isActive = pathname === localizedHref || (item.href !== '/' && pathname.startsWith(localizedHref));

                        return (
                            <Link
                                key={item.href}
                                href={localizedHref}
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
                    {/* Contact Link manually since it wasn't in original JSON, or just leave it */}
                    <Link
                        href={getLocalizedHref('/contact')}
                        className={cn("relative px-4 py-2 text-sm font-medium transition-colors hover:text-nyembo-sky", pathname.includes('/contact') ? "text-nyembo-sky" : "text-muted-foreground")}
                    >
                        Contact
                    </Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {/* Language Switcher */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
                                <Globe className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#0c131c] border-white/10">
                            {languages.map((lang) => (
                                <DropdownMenuItem
                                    key={lang.code}
                                    onClick={() => switchLanguage(lang.code)}
                                    className={cn(
                                        "text-white hover:bg-white/10 cursor-pointer",
                                        currentLocale === lang.code && "text-nyembo-sky font-semibold"
                                    )}
                                >
                                    {lang.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="ghost" className="text-nyembo-sky hover:text-nyembo-white hover:bg-white/5 hidden sm:flex">
                        Login
                    </Button>
                    <Button className="bg-nyembo-yellow text-black hover:bg-nyembo-gold shadow-[0_0_15px_rgba(246,227,15,0.3)] hover:shadow-[0_0_20px_rgba(246,227,15,0.5)] transition-all hidden sm:flex">
                        Launch a project
                    </Button>

                    {/* Mobile Menu Trigger */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
                                <Menu className="w-6 h-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-[#0c131c] border-l border-white/10 w-[300px] sm:w-[400px]">
                            <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                            <SheetDescription className="sr-only">Navigation links</SheetDescription>

                            <div className="flex flex-col gap-6 mt-8">
                                <div className="flex flex-col gap-2">
                                    {navItems.map((item) => {
                                        const localizedHref = getLocalizedHref(item.href);
                                        const isActive = pathname === localizedHref || (item.href !== '/' && pathname.startsWith(localizedHref));
                                        return (
                                            <Link
                                                key={item.href}
                                                href={localizedHref}
                                                onClick={() => setIsOpen(false)}
                                                className={cn(
                                                    "px-4 py-3 text-lg font-medium transition-colors hover:text-nyembo-sky rounded-lg hover:bg-white/5",
                                                    isActive ? "text-nyembo-sky bg-white/5" : "text-muted-foreground"
                                                )}
                                            >
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                    <Link
                                        href={getLocalizedHref('/contact')}
                                        onClick={() => setIsOpen(false)}
                                        className={cn("px-4 py-3 text-lg font-medium transition-colors hover:text-nyembo-sky rounded-lg hover:bg-white/5", pathname.includes('/contact') ? "text-nyembo-sky bg-white/5" : "text-muted-foreground")}
                                    >
                                        Contact
                                    </Link>
                                </div>

                                <div className="h-px bg-white/10" />

                                <div className="flex flex-col gap-3">
                                    <Button variant="ghost" className="w-full justify-start text-nyembo-sky hover:text-nyembo-white hover:bg-white/5">
                                        Login
                                    </Button>
                                    <Button className="w-full bg-nyembo-yellow text-black hover:bg-nyembo-gold shadow-[0_0_15px_rgba(246,227,15,0.3)] hover:shadow-[0_0_20px_rgba(246,227,15,0.5)] transition-all">
                                        Launch a project
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header>
    );
}
