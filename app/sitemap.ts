import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nyembotech.com';

    // Static pages
    const staticPages = [
        '',
        '/about',
        '/services',
        '/solutions',
        '/blog',
        '/contact',
        '/academy',
        '/knowledge',
    ];

    // Locales
    const locales = ['en', 'sw', 'de'];

    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Generate entries for each locale
    for (const locale of locales) {
        for (const page of staticPages) {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}${page}`,
                lastModified: new Date(),
                changeFrequency: page === '' ? 'daily' : 'weekly',
                priority: page === '' ? 1.0 : 0.8,
            });
        }
    }

    // Add non-localized pages
    sitemapEntries.push({
        url: `${baseUrl}/api-docs`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
    });

    return sitemapEntries;
}
