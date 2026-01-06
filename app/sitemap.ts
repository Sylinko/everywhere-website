import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { i18n } from '@/lib/i18n';
import { baseUrl } from '@/lib/metadata';
import { getLocalePath } from '@/lib/i18n';

/**
 * Generate sitemap with:
 * - Multi-language alternates (hreflang) for SEO
 * - Actual lastModified dates from page data
 * - Proper priority hierarchy
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const url = baseUrl.origin;

  function toDate(input: unknown): Date | null {
    if (!input) return null;
    if (input instanceof Date)
      return Number.isNaN(input.getTime()) ? null : input;
    const d = new Date(String(input));
    return Number.isNaN(d.getTime()) ? null : d;
  }

  function docsPathForSlug(slugKey: string): string {
    return slugKey ? `docs/${slugKey}` : 'docs';
  }

  function generateAlternates(
    langs: string[],
    path: string
  ): Record<string, string> {
    const alternates: Record<string, string> = {};
    for (const lang of langs) {
      alternates[lang] = `${url}${getLocalePath(lang, path)}`;
    }
    const defaultLang = langs.includes(i18n.defaultLanguage)
      ? i18n.defaultLanguage
      : langs[0];
    if (defaultLang) {
      alternates['x-default'] = `${url}${getLocalePath(defaultLang, path)}`;
    }
    return alternates;
  }

  const latestModifiedByLang = new Map<string, Date>();

  for (const lang of i18n.languages) {
    entries.push({
      url: `${url}${getLocalePath(lang)}`,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: generateAlternates(i18n.languages, ''),
      },
    });
  }

  const pagesBySlug = new Map<
    string,
    { lang: string; page: ReturnType<typeof source.getPages>[number] }[]
  >();

  for (const lang of i18n.languages) {
    const pages = source.getPages(lang);
    for (const page of pages) {
      const slugKey = page.slugs.join('/');
      if (!pagesBySlug.has(slugKey)) {
        pagesBySlug.set(slugKey, []);
      }
      pagesBySlug.get(slugKey)!.push({ lang, page });

      const lm = toDate(page.data.lastModified);
      if (lm) {
        const prev = latestModifiedByLang.get(lang);
        if (!prev || lm.getTime() > prev.getTime()) {
          latestModifiedByLang.set(lang, lm);
        }
      }
    }
  }

  for (const entry of entries) {
    const match = entry.url.replace(url, '').split('/').filter(Boolean)[0];
    if (!match) continue;
    const lm = latestModifiedByLang.get(match);
    if (lm) entry.lastModified = lm;
  }

  for (const [slugKey, langPages] of pagesBySlug) {
    const availableLangs = langPages.map((p) => p.lang);
    const docsPath = docsPathForSlug(slugKey);

    for (const { lang, page } of langPages) {
      const lastModified = toDate(page.data.lastModified);

      // Determine priority based on page depth
      const depth = page.slugs.length;
      let priority: number;
      if (depth === 1) {
        priority = 0.9;
      } else if (depth === 2) {
        priority = 0.8;
      } else {
        priority = 0.7;
      }

      const isApiPage = page.slugs[0] === 'api';
      const changeFrequency: 'daily' | 'weekly' | 'monthly' = isApiPage
        ? 'monthly'
        : 'weekly';

      entries.push({
        url: `${url}${getLocalePath(lang, docsPath)}`,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency,
        priority,
        alternates: {
          languages: generateAlternates(availableLangs, docsPath),
        },
      });
    }
  }

  return entries;
}