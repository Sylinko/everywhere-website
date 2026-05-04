import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Viewport, Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import { organizationSchema, websiteSchema, JsonLdScript } from '@/lib/json-ld';
import './global.css';

const notoSans = Noto_Sans({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://everywhere.sylinko.com'),
  title: {
    default: 'Everywhere - AI Assistant that flows with your desktop.',
    template: '%s | Everywhere',
  },
  description:
    'Everywhere is an intuitive AI that works seamlessly alongside you. It grasps your screen context and assists instantly via a shortcut, hidden until needed.',
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

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning className={notoSans.className}>
      <head>
        <meta charSet="utf-8" />
        <JsonLdScript data={organizationSchema()} />
        <JsonLdScript data={websiteSchema()} />
      </head>
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
