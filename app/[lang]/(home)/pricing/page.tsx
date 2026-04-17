import { getPricingContent } from './pricing-data';
import { getSupportedModels } from '@/lib/pricing-models';
import {
  PricingHeader,
  PrimaryPlansSection,
  SecondaryPlansSection,
  ModelSupportTable,
  FAQSection,
} from './pricing.client';

export const dynamic = 'force-dynamic';

export default async function PricingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
  }) {
  console.log('Rendering PricingPage with params:', await params);
  const { lang } = await params;
  const content = getPricingContent(lang);
  const supportedModels = await getSupportedModels();
  console.log(`Fetched ${supportedModels.length} supported models for pricing page`);

  return (
    <main className="min-h-screen">
      <PricingHeader
        title={content.pageTitle}
        subtitle={content.pageSubtitle}
      />

      {/* Primary Plans - 3 columns */}
      <PrimaryPlansSection
        plans={content.plans}
        title={content.primaryPlansTitle}
        lang={lang}
      />

      {/* Secondary Plans - 2 columns (Free & BYOK) */}
      <SecondaryPlansSection
        plans={content.secondaryPlans}
        title={content.secondaryPlansTitle}
        lang={lang}
      />

      {/* Model Support Table */}
      <ModelSupportTable
        title={content.modelSupportTitle}
        models={supportedModels}
        lang={lang}
      />

      {/* FAQ Section */}
      <FAQSection title={content.faqTitle} items={content.faq} />
    </main>
  );
}
