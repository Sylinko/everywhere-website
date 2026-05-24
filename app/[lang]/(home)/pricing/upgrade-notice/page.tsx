import { noticeSource } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { absoluteUrl, createMetadata } from '@/lib/metadata';
import { getLocalePath, getOpenGraphLocale } from '@/lib/i18n';
import { buttonVariants } from '@/components/common/variants';
import { ArrowLeft } from 'lucide-react';
import { DocsBody, DocsTitle } from 'fumadocs-ui/page';
import Link from 'next/link';
import { cn } from '@/lib/cn';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const page = noticeSource.getPage(['upgrade'], lang);
  if (!page) notFound();

  const pageUrl = absoluteUrl(getLocalePath(lang, 'pricing/upgrade-notice'));

  return createMetadata({
    title: page.data.title,
    description: page.data.description,
    canonical: pageUrl,
    robots: { index: false, follow: false },
    openGraph: {
      url: pageUrl,
      type: 'article',
      locale: getOpenGraphLocale(lang),
    },
  });
}

export default async function UpgradeNoticePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const page = noticeSource.getPage(['upgrade'], lang);
  if (!page) notFound();

  const MDX = page.data.body;
  const backHref = getLocalePath(lang, 'pricing');

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 pt-16 pb-36">
      {/* Back link */}
      <Link
        href={backHref}
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'mb-8 gap-2',
        )}
      >
        <ArrowLeft className="size-4" />
        {lang === 'zh' ? '返回定价' : 'Back to Pricing'}
      </Link>

      {/* MDX Content using fumadocs DocsBody for proper styling */}
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsBody className="mt-4">
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </main>
  );
}
