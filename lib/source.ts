import { docs, policies } from 'fumadocs-mdx:collections/server';
import { type InferPageType, llms, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { i18n } from '@/lib/i18n';
import { absoluteUrl } from '@/lib/metadata';

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: '/docs',
  i18n,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const policySource = loader({
  baseUrl: '/policies',
  i18n,
  source: policies.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export function pageImageFilename(lang = i18n.defaultLanguage) {
  return lang === i18n.defaultLanguage ? 'image.png' : `image.${lang}.png`;
}

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, pageImageFilename(page.locale)];

  return {
    segments,
    url: `/og/docs/${segments.join('/')}`,
  };
}

export const docsLlms = llms(source, {
  renderPage: async (page) =>
    `# ${page.data.title}\n\nSource: ${absoluteUrl(page.url)}\n\n${(await page.data.getText('processed')).trim()}\n`,
});
