import type { Metadata } from 'next';

export const siteName = 'Everywhere';
type RobotsObject = NonNullable<Exclude<Metadata['robots'], string>>;

const defaultRobots = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
} satisfies RobotsObject;

export const baseUrl =
  process.env.NODE_ENV === 'development'
    ? new URL('http://localhost:3000')
    : new URL('https://everywhere.sylinko.com');

/**
 * Build a full absolute URL from a relative path.
 */
export function absoluteUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl.origin}${cleanPath}`;
}

/**
 * Create merged metadata with sensible defaults for OpenGraph, Twitter, icons,
 * and optional canonical URL. Hreflang alternates are set per-page.
 */
export function createMetadata(
  override: Metadata & { canonical?: string }
): Metadata {
  const { canonical, ...rest } = override;
  const overrideRobots =
    typeof override.robots === 'object' && override.robots !== null
      ? override.robots
      : undefined;
  const robots: Metadata['robots'] =
    typeof override.robots === 'string'
      ? override.robots
      : {
          ...defaultRobots,
          ...overrideRobots,
        };

  return {
    ...rest,
    metadataBase: baseUrl,
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/Everywhere.webp',
    },
    alternates: {
      ...rest.alternates,
      canonical: canonical ?? rest.alternates?.canonical,
    },
    robots,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: canonical ?? baseUrl.origin,
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
      site: '@everywhere_team',
      creator: '@everywhere_team',
      ...override.twitter,
    },
  };
}
