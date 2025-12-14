import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us | Nyembotech',
    description: 'We are the architects of the digital future. Bridging European rigor with African velocity.',
    openGraph: {
        title: 'About Us | Nyembotech',
        description: 'We are the architects of the digital future.',
        images: [{ url: '/api/og?title=About Us&description=Architects of the digital future.', width: 1200, height: 630 }],
    },
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#030912] text-white flex items-center justify-center">
            <h1 className="text-4xl font-bold">About Us</h1>
        </div>
    );
}
