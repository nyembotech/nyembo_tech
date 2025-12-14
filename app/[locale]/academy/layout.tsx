import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Academy | Nyembotech',
    description: 'Master the technologies of tomorrow. Elite training for the next generation of digital architects.',
    openGraph: {
        title: 'Academy | Nyembotech',
        description: 'Master the technologies of tomorrow.',
        images: [{ url: '/api/og?title=Academy&description=Master the technologies of tomorrow.', width: 1200, height: 630 }],
    },
};

export default function AcademyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
