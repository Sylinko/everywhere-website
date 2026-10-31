import { NotFoundContent } from '@/components/not-found';
import { SiteDocument } from '@/components/site-document';
import { headers } from 'next/headers';

export { metadata } from './[lang]/not-found';
export { viewport } from '@/components/site-document';

export default async function GlobalNotFound() {
  const lang = (await headers()).get('x-current-lang') === 'zh' ? 'zh' : 'en';

  return (
    <SiteDocument lang={lang}>
      <NotFoundContent lang={lang} />
    </SiteDocument>
  );
}
