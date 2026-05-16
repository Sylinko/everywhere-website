import { getPageImage, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  PageLastUpdate,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { Feedback } from '@/components/feedback';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { LLMCopyButton, ViewOptions } from '@/components/page-actions';
import { onRateAction } from '@/lib/github';
import { absoluteUrl, createMetadata } from '@/lib/metadata';
import {
  getLanguageAlternates,
  getLocalePath,
  getOpenGraphLocale,
  i18n,
} from '@/lib/i18n';
import { articleSchema, breadcrumbSchema, JsonLdScript } from '@/lib/json-ld';

const owner = 'Sylinko';
const repo = 'everywhere-website';
const branch = 'master';

export default async function Page(props: {
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const { slug, lang } = await props.params;
  const page = source.getPage(slug, lang);
  if (!page) notFound();

  const MDX = page.data.body;
  const lastModifiedTime = page.data.lastModified;
  const pageUrl = absoluteUrl(
    getLocalePath(lang, `docs/${page.slugs.join('/')}`)
  );

  const breadcrumbItems = [
    { name: lang === 'zh' ? '首页' : 'Home', url: absoluteUrl(`/${lang}`) },
    {
      name: lang === 'zh' ? '文档' : 'Docs',
      url: absoluteUrl(`/${lang}/docs`),
    },
    { name: page.data.title, url: pageUrl },
  ];

  const ogImage = getPageImage(page).url;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{
        style: 'clerk',
        enabled: !page.data.full,
      }}
    >
      <JsonLdScript
        data={articleSchema({
          title: page.data.title,
          description: page.data.description,
          url: pageUrl,
          datePublished: lastModifiedTime
            ? new Date(lastModifiedTime).toISOString()
            : undefined,
          dateModified: lastModifiedTime
            ? new Date(lastModifiedTime).toISOString()
            : undefined,
          imageUrl: absoluteUrl(ogImage),
          lang,
        })}
      />
      <JsonLdScript data={breadcrumbSchema(breadcrumbItems)} />

      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-2">
        {page.data.description}
      </DocsDescription>
      <div className="mb-6 flex flex-row flex-wrap items-center gap-2 border-b pb-6">
        <LLMCopyButton
          markdownUrl={`/${lang}/llms.mdx/${page.slugs.join('/')}`}
          lang={lang}
        />
        <ViewOptions
          markdownUrl={`/${lang}/llms.mdx/${page.slugs.join('/')}`}
          githubUrl={`https://github.com/${owner}/${repo}/blob/${branch}/content/docs/${page.path}`}
          lang={lang}
        />
      </div>
      <DocsBody>
        <MDX
          components={{
            ...getMDXComponents({
              a: createRelativeLink(source, page),
            }),
          }}
        />
      </DocsBody>

      <Feedback lang={lang} onRateAction={onRateAction} />

      {lastModifiedTime && <PageLastUpdate date={lastModifiedTime} />}
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ lang: string; slug?: string[] }>;
}): Promise<Metadata> {
  const { slug, lang } = await props.params;
  const page = source.getPage(slug, lang);
  if (!page) notFound();

  const docsPath =
    page.slugs.length === 0 ? 'docs' : `docs/${page.slugs.join('/')}`;
  const pageUrl = absoluteUrl(getLocalePath(lang, docsPath));
  const ogImage = getPageImage(page).url;

  const availableLanguages = i18n.languages.filter((locale) =>
    Boolean(source.getPage(slug, locale))
  );

  return createMetadata({
    title: page.data.title,
    description: page.data.description,
    canonical: pageUrl,
    openGraph: {
      images: ogImage,
      title: page.data.title,
      description: page.data.description,
      url: pageUrl,
      type: 'article',
      locale: getOpenGraphLocale(lang),
    },
    twitter: {
      card: 'summary_large_image',
      images: ogImage,
    },
    alternates: {
      languages:
        availableLanguages.length > 0
          ? getLanguageAlternates(absoluteUrl, docsPath, availableLanguages)
          : undefined,
    },
  });
}
