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
     * - favicon.ico, robots.txt, sitemap.xml
     * - Common file extensions for static assets (images, fonts, etc.)
     */
    '/((?!api|_next/static|_next/image|og|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff|woff2|ttf|eot)$).*)',
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
      : [],
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

function isLocalePath(pathname: string, locale: string): boolean {
  return pathname === `/${locale}` || pathname.startsWith(`/${locale}/`);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 301 Redirect legacy locale paths
  if (isLocalePath(pathname, 'en-US')) {
    const newPath = pathname === '/en-US' ? '/en' : `/en${pathname.slice('/en-US'.length)}`;
    const url = new URL(request.url);
    url.pathname = newPath;
    return NextResponse.redirect(url, 301);
  }

  if (isLocalePath(pathname, 'zh-CN')) {
    const newPath =
      pathname === '/zh-CN' ? '/zh' : `/zh${pathname.slice('/zh-CN'.length)}`;
    const url = new URL(request.url);
    url.pathname = newPath;
    return NextResponse.redirect(url, 301);
  }
  
  const langCookie = request.cookies.get(COOKIE_NAME)?.value;

  // URL has locale prefix
  if (isLocalePath(pathname, 'en')) {
    const response = nextWithLang(request, 'en');
    if (langCookie !== 'en') {
      setLangCookie(response, 'en');
    }
    return response;
  }

  if (isLocalePath(pathname, 'zh')) {
    const response = nextWithLang(request, 'zh');
    if (langCookie !== 'zh') {
      setLangCookie(response, 'zh');
    }
    return response;
  }

  // Root path
  // No locale prefix on /. Cookie → Accept-Language → Default.
  if (pathname === '/') {
    const targetLang = resolveBestLocale(langCookie, request.headers.get('accept-language') ?? '');
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

function resolveBestLocale(cookie: string | undefined, acceptLanguage: string): string {
  if (cookie && i18n.languages.includes(cookie)) {
    return cookie;
  }

  if (acceptLanguage.includes('zh')) {
    return 'zh';
  }

  return 'en';
}
