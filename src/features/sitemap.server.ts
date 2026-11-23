import { policySource, source } from '@/lib/source';
import {
  getDefaultAlternateLanguage,
  getHreflang,
  getLocalePath,
  i18n,
} from '@/lib/i18n';
import { baseUrl } from '@/lib/metadata';
import { staticPages, type StaticPageConfig } from '@/lib/constants';

type SitemapEntry = {
  url: string;
  changeFrequency: StaticPageConfig['changeFrequency'];
  priority: number;
  lastModified?: Date;
  alternates: { languages: Record<string, string> };
};

/**
 * Generate sitemap with:
 * - Multi-language alternates (hreflang)
 * - Actual lastModified dates from page data
 * - Proper priority hierarchy
 * - All locales have a URL prefix (e.g. /en, /zh)
 */
function sitemap(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
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
    path: string,
    options: { xDefault?: string | false } = {}
  ): Record<string, string> {
    const alternates: Record<string, string> = {};
    for (const lang of langs) {
      alternates[getHreflang(lang)] = `${url}${getLocalePath(lang, path)}`;
    }
    if (options.xDefault !== false) {
      const defaultLang = getDefaultAlternateLanguage(langs);
      if (options.xDefault) {
        alternates['x-default'] = `${url}${options.xDefault}`;
      } else if (defaultLang) {
        alternates['x-default'] = `${url}${getLocalePath(defaultLang, path)}`;
      }
    }
    return alternates;
  }

  for (const lang of i18n.languages) {
    entries.push({
      url: `${url}${getLocalePath(lang)}`,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: generateAlternates(i18n.languages, '', { xDefault: '/' }),
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
      if (depth <= 1) {
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
    }
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

function xml(text: string) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
export function sitemapResponse() {
  const entries = sitemap().map(
    ({ url, lastModified, changeFrequency, priority, alternates }) =>
      '<url><loc>' +
      xml(url) +
      '</loc>' +
      Object.entries(alternates.languages)
        .map(
          ([lang, href]) =>
            '<xhtml:link rel="alternate" hreflang="' +
            xml(lang) +
            '" href="' +
            xml(href) +
            '" />'
        )
        .join('') +
      (lastModified
        ? '<lastmod>' + lastModified.toISOString() + '</lastmod>'
        : '') +
      '<changefreq>' +
      changeFrequency +
      '</changefreq><priority>' +
      priority +
      '</priority></url>'
  );
  return new Response(
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' +
      entries.join('\n') +
      '</urlset>',
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  );
}
