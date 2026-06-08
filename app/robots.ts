import type { MetadataRoute } from 'next';
import { baseUrl } from '@/lib/metadata';

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = `${baseUrl.origin}/sitemap.xml`;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/og/',
          '/*/llms-full.txt',
          '/*/llms.mdx/',
          '/*/pricing/upgrade-notice/',
        ],
      },
    ],
    sitemap: sitemapUrl,
  };
}
