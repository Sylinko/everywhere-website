import { i18n } from '@/lib/i18n';
import { permanentRedirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function RootPage() {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language');
  if (acceptLanguage?.includes('zh')) {
    permanentRedirect('/zh-CN');
  }

  permanentRedirect(`/${i18n.defaultLanguage}`);
}
