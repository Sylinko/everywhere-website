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

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return i18n.defaultLanguage;

  const languages = acceptLanguage.split(',')
    .map((lang) => {
      const [tag, quality] = lang.split(';');
      return {
        tag: tag.trim(),
        quality: quality ? parseFloat(quality.split('=')[1]) : 1.0,
      };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const lang of languages) {
    // Exact match
    if (i18n.languages.includes(lang.tag)) {
      return lang.tag;
    }
    
    // Prefix match (e.g. en-GB -> en-US)
    const baseLang = lang.tag.split('-')[0];
    const matchedLang = i18n.languages.find(l => l.startsWith(baseLang));
    if (matchedLang) {
      return matchedLang;
    }
  }

  return i18n.defaultLanguage;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the pathname is missing a valid locale
  const pathnameIsMissingLocale = i18n.languages.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    
    // Construct new URL
    const url = new URL(request.url);
    url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
    
    // Preserve query parameters is automatic when using new URL(request.url) 
    // but we modified pathname, search params are preserved from base request.url?
    // request.url is the full string.
    // new URL(request.url) clones it.
    // modifying pathname keeps search.
    
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
