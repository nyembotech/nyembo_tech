import { Metadata } from 'next';
import Image from 'next/image';
import { CurrencyConverter } from '@/components/about/currency-converter';
import { ArrowRight, Code2, Rocket, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'About Us | Nyembotech',
    description: 'We are building applications of Today.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#030912] text-white overflow-hidden selection:bg-nyembo-yellow selection:text-black">

            {/* Background Atmosphere */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[128px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[128px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">

                {/* Hero Section */}
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-blue-400">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Intensive Development Capacity
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                            We are building applications of Today.
                        </h1>

                        <p className="text-xl text-gray-400 leading-relaxed max-w-xl">
                            AI is here and we help you use it in your business - to help you proceed with speed and automate repeated tasks where it matters in your Business.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link href="/contact">
                                <Button size="lg" className="bg-white text-black hover:bg-gray-200 rounded-full text-base font-bold px-8">
                                    Start Your Project
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button variant="outline" size="lg" className="rounded-full border-white/20 text-white hover:bg-white/10 px-8">
                                    Contact Us
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Visual / Image */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/30 to-purple-500/30 blur-3xl rounded-full" />
                        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2.5rem] p-6 lg:p-10 transform hover:rotate-1 transition-transform duration-500 shadow-2xl">
                            <Image
                                src="/assets/images/hero-section/hero-about.png"
                                alt="Nyembotech Applications"
                                width={600}
                                height={600}
                                className="w-full h-auto object-contain rounded-2xl"
                                priority
                            />
                        </div>
                    </div>
                </div>

                {/* Features / Why Us */}
                <div className="grid md:grid-cols-3 gap-8 mb-32">
                    {[
                        { icon: Code2, title: "Modern Tech Stack", desc: "Built with the latest frameworks for speed and scalability." },
                        { icon: Rocket, title: "Rapid Deployment", desc: "Go from concept to launch in weeks, not months." },
                        { icon: Globe, title: "Global Standard", desc: "European engineering quality tailored for African markets." }
                    ].map((feature, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
                            <feature.icon className="w-10 h-10 text-nyembo-yellow mb-4" />
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-gray-400">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Pricing / Currency Converter Section */}
                <div className="grid lg:grid-cols-2 gap-16 items-center bg-[#0b121f] rounded-[3rem] p-8 lg:p-16 border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-nyembo-yellow/10 rounded-full blur-[128px] pointer-events-none" />

                    <div className="relative z-10">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">Create a stunning About Us page.</h2>
                        <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                            Have your own customer app for your business. Provide your customers with a seamless, high-performance experience starting today.
                        </p>
                        <ul className="space-y-4 mb-8">
                            {[
                                "Real-time AI Integration",
                                "Multi-currency Support",
                                "Automated Business Logic",
                                "Premium Design System"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-300">
                                    <div className="w-6 h-6 rounded-full bg-nyembo-lime/20 text-nyembo-lime flex items-center justify-center">
                                        <ArrowRight className="w-3 h-3" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="relative z-10 flex justify-center">
                        <CurrencyConverter />
                    </div>
                </div>

            </div>
        </div>
    );
}
