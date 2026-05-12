'use client';

import { i18n } from '@/lib/i18n';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function HtmlLangSync() {
  const pathname = usePathname();

  useEffect(() => {
    const langSegment = pathname.split('/')[1];
    const nextLang = i18n.languages.includes(langSegment)
      ? langSegment
      : i18n.defaultLanguage;

    if (document.documentElement.lang !== nextLang) {
      document.documentElement.lang = nextLang;
    }
  }, [pathname]);

  return null;
}
