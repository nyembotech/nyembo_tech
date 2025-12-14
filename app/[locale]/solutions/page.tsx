import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Solutions | Nyembotech',
    description: 'Enterprise-grade digital solutions tailored for scale. Explore our suite of tools designed for the modern ecosystem.',
    openGraph: {
        title: 'Solutions | Nyembotech',
        description: 'Enterprise-grade digital solutions tailored for scale.',
        images: [{ url: '/api/og?title=Solutions&description=Enterprise-grade digital solutions tailored for scale.', width: 1200, height: 630 }],
    },
};

export default function SolutionsPage() {
    return (
        <div className="min-h-screen bg-[#030912] text-white flex items-center justify-center">
            <h1 className="text-4xl font-bold">Solutions</h1>
        </div>
    );
}
