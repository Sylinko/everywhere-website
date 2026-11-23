import type { I18nConfig } from 'fumadocs-core/i18n';

export const i18n: I18nConfig = {
  defaultLanguage: 'en',
  languages: ['en', 'zh'],
  fallbackLanguage: null,
  parser: 'dir',
  hideLocale: 'never',
};

/** Match regional browser preferences (e.g. zh-CN) to the site's languages. */
export function getPreferredLanguage(header: string | null): string {
  const preferences = (header ?? '')
    .split(',')
    .flatMap((entry, order) => {
      const match =
        /^\s*([a-z]+(?:-[a-z0-9]+)*|\*)(?:\s*;\s*q\s*=\s*(0(?:\.\d+)?|1(?:\.0+)?|\.\d+))?\s*$/i.exec(
          entry
        );
      if (!match) return [];
      return [
        {
          lang: match[1].toLowerCase().split('-')[0],
          quality: Number(match[2] ?? 1),
          order,
        },
      ];
    })
    .sort((a, b) => b.quality - a.quality || a.order - b.order);
  for (const pref of preferences) {
    if (!pref.quality) break;
    if (pref.lang === '*') {
      // A wildcard applies only to languages without an explicit preference.
      const any = i18n.languages.find(
        (lang) => !preferences.some((p) => p.lang === lang)
      );
      if (any) return any;
    } else if (i18n.languages.includes(pref.lang)) {
      return pref.lang;
    }
  }
  return i18n.defaultLanguage;
}

/**
 * Route locale to hreflang language tag mapping.
 */
export const localeToHreflang: Record<string, string> = {
  en: 'en',
  zh: 'zh',
};

export const localeToOpenGraphLocale: Record<string, string> = {
  en: 'en_US',
  zh: 'zh_CN',
};

/**
 * Get the URL path for a given locale. Always includes the language prefix.
 */
export function getLocalePath(lang: string, path = ''): string {
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  return cleanPath ? `/${lang}/${cleanPath}` : `/${lang}`;
}

export function getHreflang(lang: string): string {
  return localeToHreflang[lang] ?? lang;
}

export function getOpenGraphLocale(lang: string): string {
  return localeToOpenGraphLocale[lang] ?? lang;
}

export function getDefaultAlternateLanguage(
  languages: readonly string[]
): string | undefined {
  return languages.includes(i18n.defaultLanguage)
    ? i18n.defaultLanguage
    : languages[0];
}

/**
 * Build hreflang language alternates for localized pages.
 */
export function getLanguageAlternates(
  absoluteUrl: (path: string) => string,
  path = '',
  languages: readonly string[] = i18n.languages,
  options: { xDefault?: string | false } = {}
): Record<string, string> {
  const alternates: Record<string, string> = {};

  for (const lang of languages) {
    alternates[getHreflang(lang)] = absoluteUrl(getLocalePath(lang, path));
  }

  if (options.xDefault !== false) {
    const defaultLang = getDefaultAlternateLanguage(languages);
    const xDefaultPath = options.xDefault;
    if (xDefaultPath) {
      alternates['x-default'] = absoluteUrl(xDefaultPath);
    } else if (defaultLang) {
      alternates['x-default'] = absoluteUrl(getLocalePath(defaultLang, path));
    }
  }

  return alternates;
}
