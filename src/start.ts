import {
  createCsrfMiddleware,
  createMiddleware,
  createStart,
} from '@tanstack/react-start';
import {
  setResponseHeader,
  setResponseHeaders,
} from '@tanstack/react-start/server';
import { getLocalePath, getPreferredLanguage, i18n } from '@/lib/i18n';

const headers = new Headers({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
});
const responseHeaders = createMiddleware().server(({ next }) => {
  setResponseHeaders(headers);
  return next();
});

const regionalAliases: Record<string, string> = {
  'zh-cn': 'zh',
  'en-us': 'en',
};

const pageLanguage = createMiddleware().server(
  ({ request, pathname, handlerType, next }) => {
    if (handlerType !== 'router' || !['GET', 'HEAD'].includes(request.method))
      return next();

    const hasTrailingSlash = pathname.length > 1 && pathname.endsWith('/');
    const cleanPath = hasTrailingSlash ? pathname.slice(0, -1) : pathname;
    const [, first = ''] = cleanPath.split('/');
    const firstLower = first.toLowerCase();

    // Normalize regional aliases (case-insensitive) and trailing slashes in one 301 hop.
    const alias = regionalAliases[firstLower];
    if (alias) {
      const target = new URL(request.url);
      target.pathname = getLocalePath(alias, cleanPath.slice(first.length + 1));
      return Response.redirect(target.href, 301);
    }

    if (i18n.languages.includes(first)) {
      if (hasTrailingSlash) {
        const target = new URL(request.url);
        target.pathname = cleanPath;
        return Response.redirect(target.href, 301);
      }
      setResponseHeader('Content-Language', first === 'zh' ? 'zh-CN' : 'en');
      return next();
    }

    // API, framework and static asset URLs are global. Markdown docs and the
    // full-text export are the site's localized file-shaped URLs.
    if (/^\/(?:api|assets|og|[._][^/]*)(?:\/|$)/.test(cleanPath)) return next();
    if (
      /\.[^/]+\/?$/.test(cleanPath) &&
      !/^\/(?:docs(?:\/.*)?\.md|llms-full\.txt)\/?$/.test(cleanPath)
    )
      return next();

    const target = new URL(request.url);
    target.pathname = getLocalePath(
      getPreferredLanguage(request.headers.get('Accept-Language')),
      cleanPath
    );
    return new Response(null, {
      status: 307,
      headers: {
        Location: target.href,
        Vary: 'Accept-Language',
        'Cache-Control': 'private, no-store',
      },
    });
  }
);

export const startInstance = createStart(() => ({
  requestMiddleware: [
    responseHeaders,
    pageLanguage,
    createCsrfMiddleware({
      filter: ({ handlerType }) => handlerType === 'serverFn',
    }),
  ],
}));
