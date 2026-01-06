import type { Metadata } from 'next';

export const siteName = 'Everywhere';

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/Everywhere.webp',
    },
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: 'https://everywhere.sylinko.com',
      images: '/Everywhere.webp',
      siteName,
      type: 'website',
      ...override.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      images: '/Everywhere.webp',
      ...override.twitter,
    },
  };
}

export const baseUrl =
  process.env.NODE_ENV === 'development'
    ? new URL('http://localhost:3000')
    : new URL(`https://everywhere.sylinko.com`);
