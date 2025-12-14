import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "@/app/globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { ClientLayoutWrapper } from "@/components/layout/client-layout-wrapper";
import { AuthProvider } from "@/context/auth-context";
import { AnalyticsWrapper } from "@/components/analytics-wrapper";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
    title: "Nyembotech | Future-grade AI Software",
    description: "Future-grade AI software for Africa. European engineering, African speed.",
};

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Validate that the incoming `locale` parameter is valid
    if (!['en', 'sw', 'de'].includes(locale)) {
        // notFound(); // Can trigger 404
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={`${spaceGrotesk.variable} font-sans antialiased`}>
                <NextIntlClientProvider messages={messages}>
                    <AuthProvider>
                        <AnalyticsWrapper />
                        <ClientLayoutWrapper>
                            {children}
                        </ClientLayoutWrapper>
                    </AuthProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
