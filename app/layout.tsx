import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Viewport, Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import { organizationSchema, websiteSchema, JsonLdScript } from '@/lib/json-ld';
import { headers } from 'next/headers';
import { HtmlLangSync } from '@/components/html-lang-sync';
import './global.css';
import { EverywhereDescriptions, EverywhereTitles } from '@/lib/constants';

const notoSans = Noto_Sans({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://everywhere.sylinko.com'),
  title: {
    default: EverywhereTitles['en'],
    template: '%s | Everywhere',
  },
  description: EverywhereDescriptions['en'],
  other: {
    charset: 'utf-8',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#fff' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default async function Layout({ children }: LayoutProps<'/'>) {
  const currentLang = (await headers()).get('x-current-lang') ?? 'en';

  return (
    <html lang={currentLang} suppressHydrationWarning className={notoSans.className}>
      <head>
        <meta charSet="utf-8" />
        <JsonLdScript data={organizationSchema({ description: EverywhereDescriptions['en'] })} />
        <JsonLdScript data={websiteSchema({ title: EverywhereTitles['en'], description: EverywhereDescriptions['en'] })} />
      </head>
      <body>
        <HtmlLangSync />
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
