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

const COOKIE_NAME = 'lang';
const COOKIE_MAX_AGE = 31536000; // 1 year

/**
 * Set the language preference cookie on a response.
 */
function setLangCookie(
  response: NextResponse,
  lang: string,
): NextResponse {
  response.cookies.set(COOKIE_NAME, lang, {
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    sameSite: 'lax',
  });
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 301 Redirect legacy locale paths
  if (pathname.startsWith('/en-US')) {
    const newPath = pathname === '/en-US' ? '/en' : `/en${pathname.slice('/en-US'.length)}`;
    const url = new URL(request.url);
    url.pathname = newPath;
    return NextResponse.redirect(url, 301);
  }

  if (pathname.startsWith('/zh-CN')) {
    const newPath =
      pathname === '/zh-CN' ? '/zh' : `/zh${pathname.slice('/zh-CN'.length)}`;
    const url = new URL(request.url);
    url.pathname = newPath;
    return NextResponse.redirect(url, 301);
  }
  
  const langCookie = request.cookies.get(COOKIE_NAME)?.value;

  // URL has locale prefix
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const response = NextResponse.next();
    if (langCookie !== 'en') {
      setLangCookie(response, 'en');
    }
    return response;
  }

  if (pathname === '/zh' || pathname.startsWith('/zh/')) {
    const response = NextResponse.next();
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
    const response = NextResponse.redirect(url, 307);
    if (!langCookie || langCookie !== targetLang) {
      setLangCookie(response, targetLang);
    }
    return response;
  }

  // Respect cookie preference; otherwise default to English.
  // e.g. /docs/xxx → /en/docs/xxx or /zh/docs/xxx
  const fallbackLang = langCookie && i18n.languages.includes(langCookie) ? langCookie : 'en';
  const url = new URL(request.url);
  url.pathname = `/${fallbackLang}${pathname}`;
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
