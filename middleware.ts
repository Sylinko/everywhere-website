import { NextRequest, NextResponse } from 'next/server';
import { i18n } from '@/lib/i18n';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - og (Open Graph images)
     * - favicon.ico, robots.txt, sitemap.xml, llms.txt
     * - Common file extensions for static assets (images, fonts, etc.)
     */
    '/((?!api|_next/static|_next/image|og|favicon.ico|robots.txt|sitemap.xml|llms\\.txt$|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff|woff2|ttf|eot)$).*)',
  ],
};

const COOKIE_NAME = 'NEXT_LOCALE';
const COOKIE_MAX_AGE = 31536000; // 1 year

/**
 * Set the language preference cookie on a response.
 */
function setLangCookie(response: NextResponse, lang: string): NextResponse {
  response.cookies.set(COOKIE_NAME, lang, {
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    sameSite: 'lax',
  });
  return response;
}

function appendVary(response: NextResponse, values: string[]): NextResponse {
  const existing = response.headers.get('Vary');

  const merged = new Set(
    existing
      ? existing
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
      : []
  );

  for (const value of values) {
    merged.add(value);
  }

  response.headers.set('Vary', Array.from(merged).join(', '));
  return response;
}

function markDynamicRedirect(response: NextResponse): NextResponse {
  appendVary(response, ['Accept-Language', 'Cookie']);
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}

function nextWithLang(request: NextRequest, lang: string): NextResponse {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-current-lang', lang);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set('Content-Language', lang === 'zh' ? 'zh-CN' : 'en');
  return response;
}

const renamedDocs = new Map([
  ['/docs/chat-plugin', '/docs/chat-tools'],
  ['/docs/chat-plugin/essential', '/docs/chat-tools/essential'],
  ['/docs/chat-plugin/file-system', '/docs/chat-tools/file-system'],
  ['/docs/chat-plugin/visual-context', '/docs/chat-tools/visual-context'],
  ['/docs/chat-plugin/web-browser', '/docs/chat-tools/web'],
  ['/docs/chat-plugin/windows-specific/everything', '/docs/chat-tools/windows-specific/everything'],
  ['/docs/chat-plugin/windows-specific/powershell', '/docs/chat-tools/terminal'],
  ['/docs/chat-tools/web-browser', '/docs/chat-tools/web'],
  ['/docs/chat-tools/windows-specific/powershell', '/docs/chat-tools/terminal'],
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const langCookie = request.cookies.get(COOKIE_NAME)?.value;
  const localized = /^\/(en(?:-US)?|zh(?:-CN)?)(\/.*)?$/.exec(pathname);
  if (localized) {
    const [, locale, path = ''] = localized;
    const lang = locale.slice(0, 2);
    const renamed = renamedDocs.get(path);

    // Resolve locale and document migrations together to avoid redirect chains.
    if (locale !== lang || renamed) {
      const url = new URL(request.url);
      url.pathname = `/${lang}${renamed ?? path}`;
      return NextResponse.redirect(url, 301);
    }

    const response = nextWithLang(request, lang);
    if (langCookie !== lang) {
      setLangCookie(response, lang);
    }
    return response;
  }

  // Root path
  // No locale prefix on /. Cookie → Accept-Language → Default.
  if (pathname === '/') {
    const targetLang = resolveBestLocale(
      langCookie,
      request.headers.get('accept-language') ?? ''
    );
    const url = new URL(request.url);
    url.pathname = `/${targetLang}`;
    const response = markDynamicRedirect(NextResponse.redirect(url, 307));
    if (!langCookie || langCookie !== targetLang) {
      setLangCookie(response, targetLang);
    }
    return response;
  }

  // Non-locale paths: deterministic SEO fallback.
  // Example: /docs -> /en/docs, regardless of cookie.
  const url = new URL(request.url);
  url.pathname = `/en${pathname}`;
  return NextResponse.redirect(url, 307);
}

function resolveBestLocale(
  cookie: string | undefined,
  acceptLanguage: string
): string {
  if (cookie && i18n.languages.includes(cookie)) {
    return cookie;
  }

  if (acceptLanguage.includes('zh')) {
    return 'zh';
  }

  return 'en';
}
