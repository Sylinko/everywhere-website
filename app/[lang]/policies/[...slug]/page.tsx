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

export default async function Page(props: {
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const { lang, slug } = await props.params;
  const page = policySource.getPage(slug, lang);
  if (!page) notFound();

  const MDX = page.data.body;
  const lastModifiedTime = page.data.lastModified;
  const pageUrl = absoluteUrl(`/${lang}/policies/${page.slugs.join('/')}`);

  const breadcrumbItems = [
    { name: lang === 'zh-CN' ? '首页' : 'Home', url: absoluteUrl(`/${lang}`) },
    { name: lang === 'zh-CN' ? '政策' : 'Policies', url: absoluteUrl(`/${lang}/policies`) },
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

  const pageUrl = absoluteUrl(`/${lang}/policies/${page.slugs.join('/')}`);

  return createMetadata({
    title: page.data.title,
    description: page.data.description,
    canonical: pageUrl,
  });
}

export function generateStaticParams() {
  return policySource.generateParams();
}
