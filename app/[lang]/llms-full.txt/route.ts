import { getLLMText, source } from '@/lib/source';

export const revalidate = false;

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
    },
  });
}
