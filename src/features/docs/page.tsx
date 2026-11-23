import { useMemo, type ReactNode } from 'react';
import { deserializePageTree } from 'fumadocs-core/source/client';
import type { TOCItemType } from 'fumadocs-core/toc';
import { DocsLayout } from 'fumadocs-ui/layouts/spacious';
import {
  DocsPage,
  DocsTitle,
  DocsDescription,
  DocsBody,
  MarkdownCopyButton,
  PageLastUpdate,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/spacious/page';
import { absoluteUrl } from '@/lib/metadata';
import { getLocalePath } from '@/lib/i18n';
import { articleSchema, breadcrumbSchema, JsonLdScript } from '@/lib/json-ld';
import { useLayoutOptions, linkItems } from '@/components/layout.shared';
import { Feedback } from '@/components/feedback';
import { rateDocument } from './feedback';
import type { DocumentData } from './load';

export function DocumentPage({
  page,
  toc,
  children,
}: {
  page: DocumentData;
  toc: TOCItemType[];
  children: ReactNode;
}) {
  const {
    lang,
    title,
    description,
    dateModified,
    image,
    article,
    full,
    markdownUrl,
  } = page;
  const tree = useMemo(() => deserializePageTree(page.tree), [page.tree]);
  const url = absoluteUrl(getLocalePath(lang, page.path));
  const home = absoluteUrl(getLocalePath(lang));
  const layoutOptions = useLayoutOptions(lang);
  return (
    <DocsLayout
      {...layoutOptions}
      tree={tree}
      links={[...linkItems]}
      tabs={article ? undefined : false}
      sidebar={{ defaultOpenLevel: 0 }}
    >
      <DocsPage
        toc={toc}
        full={full}
        className={full ? undefined : 'layout:[--fd-page-width:56rem]'}
      >
        {article && (
          <JsonLdScript
            data={articleSchema({
              title,
              description,
              dateModified,
              imageUrl: absoluteUrl(image),
              url,
              lang,
            })}
          />
        )}
        <JsonLdScript
          data={breadcrumbSchema([
            { name: lang === 'zh' ? '首页' : 'Home', url: home },
            ...(article && page.path !== 'docs'
              ? [
                  {
                    name: lang === 'zh' ? '文档' : 'Docs',
                    url: absoluteUrl(getLocalePath(lang, 'docs')),
                  },
                ]
              : []),
            {
              name:
                page.path === 'docs'
                  ? lang === 'zh'
                    ? '文档'
                    : 'Docs'
                  : title,
              url,
            },
          ])}
        />
        <div className="flex flex-wrap items-center justify-between gap-x-4">
          <DocsTitle>{title}</DocsTitle>
          {layoutOptions.nav?.children}
        </div>
        <DocsDescription className={article ? 'mb-2' : undefined}>
          {description}
        </DocsDescription>
        {markdownUrl && (
          <div className="mb-6 flex flex-row flex-wrap items-center gap-2 border-b pb-6">
            <MarkdownCopyButton markdownUrl={markdownUrl} />
            <ViewOptionsPopover
              markdownUrl={markdownUrl}
              pageUrl={absoluteUrl(markdownUrl)}
              githubUrl={`https://github.com/Sylinko/everywhere-website/blob/master/content/docs/${page.file}`}
            />
          </div>
        )}
        <DocsBody>{children}</DocsBody>
        {article && (
          <Feedback
            key={url}
            lang={lang}
            onRateAction={(url, feedback) =>
              rateDocument({ data: { url, feedback } })
            }
          />
        )}
        {dateModified && <PageLastUpdate date={new Date(dateModified)} />}
      </DocsPage>
    </DocsLayout>
  );
}
