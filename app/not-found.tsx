import { buttonVariants } from '@/components/common/variants';
import { getLocalePath, i18n } from '@/lib/i18n';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';

const i18nMap = {
  'en': {
    title: 'Page Not Found',
    description: 'We searched Everywhere, but this place remains untouched.',
    action: 'Take me home',
  },
  'zh': {
    title: '页面未找到',
    description: '我们寻遍了 Everywhere，唯独此处是无人踏足的秘境。',
    action: '返回主页',
  },
};

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'We searched Everywhere, but this place remains untouched.',
  robots: {
    index: false,
    follow: false,
  },
};

async function getCurrentLang(): Promise<keyof typeof i18nMap> {
  const headerLang = (await headers()).get('x-current-lang');
  return i18n.languages.includes(headerLang ?? '')
    ? (headerLang as keyof typeof i18nMap)
    : 'en';
}

export default async function NotFound() {
  const lang = await getCurrentLang();
  const content = i18nMap[lang];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="text-8xl font-bold">404</h1>
      <h2 className="mt-4 text-3xl font-semibold">{content.title}</h2>
      <p className="text-muted-foreground mt-4 mb-8 text-xl">
        {content.description}
      </p>
      <Link
        href={getLocalePath(lang)}
        className={buttonVariants({
          className: 'w-full sm:w-auto',
        })}
      >
        {content.action}
      </Link>
    </div>
  );
}
