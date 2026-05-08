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
import { absoluteUrl } from '@/lib/metadata';
import { i18n } from '@/lib/i18n';
import {
  articleSchema,
  breadcrumbSchema,
  JsonLdScript,
} from '@/lib/json-ld';

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
  const pageUrl = absoluteUrl(`/${lang}/docs/${page.slugs.join('/')}`);

  const breadcrumbItems = [
    { name: lang === 'zh-CN' ? '首页' : 'Home', url: absoluteUrl(`/${lang}`) },
    { name: lang === 'zh-CN' ? '文档' : 'Docs', url: absoluteUrl(`/${lang}/docs`) },
    { name: page.data.title, url: pageUrl }
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

  const pageUrl = absoluteUrl(`/${lang}/docs/${page.slugs.join('/')}`);
  const ogImage = getPageImage(page).url;
  const slugPath = page.slugs.join('/');

  // Build hreflang alternates for all available languages
  const languageAlternates: Record<string, string> = {};
  for (const l of i18n.languages) {
    const altPage = source.getPage(slug, l);
    if (altPage) {
      languageAlternates[l] = absoluteUrl(`/${l}/docs/${slugPath}`);
    }
  }

  if (languageAlternates[i18n.defaultLanguage]) {
    languageAlternates['x-default'] = languageAlternates[i18n.defaultLanguage];
  }

  const metadata: Metadata = {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: ogImage,
      title: page.data.title,
      description: page.data.description,
      url: pageUrl,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      images: ogImage,
    },
    alternates: {
      canonical: pageUrl,
      languages: Object.keys(languageAlternates).length > 0
        ? languageAlternates
        : undefined,
    },
  };

  return metadata;
}
