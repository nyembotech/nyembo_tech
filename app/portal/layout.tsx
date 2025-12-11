import { Logo } from "@/components/ui/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-card/30 backdrop-blur-md sticky top-0 z-50">
                <Link href="/portal">
                    <Logo />
                </Link>

                <div className="flex items-center gap-6">
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link href="/portal" className="text-nyembo-sky drop-shadow-[0_0_5px_rgba(53,203,248,0.5)]">Mission Control</Link>
                        <Link href="/portal/projects" className="text-muted-foreground hover:text-white transition-colors">Projects</Link>
                        <Link href="/portal/support" className="text-muted-foreground hover:text-white transition-colors">Support</Link>
                    </nav>

                    <div className="h-8 w-px bg-white/10 mx-2" />

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white rounded-full">
                            <Bell className="w-5 h-5" />
                        </Button>
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-bold text-white">Acme Corp</div>
                                <div className="text-xs text-muted-foreground">Enterprise Plan</div>
                            </div>
                            <Avatar className="h-10 w-10 border-2 border-nyembo-sky/30">
                                <AvatarFallback className="bg-nyembo-sky/10 text-nyembo-sky">AC</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-8 container mx-auto max-w-7xl">
                {children}
            </main>
        </div>
    );
}
