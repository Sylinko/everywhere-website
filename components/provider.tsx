import { Image } from '@/components/site-image';

import { RootProvider } from 'fumadocs-ui/provider/tanstack';
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
      components={{
        Image: ({ src, ...props }) => (
          <Image
            {...props}
            src={
              typeof src === 'string' || src === undefined
                ? src
                : 'default' in src
                  ? src.default.src
                  : src.src
            }
          />
        ),
      }}
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
