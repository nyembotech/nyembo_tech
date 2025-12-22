"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export function CTAForm() {
    return (
        <section className="py-24 px-4 bg-black">
            <div className="container max-w-4xl mx-auto">
                <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 shadow-2xl overflow-hidden relative">
                    {/* Decorative Blobs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-nyembo-sky/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-nyembo-yellow/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

                    <CardHeader className="text-center relative z-10 pt-12 pb-8">
                        <CardTitle className="text-4xl font-bold text-white mb-2">Transform my space</CardTitle>
                        <p className="text-muted-foreground">Ready to upgrade your infrastructure? Let's talk.</p>
                    </CardHeader>

                    <CardContent className="relative z-10 px-8 pb-12">
                        <form className="grid gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-white">Full Name</Label>
                                    <Input id="name" placeholder="John Doe" className="bg-white/5 border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company" className="text-white">Company</Label>
                                    <Input id="company" placeholder="Acme Inc." className="bg-white/5 border-white/10 text-white" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location" className="text-white">Location</Label>
                                <Input id="location" placeholder="Kinshasa, DRC" className="bg-white/5 border-white/10 text-white" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="type" className="text-white">Property Type</Label>
                                    <Select>
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-white/10 text-white">
                                            <SelectItem value="office">Commercial Office</SelectItem>
                                            <SelectItem value="retail">Retail Store</SelectItem>
                                            <SelectItem value="warehouse">Warehouse</SelectItem>
                                            <SelectItem value="residential">Residential Complex</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="budget" className="text-white">Budget Band</Label>
                                    <Select>
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue placeholder="Select range" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-white/10 text-white">
                                            <SelectItem value="small">$10k - $50k</SelectItem>
                                            <SelectItem value="medium">$50k - $200k</SelectItem>
                                            <SelectItem value="large">$200k+</SelectItem>
                                            <SelectItem value="enterprise">Enterprise</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Button className="w-full mt-6 bg-nyembo-sky text-black hover:bg-nyembo-sky/90 text-lg py-6 font-bold shadow-[0_0_20px_rgba(53,203,248,0.3)]">
                                Submit Request <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
