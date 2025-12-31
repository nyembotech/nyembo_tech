import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-black/40 border-t border-white/10 pt-16 pb-8 backdrop-blur-lg">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="block -ml-4">
                            <Logo className="scale-110 origin-left" />
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            Future-grade AI software for Africa. European engineering, African speed. Building the digital infrastructure of tomorrow.
                        </p>
                        <div className="flex items-center gap-4">
                            <SocialLink href="#" icon={<Twitter className="w-4 h-4" />} />
                            <SocialLink href="#" icon={<Linkedin className="w-4 h-4" />} />
                            <SocialLink href="#" icon={<Instagram className="w-4 h-4" />} />
                            <SocialLink href="#" icon={<Facebook className="w-4 h-4" />} />
                        </div>
                    </div>

                    {/* Links Column */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Company</h3>
                        <ul className="space-y-4">
                            <FooterLink href="/about">About Us</FooterLink>
                            <FooterLink href="/careers">Careers</FooterLink>
                            <FooterLink href="/blog">News & Insights</FooterLink>
                            <FooterLink href="/contact">Contact</FooterLink>
                        </ul>
                    </div>

                    {/* Solutions Column */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Solutions</h3>
                        <ul className="space-y-4">
                            <FooterLink href="/solutions/ai">Enterprise AI</FooterLink>
                            <FooterLink href="/solutions/cloud">Cloud Infrastructure</FooterLink>
                            <FooterLink href="/solutions/data">Data Analytics</FooterLink>
                            <FooterLink href="/academy">Nyembotech Academy</FooterLink>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Contact</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                <MapPin className="w-5 h-5 text-nyembo-sky shrink-0" />
                                <span>123 Tech Boulevard,<br />Kinshasa, DRC</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Mail className="w-5 h-5 text-nyembo-sky shrink-0" />
                                <span>hello@nyembotech.com</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Phone className="w-5 h-5 text-nyembo-sky shrink-0" />
                                <span>+243 81 123 4567</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Nyembotech. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <Link href="/privacy" className="hover:text-nyembo-sky transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-nyembo-sky transition-colors">Terms of Service</Link>
                        <Link href="/login?view=admin" className="hover:text-nyembo-sky transition-colors">Admin Portal</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-nyembo-sky hover:text-white transition-all duration-300"
        >
            {icon}
        </Link>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="text-sm text-muted-foreground hover:text-nyembo-sky transition-colors">
                {children}
            </Link>
        </li>
    );
}
