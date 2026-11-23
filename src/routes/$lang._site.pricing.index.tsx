import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { setResponseHeader } from '@tanstack/react-start/server';
import { Pricing } from '@/src/features/site/pricing/pricing';
import { getSiteOgImageUrl, pageHead } from '@/lib/metadata';
import { getSupportedModels } from '@/lib/pricing-models';

const loadModels = createServerFn().handler(async () => {
  setResponseHeader('Cache-Control', 'private, no-store');
  return getSupportedModels();
});

export const Route = createFileRoute('/$lang/_site/pricing/')({
  // A hover or a previous visit must not supply a stale price on navigation.
  preload: false,
  loader: { handler: () => loadModels(), staleReloadMode: 'blocking' },
  headers: () => ({ 'Cache-Control': 'private, no-store' }),
  head: ({ params: { lang } }) =>
    pageHead({
      lang,
      path: 'pricing',
      title: lang === 'zh' ? '定价与计划' : 'Pricing & Plans',
      description:
        lang === 'zh'
          ? '选择适合您的 Everywhere 计划。无论是在网页间、文档里，还是奇思妙想的瞬间，总有一个计划契合您的脚步。'
          : "Choose the Everywhere plan that fits you. From web pages to documents and every spark of genius in between—there's a plan designed to keep up with you.",
      image: getSiteOgImageUrl(lang, 'pricing'),
    }),
  component: () => (
    <Pricing lang={Route.useParams().lang} models={Route.useLoaderData()} />
  ),
});
