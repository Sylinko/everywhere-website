import type { I18nConfig } from 'fumadocs-core/i18n';

export const i18n: I18nConfig = {
  defaultLanguage: 'en',
  languages: ['en', 'zh'],
  parser: 'dir',
  hideLocale: 'never',
};

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
 * Returns `/en` or `/zh` (with optional subpath).
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
 * Build hreflang language alternates for Next.js metadata.
 */
export function getLanguageAlternates(
  absoluteUrl: (path: string) => string,
  path = '',
  languages: readonly string[] = i18n.languages
): Record<string, string> {
  const alternates: Record<string, string> = {};

  for (const lang of languages) {
    alternates[getHreflang(lang)] = absoluteUrl(getLocalePath(lang, path));
  }

  const defaultLang = getDefaultAlternateLanguage(languages);
  if (defaultLang) {
    alternates['x-default'] = absoluteUrl(getLocalePath(defaultLang, path));
  }

  return alternates;
}
