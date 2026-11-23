import { globSync } from 'node:fs';
import { resolve } from 'node:path';
import { getSlugs } from 'fumadocs-core/source';
import { i18n } from '../lib/i18n.ts';

export function contentPages(section: 'docs' | 'policies', lang: string) {
  const cwd = resolve('content', section, lang);
  return globSync('**/*.{mdx,md}', { cwd })
    .sort()
    .map((file) => {
      const slugs = getSlugs(file.replaceAll('\\', '/'));
      const suffix = slugs.length ? '/' + slugs.join('/') : '';
      return {
        file: resolve(cwd, file),
        lang,
        url: `/${lang}/${section}${suffix}`,
        image:
          section === 'docs'
            ? `/og/docs${suffix}/image${lang === i18n.defaultLanguage ? '' : '.' + lang}.png`
            : `/og/site/${lang}/policies/${slugs.join('/') || 'index'}.png`,
      };
    });
}

// Enumerate from content, never from link crawling: unlinked documents are public too.
export function staticPaths(): string[] {
  return [
    '/sitemap.xml',
    '/llms.txt',
    ...i18n.languages.flatMap((lang) => [
      `/${lang}`,
      `/${lang}/download`,
      `/${lang}/llms-full.txt`,
      ...contentPages('docs', lang).flatMap(({ url }) => [url, `${url}.md`]),
      ...contentPages('policies', lang).map((p) => p.url),
    ]),
  ];
}
