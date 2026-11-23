import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useMatches,
} from '@tanstack/react-router';
import { NotFoundContent } from '@/components/not-found';
import { usePathname } from '@/lib/navigation';
import { JsonLdScript, organizationSchema, websiteSchema } from '@/lib/json-ld';
import {
  EverywhereDescriptions,
  EverywhereTitles,
  OfficialUrl,
} from '@/lib/constants';
import css from '@/app/global.css?url';

export const Route = createRootRoute({
  head: () => ({
    links: [
      { rel: 'stylesheet', href: css },
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'shortcut icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/Everywhere.webp' },
    ],
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1' },
      { name: 'author', content: 'Sylinko' },
      { name: 'creator', content: 'Sylinko' },
    ],
  }),
  shellComponent: Document,
  component: Outlet,
  notFoundComponent: () => <NotFoundContent />,
});

function Document({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const lang = path.split('/')[1] === 'zh' ? 'zh' : 'en';
  const matches = useMatches();
  const leafRouteId = matches.at(-1)?.routeId;
  const isNotFound =
    matches.some(
      (match) =>
        match.status === 'notFound' ||
        Boolean((match as { globalNotFound?: boolean }).globalNotFound)
    ) ||
    leafRouteId === '__root__' ||
    leafRouteId === '/$lang' ||
    leafRouteId === '/$lang/_site';
  const localizedTitle = EverywhereTitles[lang] ?? EverywhereTitles.en;
  const localizedDescription =
    EverywhereDescriptions[lang] ?? EverywhereDescriptions.en;

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <HeadContent />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#0A0A0A"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#fff"
        />
        {isNotFound && (
          <>
            <title>
              {lang === 'zh'
                ? '页面未找到 | Everywhere'
                : 'Page Not Found | Everywhere'}
            </title>
            <meta name="robots" content="noindex, nofollow" />
          </>
        )}
        <link rel="author" href={OfficialUrl} />
        {!isNotFound && (
          <>
            <JsonLdScript
              data={organizationSchema({
                description: localizedDescription,
                lang,
              })}
            />
            <JsonLdScript
              data={websiteSchema({
                title: localizedTitle,
                description: localizedDescription,
              })}
            />
          </>
        )}
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
