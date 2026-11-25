import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { i18n } from '@/lib/i18n';
import { getPolicyOgImageUrl } from '@/lib/metadata';
import { contentLoaders } from './mdx';

type Section = 'docs' | 'policies';
type DocumentRequest = { lang: string; section: Section; slug: string };

function getDocSeoTitle(
  lang: string,
  section: Section,
  slugs: string[],
  title: string
): string {
  if (section !== 'docs') return title;

  const isZh = lang === 'zh';
  const slugPath = slugs.join('/');
  if (slugPath === 'chat-tools/mcp') {
    return isZh ? 'MCP 工具集成配置' : 'MCP Tool Integration';
  }
  if (slugPath === 'chat-tools/platform-specific/everything') {
    return isZh ? 'Everything 本地文件搜索工具' : 'Everything File Search Tool';
  }

  return title;
}

const getPage = createServerFn({ method: 'GET' })
  .validator((input: DocumentRequest) => {
    if (
      !input ||
      typeof input.slug !== 'string' ||
      !i18n.languages.includes(input.lang) ||
      (input.section !== 'docs' && input.section !== 'policies')
    )
      throw notFound();
    return input;
  })
  .handler(async ({ data: { lang, section, slug } }) => {
    const { source, policySource, getPageImage } = await import('@/lib/source');
    const collection = section === 'docs' ? source : policySource;
    const slugs = slug.split('/').filter(Boolean);
    const page = collection.getPage(slugs, lang);
    if (!page) throw notFound();

    const suffix = slugs.length ? '/' + slugs.join('/') : '';
    return {
      lang,
      section,
      path: section + suffix,
      file: page.path,
      title: page.data.title,
      seoTitle: getDocSeoTitle(lang, section, slugs, page.data.title),
      description: page.data.description,
      full: page.data.full,
      dateModified: page.data.lastModified?.toISOString(),
      image:
        section === 'docs'
          ? getPageImage(page).url
          : getPolicyOgImageUrl(lang, slugs),
      article: section === 'docs',
      markdownUrl: section === 'docs' ? `${page.url}.md` : undefined,
      languages: i18n.languages.filter((locale) =>
        Boolean(collection.getPage(slugs, locale))
      ),
      tree: await collection.serializePageTree(collection.pageTree[lang]),
    };
  });

export type DocumentData = Awaited<ReturnType<typeof getPage>>;

export async function loadDocument(section: Section, lang: string, slug = '') {
  const page = await getPage({ data: { section, lang, slug } });
  await contentLoaders[section].preload(page.file);
  return page;
}
