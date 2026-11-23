import type { FC } from 'react';
import type { MDXProps } from 'mdx/types';
import type { TOCItemType } from 'fumadocs-core/toc';
import collections from 'fumadocs-mdx:collections/browser';
import { getMDXComponents } from '@/mdx-components';
import { DocumentPage } from './page';
import type { DocumentData } from './load';

const components = getMDXComponents();
const renderDocument = (
  { default: MDX, toc }: { default: FC<MDXProps>; toc: TOCItemType[] },
  { page }: { page: DocumentData }
) => (
  <DocumentPage page={page} toc={toc}>
    <MDX components={components} />
  </DocumentPage>
);

export const contentLoaders = {
  docs: collections.docs.createClientLoader({ component: renderDocument }),
  policies: collections.policies.createClientLoader({
    component: renderDocument,
  }),
};
