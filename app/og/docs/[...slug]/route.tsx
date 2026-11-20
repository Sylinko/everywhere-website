import { getPageImage, pageImageFilename, source } from '@/lib/source';
import { i18n } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import { createDocsOgResponse } from '@/lib/og';

export const revalidate = false;
export const dynamicParams = false;

export async function GET(
  _req: Request,
  { params }: RouteContext<'/og/docs/[...slug]'>
) {
  const { slug } = await params;
  const lang = i18n.languages.find(
    (locale) => pageImageFilename(locale) === slug.at(-1)
  );
  if (!lang) notFound();
  const page = source.getPage(slug.slice(0, -1), lang);
  if (!page) notFound();

  return createDocsOgResponse({
    lang,
    title: page.data.title,
    description: page.data.description,
  });
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: getPageImage(page).segments,
  }));
}
