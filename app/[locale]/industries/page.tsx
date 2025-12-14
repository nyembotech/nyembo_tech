import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Industries | Nyembotech',
    description: 'Transforming sectors with precision engineering. From FinTech to AgriTech, we build the future.',
    openGraph: {
        title: 'Industries | Nyembotech',
        description: 'Transforming sectors with precision engineering.',
        images: [{ url: '/api/og?title=Industries&description=Transforming sectors with precision engineering.', width: 1200, height: 630 }],
    },
};

export default function IndustriesPage() {
    return (
        <div className="min-h-screen bg-[#030912] text-white flex items-center justify-center">
            <h1 className="text-4xl font-bold">Industries</h1>
        </div>
    );
}
