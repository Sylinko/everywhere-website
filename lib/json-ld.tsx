/**
 * JSON-LD Structured Data generators for SEO/GEO (Generative Engine Optimization).
 *
 * Follows schema.org vocabulary and Google's structured data guidelines.
 * @see https://developers.google.com/search/docs/appearance/structured-data
 */

import { EverywhereDescriptions, ProductHuntUrl } from './constants';
import { RepoUrl } from './github';
import { baseUrl, siteName } from './metadata';

const siteUrl = baseUrl.origin;

export function organizationSchema({ description }: { description: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/Everywhere.webp`,
    description,
    sameAs: [
      RepoUrl,
      ProductHuntUrl
    ],
    foundingDate: '2026',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      url: `${siteUrl}/en/docs/community/support`,
    },
  } as const;
}

export function websiteSchema({ title, description }: { title: string; description: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: title,
    url: siteUrl,
    description,
    inLanguage: ['en', 'zh'],
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/en/docs?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  } as const;
}

export function softwareApplicationSchema(lang: string) {

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteName,
    operatingSystem: ['Windows', 'macOS'],
    applicationCategory: 'UtilitiesApplication',
    description: EverywhereDescriptions[lang] ?? EverywhereDescriptions['en'],
    url: `${siteUrl}/${lang}/download`,
    downloadUrl: `${siteUrl}/${lang}/download`,
    author: {
      '@type': 'Organization',
      name: 'Sylinko',
      url: 'https://sylinko.com',
    },
  } as const;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  } as const;
}

export function webPageSchema({
  url,
  lang,
}: {
  url: string;
  lang: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: siteName,
    description: EverywhereDescriptions[lang] ?? EverywhereDescriptions['en'],
    url,
    inLanguage: lang,
    isPartOf: {
      '@type': 'WebSite',
      name: siteName,
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}/Everywhere.webp`,
    },
  } as const;
}

export function articleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  imageUrl,
  lang,
}: {
  title: string;
  description?: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  imageUrl?: string;
  lang: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description: description ?? undefined,
    url,
    datePublished: datePublished ?? undefined,
    dateModified: dateModified ?? datePublished ?? undefined,
    image: imageUrl ?? undefined,
    inLanguage: lang,
    author: {
      '@type': 'Organization',
      name: 'Sylinko',
      url: 'https://sylinko.com',
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/Everywhere.webp`,
      },
    },
  } as const;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export function faqSchema(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  } as const;
}

export function JsonLdScript({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
