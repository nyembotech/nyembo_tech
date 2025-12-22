import { SmartSpacesHero } from "@/components/smart-spaces/hero";
import { AutomationGrid } from "@/components/smart-spaces/automation-grid";
import { InteractiveGallery } from "@/components/smart-spaces/interactive-gallery";
import { JourneyTimeline } from "@/components/smart-spaces/journey-timeline";
import { CTAForm } from "@/components/smart-spaces/cta-form";

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Smart Spaces | Nyembotech',
    description: 'Intelligent environments that think, react, and adapt. The future of physical-digital convergence.',
    openGraph: {
        title: 'Smart Spaces | Nyembotech',
        description: 'Intelligent environments that think, react, and adapt.',
        images: [{ url: '/api/og?title=Smart Spaces&description=Intelligent environments that think, react, and adapt.', width: 1200, height: 630 }],
    },
};

export default function SmartSpacesPage() {
    return (
        <main className="bg-black min-h-screen pt-16">
            <SmartSpacesHero />
            <AutomationGrid />
            <InteractiveGallery />
            <JourneyTimeline />
            <CTAForm />
        </main>
    );
}
