import { legalSource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, linkItems } from '@/lib/layout.shared';
import { notFound } from 'next/navigation';
import { i18n } from '@/lib/i18n';

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}) {
  const { lang } = await params;

  if (!i18n.languages.includes(lang as (typeof i18n.languages)[number])) {
    notFound();
  }

  const base = baseOptions(lang);

  return (
    <DocsLayout
      {...base}
      tree={legalSource.pageTree[lang]}
      links={linkItems.filter((item) => item.type === 'icon')}
      sidebar={{
        defaultOpenLevel: 0,
        tabs: false,
      }}
    >
      {children}
    </DocsLayout>
  );
}
