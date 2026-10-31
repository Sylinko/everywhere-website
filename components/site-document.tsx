import type { Viewport } from 'next';
import { Noto_Sans } from 'next/font/google';
import { organizationSchema, websiteSchema, JsonLdScript } from '@/lib/json-ld';
import { HtmlLangSync } from '@/components/html-lang-sync';
import '@/app/global.css';
import { EverywhereDescriptions, EverywhereTitles } from '@/lib/constants';

const notoSans = Noto_Sans({
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#fff' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export function SiteDocument({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) {
  return (
    <html lang={lang} suppressHydrationWarning className={notoSans.className}>
      <head>
        <meta charSet="utf-8" />
        <JsonLdScript
          data={organizationSchema({
            description: EverywhereDescriptions['en'],
          })}
        />
        <JsonLdScript
          data={websiteSchema({
            title: EverywhereTitles['en'],
            description: EverywhereDescriptions['en'],
          })}
        />
      </head>
      <body>
        <HtmlLangSync />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html:
              'var __name=globalThis.__name||(globalThis.__name=function(target){return target;});',
          }}
        />
        {children}
      </body>
    </html>
  );
}
