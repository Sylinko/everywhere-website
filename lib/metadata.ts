import {
  getLanguageAlternates,
  getLocalePath,
  getOpenGraphLocale,
} from './i18n';
export const baseUrl =
  process.env.NODE_ENV === 'development'
    ? new URL('http://localhost:3000')
    : new URL('https://everywhere.sylinko.com');

/**
 * Build a full absolute URL from a relative path.
 */
export function absoluteUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl.origin}${cleanPath}`;
}

export function getSiteOgImageUrl(
  lang: string,
  page: 'home' | 'download' | 'pricing'
): string {
  const safeLang = lang === 'zh' ? 'zh' : 'en';
  return `/og/site/${safeLang}/${page}.png`;
}

export function getPolicyOgImageUrl(lang: string, slugs: string[]): string {
  const safeLang = lang === 'zh' ? 'zh' : 'en';
  const path = slugs.length > 0 ? slugs.join('/') : 'index';
  return `/og/site/${safeLang}/policies/${path}.png`;
}

export const siteName = 'Everywhere';
interface HeadOptions {
  lang: string;
  path: string;
  title: string;
  description?: string;
  image: string;
  languages?: readonly string[];
  article?: boolean;
  markdownUrl?: string;
  noindex?: boolean;
}
export function pageHead({
  lang,
  path,
  title,
  description,
  image,
  languages,
  article,
  markdownUrl,
  noindex,
}: HeadOptions) {
  const url = absoluteUrl(getLocalePath(lang, path));
  const picture = new URL(image, baseUrl).href;
  const alternates = noindex
    ? {}
    : getLanguageAlternates(
        absoluteUrl,
        path,
        languages,
        path === '' ? { xDefault: '/' } : {}
      );
  const robots = noindex ? 'noindex, nofollow' : 'index, follow';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  return {
    meta: [
      { title: fullTitle },
      { name: 'description', content: description },
      { name: 'robots', content: robots },
      {
        name: 'googlebot',
        content:
          robots +
          ', max-video-preview:-1, max-image-preview:large, max-snippet:-1',
      },
      ...Object.entries({
        'og:title': title,
        'og:description': description,
        'og:url': url,
        'og:locale': getOpenGraphLocale(lang),
        'og:site_name': siteName,
        'og:type': article ? 'article' : 'website',
        'og:image': picture,
        'og:image:width': '1200',
        'og:image:height': '630',
        'og:image:alt': title,
      }).map(([property, content]) => ({ property, content })),
      ...Object.entries({
        'twitter:card': 'summary_large_image',
        'twitter:site': '@everywhere_team',
        'twitter:creator': '@everywhere_team',
        'twitter:title': fullTitle,
        'twitter:description': description,
        'twitter:image': picture,
      }).map(([name, content]) => ({ name, content })),
    ],
    links: [
      { rel: 'canonical', href: url },
      ...Object.entries(alternates).map(([hrefLang, href]) => ({
        rel: 'alternate',
        hrefLang,
        href,
      })),
      ...(markdownUrl
        ? [
            {
              rel: 'alternate',
              type: 'text/markdown',
              href: new URL(markdownUrl, baseUrl).href,
            },
          ]
        : []),
    ],
  };
}
