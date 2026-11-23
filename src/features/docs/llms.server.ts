import { source, policySource, docsLlms } from '@/lib/source';
import { absoluteUrl } from '@/lib/metadata';
import { i18n } from '@/lib/i18n';

function link(title: string, path: string, description?: string) {
  return `- [${title.replace(/[\[\]]/g, '\\$&')}](${absoluteUrl(path)})${description ? ': ' + description.replace(/\s+/g, ' ') : ''}`;
}

const describedBy = `<${absoluteUrl('/llms.txt')}>; rel="describedby"`;

export async function serveMarkdown({ request }: { request: Request }) {
  const path = new URL(request.url).pathname.replace(/\/$/, '');
  const response = await docsLlms.serve(path);
  if (!response) return new Response('Not Found', { status: 404 });
  response.headers.set('X-Robots-Tag', 'noindex');
  response.headers.set(
    'Link',
    `<${absoluteUrl(path.slice(0, -3))}>; rel="canonical", ${describedBy}`
  );
  return response;
}

export async function llmsFull(lang: string) {
  if (!i18n.languages.includes(lang))
    return new Response('Not Found', { status: 404 });
  return new Response(await docsLlms.full(lang), {
    headers: {
      'Content-Type': 'text/markdown;charset=utf-8',
      'X-Robots-Tag': 'noindex',
      Link: describedBy,
    },
  });
}

export function llmsIndex() {
  const sections = [
    '# Everywhere',
    '> Everywhere is a desktop AI assistant. Use the language-specific documentation below for product and configuration questions.',
    'Read individual pages when possible. Consult the current pricing and policy pages for authoritative terms rather than inferring them from examples.',
  ];
  for (const lang of i18n.languages) {
    const isZh = lang === 'zh';
    sections.push(
      `## ${isZh ? '简体中文' : 'English'}`,
      link(isZh ? '产品首页' : 'Product', `/${lang}`),
      link(
        isZh ? '定价与支持的模型' : 'Pricing and supported models',
        `/${lang}/pricing`
      ),
      link(isZh ? '下载' : 'Downloads', `/${lang}/download`),
      ...policySource
        .getPages(lang)
        .map((page) => link(page.data.title, page.url)),
      ...source
        .getPages(lang)
        .map((page) =>
          link(page.data.title, `${page.url}.md`, page.data.description)
        ),
      link(
        isZh ? '完整文档（大上下文）' : 'Full documentation (larger context)',
        `/${lang}/llms-full.txt`
      )
    );
  }
  return new Response(sections.join('\n\n') + '\n', {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
