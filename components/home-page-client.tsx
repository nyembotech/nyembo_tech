"use client";

import { HeroSection } from "@/components/landing/hero-section";
import { AuroraDivider } from "@/components/landing/aurora-divider";
import { InfrastructurePrimitives } from "@/components/landing/infrastructure-primitives";
import { DeploymentScenarios } from "@/components/landing/deployment-scenarios";
import { SystemFlow } from "@/components/landing/system-flow";
import { ValidationConsole } from "@/components/landing/validation-console";
import { EnterpriseIntegrity } from "@/components/landing/enterprise-integrity";
import { PricingSection } from "@/components/landing/pricing-section";
import { SystemReadyCta } from "@/components/landing/system-ready-cta";

export function HomePageClient() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#030305] text-white bg-grid-pattern">
            <HeroSection />
            <AuroraDivider />
            <InfrastructurePrimitives />
            <AuroraDivider flip />
            <DeploymentScenarios />
            <AuroraDivider />
            <SystemFlow />
            <AuroraDivider flip />
            <ValidationConsole />
            <AuroraDivider />
            <EnterpriseIntegrity />
            <AuroraDivider flip />
            <PricingSection />
            <AuroraDivider />
            <SystemReadyCta />
        </div>
    );
}
