'use client';

import { RootProvider } from 'fumadocs-ui/provider/next';
import type { ReactNode } from 'react';
import { ConsentProvider } from '@/components/consent';
import { DocsClickTracking } from '@/components/analytics/docs-click-tracking';
import { DocsSearchDialog } from '@/components/analytics/docs-search-dialog';

export function Provider({
  children,
  i18n,
  lang,
}: {
  children: ReactNode;
  i18n: Parameters<typeof RootProvider>[0]['i18n'];
  lang?: string;
}) {
  return (
    <RootProvider
      i18n={i18n}
      search={{
        SearchDialog: DocsSearchDialog,
      }}
    >
      <ConsentProvider lang={lang ?? 'en'}>
        <DocsClickTracking />
        {children}
      </ConsentProvider>
    </RootProvider>
  );
}
