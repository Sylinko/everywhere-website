/**
 * JSON-LD Structured Data generators for SEO/GEO (Generative Engine Optimization).
 *
 * Follows schema.org vocabulary and Google's structured data guidelines.
 * @see https://developers.google.com/search/docs/appearance/structured-data
 */

import { RepoUrl } from './github';
import { baseUrl, siteName } from './metadata';

const siteUrl = baseUrl.origin;

// ─── Organization ────────────────────────────────────────────────────────────

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/Everywhere.webp`,
    description:
      'Liberating AI from browser tabs and standalone apps, making it a ubiquitous, native capability of your operating system.',
    sameAs: [
      RepoUrl,
      'https://discord.gg/5fyg6nE3yn',
    ],
    foundingDate: '2026',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: `${siteUrl}/en/docs/community/support`,
    },
  } as const;
}

// ─── WebSite (with SearchAction for sitelinks search box) ────────────────────

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    description:
      'Everywhere — liberating AI from browser tabs and standalone apps, making it a ubiquitous, native capability of your operating system.',
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

// ─── SoftwareApplication ─────────────────────────────────────────────────────

export function softwareApplicationSchema(lang: string) {
  const descriptions: Record<string, string> = {
    'en':
      'The on-demand AI desktop assistant that perceives your screen for instant help.',
    'zh':
      '一款呼之即来的 AI 桌面助手。秒懂你的屏幕，即刻提供协助。',
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteName,
    operatingSystem: ['Windows', 'macOS'],
    applicationCategory: 'UtilitiesApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: descriptions[lang] ?? descriptions['en'],
    url: `${siteUrl}/${lang}/download`,
    downloadUrl: `${siteUrl}/${lang}/download`,
    softwareVersion: 'latest',
    author: {
      '@type': 'Organization',
      name: 'Sylinko',
      url: 'https://sylinko.com',
    },
    screenshot: `${siteUrl}/Everywhere.webp`,
  } as const;
}

// ─── BreadcrumbList ──────────────────────────────────────────────────────────

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

// ─── Article (for docs pages) ────────────────────────────────────────────────

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

// ─── FAQPage ─────────────────────────────────────────────────────────────────

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

// ─── Helper: render JSON-LD script tag ───────────────────────────────────────

export function JsonLdScript({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
