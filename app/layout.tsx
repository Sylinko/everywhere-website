import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Viewport, Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import { organizationSchema, websiteSchema, JsonLdScript } from '@/lib/json-ld';
import { headers } from 'next/headers';
import { HtmlLangSync } from '@/components/html-lang-sync';
import './global.css';

const notoSans = Noto_Sans({
  subsets: ['latin'],
});

const defaultTitle = 'Everywhere - AI Assistant that flows with your desktop.';
const defaultDescription =
  'Everywhere is an intuitive AI that works seamlessly alongside you. It grasps your screen context and assists instantly via a shortcut, hidden until needed.';

export const metadata: Metadata = {
  metadataBase: new URL('https://everywhere.sylinko.com'),
  title: {
    default: defaultTitle,
    template: '%s | Everywhere',
  },
  description: defaultDescription,
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
        <JsonLdScript data={organizationSchema({ description: defaultDescription })} />
        <JsonLdScript data={websiteSchema({ title: defaultTitle, description: defaultDescription })} />
      </head>
      <body>
        <HtmlLangSync />
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
