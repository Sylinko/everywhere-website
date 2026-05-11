import type { I18nConfig } from 'fumadocs-core/i18n';

export const i18n: I18nConfig = {
  defaultLanguage: 'en',
  languages: ['en', 'zh'],
  parser: 'dir',
  hideLocale: 'never',
};

/**
 * Hreflang language alternates mapping.
 */
export const i18nLocaleToPathPrefix: Record<string, string> = {
  'en': '/en',
  'zh': '/zh',
  'x-default': '/en',
};

/**
 * Get the URL path for a given locale. Always includes the language prefix.
 * Returns `/en` or `/zh` (with optional subpath).
 */
export function getLocalePath(lang: string, path = ''): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return cleanPath ? `/${lang}/${cleanPath}` : `/${lang}`;
}
