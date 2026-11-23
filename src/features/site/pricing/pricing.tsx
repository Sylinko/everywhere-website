import { getPricingContent } from './pricing-data';
import type { ModelSupportItem } from './types';
import {
  PricingHeader,
  PrimaryPlansSection,
  ModelSupportTable,
  UsageLimitSection,
  FAQSection,
} from './pricing-sections';
import { absoluteUrl } from '@/lib/metadata';
import { faqSchema, breadcrumbSchema, JsonLdScript } from '@/lib/json-ld';
import { getLocalePath } from '@/lib/i18n';

export function Pricing({ lang, models }: { lang: string; models: ModelSupportItem[] }) {
  const content = getPricingContent(lang);

  return (
    <main className="min-h-screen">
      <JsonLdScript data={faqSchema(content.faq.flatMap((g) => g.items))} />
      <JsonLdScript
        data={breadcrumbSchema([
          {
            name: lang === 'zh' ? '首页' : 'Home',
            url: absoluteUrl(getLocalePath(lang)),
          },
          {
            name: content.pageTitle,
            url: absoluteUrl(getLocalePath(lang, 'pricing')),
          },
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
        webSearchExtraNote={content.webSearchExtraNote}
        requestEstimateNote={content.requestEstimateNote}
        promoBanner={content.promoBanner}
      />

      <ModelSupportTable
        title={content.modelSupportTitle}
        models={models}
        lang={lang}
      />

      <UsageLimitSection content={content.usageLimit} lang={lang} />

      <FAQSection title={content.faqTitle} groups={content.faq} />
    </main>
  );
}
