import type { MetadataRoute } from 'next';
import { policySource, source } from '@/lib/source';
import {
  getDefaultAlternateLanguage,
  getHreflang,
  getLocalePath,
  i18n,
} from '@/lib/i18n';
import { baseUrl } from '@/lib/metadata';
import { staticPages } from '@/lib/constants';

/**
 * Generate sitemap with:
 * - Multi-language alternates (hreflang)
 * - Actual lastModified dates from page data
 * - Proper priority hierarchy
 * - All locales have a URL prefix (e.g. /en, /zh)
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

  function policiesPathForSlug(slugKey: string): string {
    return slugKey ? `policies/${slugKey}` : 'policies';
  }

  function generateAlternates(
    langs: string[],
    path: string
  ): Record<string, string> {
    const alternates: Record<string, string> = {};
    for (const lang of langs) {
      alternates[getHreflang(lang)] = `${url}${getLocalePath(lang, path)}`;
    }
    const defaultLang = getDefaultAlternateLanguage(langs);
    if (defaultLang) {
      alternates['x-default'] = `${url}${getLocalePath(defaultLang, path)}`;
    }
    return alternates;
  }

  const latestModifiedByLang = new Map<string, Date>();
  const homeEntries: MetadataRoute.Sitemap = [];

  for (const lang of i18n.languages) {
    const entry: MetadataRoute.Sitemap[number] = {
      url: `${url}${getLocalePath(lang)}`,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: generateAlternates(i18n.languages, ''),
      },
    };
    entries.push(entry);
    homeEntries.push(entry);
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

  const policiesBySlug = new Map<
    string,
    { lang: string; page: ReturnType<typeof policySource.getPages>[number] }[]
  >();

  for (const lang of i18n.languages) {
    const pages = policySource.getPages(lang);
    for (const page of pages) {
      const slugKey = page.slugs.join('/');
      if (!policiesBySlug.has(slugKey)) {
        policiesBySlug.set(slugKey, []);
      }
      policiesBySlug.get(slugKey)!.push({ lang, page });

      const lm = toDate(page.data.lastModified);
      if (lm) {
        const prev = latestModifiedByLang.get(lang);
        if (!prev || lm.getTime() > prev.getTime()) {
          latestModifiedByLang.set(lang, lm);
        }
      }
    }
  }

  for (const entry of homeEntries) {
    const match = entry.url.replace(url, '').split('/').filter(Boolean)[0];
    if (!match) continue;
    const lm = latestModifiedByLang.get(match);
    if (lm) entry.lastModified = lm;
  }

  for (const [slugKey, langPages] of policiesBySlug) {
    const availableLangs = langPages.map((p) => p.lang);
    const policiesPath = policiesPathForSlug(slugKey);

    for (const { lang, page } of langPages) {
      const lastModified = toDate(page.data.lastModified);

      entries.push({
        url: `${url}${getLocalePath(lang, policiesPath)}`,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: 'monthly',
        priority: 0.4,
        alternates: {
          languages: generateAlternates(availableLangs, policiesPath),
        },
      });
    }
  }

  for (const { path, priority, changeFrequency } of staticPages) {
    for (const lang of i18n.languages) {
      entries.push({
        url: `${url}${getLocalePath(lang, path)}`,
        changeFrequency,
        priority,
        alternates: {
          languages: generateAlternates(i18n.languages, path),
        },
      });
    }
  }

  return entries;
}
