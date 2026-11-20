import { policySource } from '@/lib/source';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import {
  createMetadata,
  absoluteUrl,
  getPolicyOgImageUrl,
} from '@/lib/metadata';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  PageLastUpdate,
} from 'fumadocs-ui/page';
import { breadcrumbSchema, JsonLdScript } from '@/lib/json-ld';
import {
  getLanguageAlternates,
  getLocalePath,
  getOpenGraphLocale,
  i18n,
} from '@/lib/i18n';

export default async function Page(props: {
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const { lang, slug } = await props.params;
  const page = policySource.getPage(slug, lang);
  if (!page) notFound();

  const MDX = page.data.body;
  const lastModifiedTime = page.data.lastModified;
  const pageUrl = absoluteUrl(
    getLocalePath(lang, `policies/${page.slugs.join('/')}`)
  );

  const breadcrumbItems = [
    {
      name: lang === 'zh' ? '首页' : 'Home',
      url: absoluteUrl(getLocalePath(lang)),
    },
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

  const availableLanguages = i18n.languages.filter((locale) =>
    Boolean(policySource.getPage(slug, locale))
  );

  const ogImage = getPolicyOgImageUrl(lang, page.slugs);

  return createMetadata({
    title: page.data.title,
    description: page.data.description,
    canonical: pageUrl,
    openGraph: {
      locale: getOpenGraphLocale(lang),
      images: [
        { url: ogImage, width: 1200, height: 630, alt: page.data.title },
      ],
    },
    twitter: {
      images: [ogImage],
    },
    alternates: {
      languages:
        availableLanguages.length > 0
          ? getLanguageAlternates(absoluteUrl, policiesPath, availableLanguages)
          : undefined,
    },
  });
}

export const dynamicParams = false;

export function generateStaticParams() {
  return policySource.generateParams();
}
