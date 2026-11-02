import { source, policySource } from '@/lib/source';
import { absoluteUrl } from '@/lib/metadata';
import { i18n } from '@/lib/i18n';

export const dynamic = 'force-static';

function link(title: string, path: string, description?: string) {
  return `- [${title.replace(/[\[\]]/g, '\\$&')}](${absoluteUrl(path)})${description ? ': ' + description.replace(/\s+/g, ' ') : ''}`;
}

export function GET() {
  const sections = [
    '# Everywhere',
    '> Everywhere is a desktop AI assistant. Use the language-specific documentation below for product and configuration questions.',
    'Read individual pages when possible. Consult the current pricing and policy pages for authoritative terms rather than inferring them from examples.',
  ];
  for (const lang of i18n.languages) {
    sections.push(
      `## ${lang === 'zh' ? '简体中文' : 'English'}`,
      link('Product', `/${lang}`),
      link('Pricing and supported models', `/${lang}/pricing`),
      link('Downloads', `/${lang}/download`),
      ...policySource
        .getPages(lang)
        .map((page) => link(page.data.title, page.url)),
      ...source
        .getPages(lang)
        .map((page) =>
          link(
            page.data.title,
            `/${lang}/llms.mdx${page.slugs.length ? '/' + page.slugs.join('/') : ''}`,
            page.data.description
          )
        ),
      link('Full documentation (larger context)', `/${lang}/llms-full.txt`)
    );
  }
  return new Response(sections.join('\n\n') + '\n', {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
