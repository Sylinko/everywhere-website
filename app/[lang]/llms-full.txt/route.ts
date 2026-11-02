import { getLLMText, source } from '@/lib/source';
import { i18n } from '@/lib/i18n';
import { absoluteUrl } from '@/lib/metadata';

export const revalidate = false;
export const dynamicParams = false;

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = await params;

  const pages = source.getPages(lang);
  const scan = pages.map(getLLMText);
  const scanned = await Promise.all(scan);

  return new Response(scanned.join('\n\n'), {
    headers: {
      'Content-Type': 'text/markdown;charset=utf-8',
      'X-Robots-Tag': 'noindex',
      Link: `<${absoluteUrl('/llms.txt')}>; rel="describedby"`,
    },
  });
}
