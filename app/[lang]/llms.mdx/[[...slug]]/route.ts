import { getLLMText, source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { absoluteUrl } from '@/lib/metadata';

export const revalidate = false;
export const dynamicParams = false;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: string; slug?: string[] }> }
) {
  const { slug, lang } = await params;
  const page = source.getPage(slug, lang);

  if (!page) notFound();

  return new Response(await getLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown;charset=utf-8',
      'X-Robots-Tag': 'noindex',
      Link: `<${absoluteUrl(page.url)}>; rel="canonical", <${absoluteUrl('/llms.txt')}>; rel="describedby"`,
    },
  });
}

export function generateStaticParams() {
  return source.generateParams();
}
