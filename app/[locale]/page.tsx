import { Metadata } from 'next';
import { HomePageClient } from "@/components/home-page-client";

export const metadata: Metadata = {
  title: 'Nyembotech | Architects of the Digital Future',
  description: 'Forging elite digital ecosystems with futuristic design and advanced engineering. Elevate your presence with Nyembotech.',
  openGraph: {
    title: 'Nyembotech | Elite Digital Architects',
    description: 'Forging elite digital ecosystems with futuristic design. Elevate your presence.',
    url: 'https://nyembo.tech',
    siteName: 'Nyembotech',
    images: [
      {
        url: '/api/og?title=Nyembotech&description=Architects of the Digital Future',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nyembotech | Elite Digital Architects',
    description: 'Forging elite digital ecosystems with futuristic design.',
    images: ['/api/og?title=Nyembotech&description=Architects of the Digital Future'],
  },
};

export default function Home() {
  return <HomePageClient />;
}
