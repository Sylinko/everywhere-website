import { policySource } from '@/lib/source';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import { createMetadata, absoluteUrl } from '@/lib/metadata';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  PageLastUpdate,
} from 'fumadocs-ui/page';
import { breadcrumbSchema, JsonLdScript } from '@/lib/json-ld';
import { i18n, getLocalePath } from '@/lib/i18n';
import type { Metadata } from 'next';

export default async function Page(props: {
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const { lang, slug } = await props.params;
  const page = policySource.getPage(slug, lang);
  if (!page) notFound();

  const MDX = page.data.body;
  const lastModifiedTime = page.data.lastModified;
  const pageUrl = absoluteUrl(getLocalePath(lang, `policies/${page.slugs.join('/')}`));

  const breadcrumbItems = [
    { name: lang === 'zh' ? '首页' : 'Home', url: absoluteUrl(`/${lang}`) },
    { name: lang === 'zh' ? '政策' : 'Policies', url: absoluteUrl(`/${lang}/policies`) },
    { name: page.data.title, url: pageUrl },
  ];

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{
        style: 'clerk',
        enabled: !page.data.full,
      }}
    >
      <JsonLdScript data={breadcrumbSchema(breadcrumbItems)} />

      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(policySource, page),
          })}
        />
      </DocsBody>

      {lastModifiedTime && <PageLastUpdate date={lastModifiedTime} />}
    </DocsPage>
  );
}

export async function generateMetadata(props: {
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const { lang, slug } = await props.params;
  const page = policySource.getPage(slug, lang);
  if (!page) notFound();

  const policiesPath = `policies/${page.slugs.join('/')}`;
  const pageUrl = absoluteUrl(getLocalePath(lang, policiesPath));
  
  const languageAlternates: Record<string, string> = {};
  for (const hreflangKey of i18n.languages) {
    const altPage = policySource.getPage(slug, hreflangKey);
    if (altPage) {
      languageAlternates[hreflangKey] = absoluteUrl(getLocalePath(hreflangKey, policiesPath));
    }
  }

  if (languageAlternates[i18n.defaultLanguage]) {
    languageAlternates['x-default'] = languageAlternates[i18n.defaultLanguage];
  }

  return createMetadata({
    title: page.data.title,
    description: page.data.description,
    canonical: pageUrl,
    alternates: {
      languages: Object.keys(languageAlternates).length > 0
        ? languageAlternates
        : undefined,
    },
  });
}

export function generateStaticParams() {
  return policySource.generateParams();
}
