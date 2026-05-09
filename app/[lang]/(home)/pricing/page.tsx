import { getPricingContent } from './pricing-data';
import { getSupportedModels } from '@/lib/pricing-models';
import {
  PricingHeader,
  PrimaryPlansSection,
  ModelSupportTable,
  FAQSection,
} from './pricing.client';
import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/metadata';
import { faqSchema, breadcrumbSchema, JsonLdScript } from '@/lib/json-ld';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const pageUrl = absoluteUrl(`/${lang}/pricing`);
  return {
    title: lang === 'zh-CN' ? '定价' : 'Pricing',
    description:
      lang === 'zh-CN'
        ? '选择适合您的 Everywhere 计划。无论是在网页间、文档里，还是奇思妙想的瞬间，总有一个计划契合您的脚步。'
        : 'Choose the Everywhere plan that fits you. From web pages to documents and every spark of genius in between—there’s a plan designed to keep up with you.',
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: lang === 'zh-CN' ? '定价 | Everywhere' : 'Pricing | Everywhere',
      url: pageUrl,
      type: 'website',
    },
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const content = getPricingContent(lang);
  const supportedModels = await getSupportedModels();

  return (
    <main className="min-h-screen">
      <JsonLdScript data={faqSchema(content.faq)} />
      <JsonLdScript
        data={breadcrumbSchema([
          { name: lang === 'zh-CN' ? '首页' : 'Home', url: absoluteUrl(`/${lang}`) },
          { name: content.pageTitle, url: absoluteUrl(`/${lang}/pricing`) },
        ])}
      />

      <PricingHeader
        title={content.pageTitle}
        subtitle={content.pageSubtitle}
      />

      <PrimaryPlansSection
        plans={content.plans}
        taxNote={content.taxNote}
        title={content.primaryPlansTitle}
        lang={lang}
      />

      <ModelSupportTable
        title={content.modelSupportTitle}
        models={supportedModels}
        lang={lang}
      />

      <FAQSection title={content.faqTitle} items={content.faq} />
    </main>
  );
}
