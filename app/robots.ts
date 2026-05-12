import type { MetadataRoute } from 'next';
import { baseUrl } from '@/lib/metadata';

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = `${baseUrl.origin}/sitemap.xml`;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/og/', '/*/llms-full.txt', '/*/llms.mdx/'],
      },
    ],
    sitemap: sitemapUrl,
    host: baseUrl.hostname,
  };
}
