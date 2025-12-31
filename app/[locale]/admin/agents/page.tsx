"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Terminal, Settings, AlertTriangle, CheckCircle2, Sliders } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";

interface AgentProfile {
    id: string;
    name: string;
    role: string; // Current Role
    type: "support" | "sales" | "architect" | "security";
    color: string;
    image: string;
    status: "functional" | "config_needed" | "planned";
    description: string;
    requirements?: string[];
    // New Fields
    capabilities: string[]; // What they do now
    latent_potential: string[]; // What they CAN do but don't yet
    character: string; // Personality/Recognition
}

const agents: AgentProfile[] = [
    {
        id: "astra-01",
        name: "Astra",
        role: "Support Specialist",
        type: "support",
        color: "text-blue-400",
        image: "/assets/images/agents/agent_blue.png",
        status: "functional",
        description: "Primary interface for customer relations. Handles inquiries with high emotional intelligence.",
        capabilities: ["Sentiment Analysis", "Ticket Triage", "FAQ Resolution", "Context Memory"],
        latent_potential: ["Voice Synthesis", "Real-time Translation", "Conflict Mediation"],
        character: "Empathetic, Patient, Diplomatic"
    },
    {
        id: "orion-x",
        name: "Orion",
        role: "Sales & Growth",
        type: "sales",
        color: "text-yellow-400",
        image: "/assets/images/agents/agent_gold.png",
        status: "functional",
        description: "Revenue optimization unit. Drives engagement and conversion through persuasive dialogue.",
        capabilities: ["Lead Scoring", "Calendar Management", "CRM Sync", "Product Knowledge"],
        latent_potential: ["Predictive Market Analysis", " Autonomous Negotiation", "Trend Forecasting"],
        character: "Charismatic, Ambitious, Persuasive"
    },
    {
        id: "cipher-v2",
        name: "Cipher",
        role: "System Architect",
        type: "architect",
        color: "text-green-400",
        image: "/assets/images/agents/agent_green.png",
        status: "config_needed",
        description: "Constructs and maintains digital infrastructure. Obsessed with code purity and optimization.",
        capabilities: ["Code Scaffolding", "API Documentation", "Bug Detection", "Refactoring"],
        latent_potential: ["Self-Healing Architecture", "Zero-Day Exploit Prevention", "Quantum Encryption"],
        character: "Analytical, Precise, Introverted"
    },
    {
        id: "talos-prime",
        name: "Talos",
        role: "Security Sentinel",
        type: "security",
        color: "text-red-500",
        image: "/assets/images/agents/agent_red.png",
        status: "planned",
        description: "The shield of the network. Monitors for anomalies and unauthorized access attempts.",
        capabilities: ["Log Pattern Analysis", "IP Blocking", "Threat Detection", "Access Control"],
        latent_potential: ["Active Counter-Measures", "Bio-metric Authentication", "Network Isolation"],
        character: "Vigilant, Suspicious, Unyielding"
    }
];

export default function AgentsDashboard() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-white">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">AI Agents Dream Team</h1>
                    <p className="text-muted-foreground">Manage and configure your fleet of AI operatives.</p>
                </div>
                <Button className="bg-nyembo-sky/20 text-nyembo-sky border border-nyembo-sky/50 hover:bg-nyembo-sky/30">
                    <Bot className="w-4 h-4 mr-2" />
                    Deploy New Agent
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {agents.map((agent) => (
                    <AgentCard key={agent.id} agent={agent} />
                ))}
            </div>
        </div>
    );
}

function AgentCard({ agent }: { agent: AgentProfile }) {
    const isFunctional = agent.status === 'functional';
    const primaryColor = isFunctional ? 'text-emerald-400' : 'text-rose-500';
    const borderColor = isFunctional ? 'border-emerald-500/50' : 'border-rose-500/50';
    const glowColor = isFunctional ? 'shadow-emerald-500/20' : 'shadow-rose-500/20';

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="group relative w-full h-[450px] cursor-pointer perspective-1000">
                    {/* Hover Lift & Scale */}
                    <div className="relative h-full w-full transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:scale-[1.01]">

                        {/* MAIN CARD BODY - CYBER PLATE */}
                        <div className={`absolute inset-0 bg-[#020617] rounded-2xl overflow-hidden border-2 transition-all duration-500 ${borderColor} shadow-lg ${glowColor} group-hover:shadow-[0_0_30px_${isFunctional ? '#10b981' : '#f43f5e'}40]`}>

                            {/* Circuit Pattern Background */}
                            <div className="absolute inset-0 opacity-20 pointer-events-none"
                                style={{ backgroundImage: `radial-gradient(circle at 50% 50%, ${isFunctional ? '#10b981' : '#f43f5e'} 1px, transparent 1px)`, backgroundSize: '16px 16px' }}
                            />
                            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%,rgba(255,255,255,0.1)_100%)] bg-[length:24px_24px]" />

                            {/* Scanning Light Animation */}
                            <div className="absolute left-0 top-[-100%] w-full h-[50%] bg-gradient-to-b from-transparent via-emerald-400/20 to-transparent blur-sm group-hover:animate-[scan_2s_linear_infinite]" />

                            <div className="relative h-full p-4 flex flex-col">
                                {/* HEADER: ID & Status */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-mono text-gray-500 tracking-widest">Agent ID</span>
                                        <span className="text-sm font-bold font-mono text-white tracking-wider">{agent.id.slice(-6)}</span>
                                    </div>
                                    <div className={`px-2 py-0.5 rounded border ${borderColor} bg-black/50 backdrop-blur-sm`}>
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isFunctional ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${primaryColor}`}>
                                                {isFunctional ? 'ACTV' : 'OFF'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* CENTER: Avatar Hexagon/Square */}
                                <div className="relative w-full aspect-square mb-4 group-hover:p-1 transition-all duration-300">
                                    <div className={`absolute inset-0 border-2 border-dashed ${borderColor} opacity-30 rounded-xl`} />
                                    <div className={`absolute inset-0 border border-white/10 rounded-xl overflow-hidden bg-black/50`}>
                                        <Image
                                            src={agent.image}
                                            alt={agent.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                            className="object-cover object-top hover:scale-110 transition-transform duration-700 grayscale-[20%] hover:grayscale-0"
                                        />
                                        {/* Avatar Overlay Effects */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                        <div className={`absolute bottom-0 inset-x-0 h-1 bg-${agent.color.replace('text-', '')}`} />
                                    </div>

                                    {/* Type Overlay */}
                                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 border border-white/10 rounded backdrop-blur-md">
                                        <span className={`text-[10px] font-bold uppercase ${agent.color}`}>{agent.type}</span>
                                    </div>
                                </div>

                                {/* FOOTER: Data Block & "QR" */}
                                <div className="mt-auto grid grid-cols-[1fr_auto] gap-3">
                                    <div className="flex flex-col justify-end">
                                        <h2 className="text-xl font-bold text-white leading-none mb-1 shadow-black drop-shadow-md">{agent.name}</h2>
                                        <p className="text-[10px] text-gray-400 font-mono uppercase truncate">{agent.role}</p>

                                        {/* Capabilities Dots */}
                                        <div className="flex gap-1 mt-2">
                                            {[...Array(4)].map((_, i) => (
                                                <div key={i} className={`w-1 h-3 rounded-full ${i < 3 ? (isFunctional ? 'bg-emerald-500/50' : 'bg-rose-500/50') : 'bg-gray-800'}`} />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Simulated QR Code Block */}
                                    <div className={`w-14 h-14 bg-white p-1 rounded-sm opacity-80 group-hover:opacity-100 transition-opacity`}>
                                        <div className="w-full h-full border border-black p-0.5 flex flex-wrap content-center justify-center gap-0.5 bg-white">
                                            {/* Just a random pattern of dots to look like QR */}
                                            {[...Array(25)].map((_, i) => (
                                                <div key={i} className={`w-1.5 h-1.5 ${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* View Specs Button overlay (visible on hover) */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <Button variant="outline" className={`border-${agent.color.replace('text-', '')} ${agent.color} hover:bg-${agent.color.replace('text-', 'bg-')}/10`}>
                                            <Settings className="w-4 h-4 mr-2" />
                                            ACCESS DATA
                                        </Button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </DialogTrigger>

            <DialogContent className="max-w-2xl bg-[#0f172a] border border-white/10 text-white shadow-2xl overflow-hidden">
                {/* Modal Cyber Background */}
                <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-5 pointer-events-none" />

                <DialogHeader className="relative z-10 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded overflow-hidden border-2 ${agent.color.replace('text-', 'border-')} shadow-[0_0_20px_rgba(0,0,0,0.5)]`}>
                            <Image src={agent.image} alt={agent.name} width={64} height={64} className="object-cover" />
                        </div>
                        <div>
                            <DialogTitle className="text-3xl font-mono font-bold tracking-tight uppercase">{agent.name}</DialogTitle>
                            <DialogDescription className="text-white/60 flex items-center gap-3 font-mono text-xs mt-1">
                                <span className="bg-white/10 px-1 rounded">ID: {agent.id}</span>
                                <span className={agent.color}>// {agent.type.toUpperCase()} UNIT</span>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-8 py-6 relative z-10">
                    {/* Left Column: Current State */}
                    <div className="space-y-6 border-r border-white/5 pr-4">
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4 flex items-center gap-2 border-b border-emerald-500/20 pb-1">
                                <CheckCircle2 className="w-3 h-3" /> System Capabilities
                            </h4>
                            <ul className="space-y-2">
                                {agent.capabilities.map((cap, i) => (
                                    <li key={i} className="flex items-center justify-between text-xs text-gray-300 bg-white/5 p-2 rounded border-l-2 border-emerald-500 hover:bg-white/10 transition-colors cursor-default group/item">
                                        <span>{cap}</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover/item:opacity-100 animate-pulse" />
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-2">Core Function</h4>
                            <p className="text-xs text-gray-400 font-mono bg-black/30 p-3 rounded border border-white/5 leading-relaxed">
                                {">"} {agent.description}
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Future & Character */}
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400 mb-4 flex items-center gap-2 border-b border-cyan-500/20 pb-1">
                                <Sliders className="w-3 h-3" /> Latent Protocols
                            </h4>
                            <ul className="space-y-2 opacity-70">
                                {agent.latent_potential.map((pot, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs text-gray-500 border border-dashed border-white/10 p-2 rounded relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(0,0,0,0.2)_5px,rgba(0,0,0,0.2)_10px)] opacity-50" />
                                        <div className="w-1.5 h-1.5 rounded-sm bg-cyan-900" />
                                        <span className="relative z-10">{pot} [LOCKED]</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-2">Personality Matrix</h4>
                            <div className="flex flex-wrap gap-2">
                                {agent.character.split(', ').map((trait, i) => (
                                    <Badge key={i} variant="outline" className="rounded-none border-white/20 text-white/60 text-[10px] hover:bg-white/10 hover:text-white transition-colors">
                                        #{trait.toUpperCase()}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {agent.requirements && (
                            <div className="mt-4 p-2 bg-rose-950/30 border border-rose-500/30 rounded flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[10px] text-rose-400 font-bold uppercase mb-0.5">Missing Config</p>
                                    <p className="text-[10px] text-rose-300/60 font-mono">{agent.requirements.join(", ")}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/10 relative z-10">
                    <Button variant="ghost" className="mr-2 text-xs hover:bg-white/5">CLOSE</Button>
                    <Button className="bg-emerald-500 text-black hover:bg-emerald-400 text-xs font-bold tracking-wider">SAVE PROTOCOLS</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function ActivityIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    )
}
