import { htmlToMarkdown } from '@/lib/html-markdown';
import { absoluteUrl } from '@/lib/metadata';

export async function renderPageMarkdown(response: Response, url: URL) {
  const match = /^\/(en|zh)\/(docs|policies)(?:\/(.*))?$/.exec(url.pathname);
  if (match) {
    const [, lang, section, slug = ''] = match;
    const { source, policySource } = await import('@/lib/source');
    const collection = section === 'docs' ? source : policySource;
    const page = collection.getPage(slug.split('/').filter(Boolean), lang);
    if (page) {
      await response.body?.cancel();
      return `# ${page.data.title}\n\nSource: ${absoluteUrl(page.url)}\n\n${(await page.data.getText('processed')).trim()}\n`;
    }
  }
  return htmlToMarkdown(await response.text(), url);
}
