'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import type { SearchLink, TagItem } from 'fumadocs-ui/contexts/search';
import type {
  SearchItemType,
  SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  TagsList,
  TagsListItem,
} from 'fumadocs-ui/components/dialog/search';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { useOnChange } from 'fumadocs-core/utils/use-on-change';
import {
  sanitizeSearchQuery,
  trackDocsEvent,
} from '@/lib/analytics';

interface DocsSearchDialogProps extends SharedProps {
  links?: SearchLink[];
  type?: 'fetch' | 'static';
  defaultTag?: string;
  tags?: TagItem[];
  api?: string;
  delayMs?: number;
  footer?: React.ReactNode;
  allowClear?: boolean;
}

export function DocsSearchDialog({
  defaultTag,
  tags = [],
  api,
  delayMs,
  type = 'fetch',
  allowClear = false,
  links = [],
  footer,
  ...props
}: DocsSearchDialogProps) {
  const { locale } = useI18n();
  const [tag, setTag] = useState(defaultTag);
  const trackedQueries = useRef(new Set<string>());

  const { search, setSearch, query } = useDocsSearch(
    type === 'fetch'
      ? {
          type: 'fetch',
          api,
          locale,
          tag,
          delayMs,
        }
      : {
          type: 'static',
          from: api,
          locale,
          tag,
          delayMs,
        },
  );

  const defaultItems = useMemo(() => {
    if (links.length === 0) return null;

    return links.map(([name, link]) => ({
      type: 'page' as const,
      id: name,
      content: name,
      url: link,
    }));
  }, [links]);

  useOnChange(defaultTag, (value) => {
    setTag(value);
  });

  useEffect(() => {
    const normalized = search.trim().replace(/\s+/g, ' ');
    if (normalized.length < 2 || query.isLoading) return;
    if (query.data === undefined || query.data === 'empty') return;

    const key = `${locale}:${tag ?? ''}:${normalized}`;
    if (trackedQueries.current.has(key)) return;

    const resultsCount = query.data.length;

    const timer = window.setTimeout(() => {
      if (trackedQueries.current.has(key)) return;
      trackedQueries.current.add(key);

      trackDocsEvent('docs_search_used', {
        section: 'search',
        ...sanitizeSearchQuery(normalized),
        results_count: resultsCount,
      });
    }, 900);

    return () => window.clearTimeout(timer);
  }, [locale, query.data, query.isLoading, search, tag]);

  function onSelect(item: SearchItemType) {
    const normalized = search.trim().replace(/\s+/g, ' ');
    if (normalized.length < 2) return;

    trackDocsEvent('docs_search_result_click', {
      section: 'search',
      ...sanitizeSearchQuery(normalized),
      results_count: Array.isArray(query.data) ? query.data.length : undefined,
      result_url: 'url' in item ? item.url : undefined,
      result_type: item.type,
    });
  }

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      onSelect={onSelect}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList
          items={query.data !== 'empty' ? query.data : defaultItems}
        />
      </SearchDialogContent>
      <SearchDialogFooter>
        {tags.length > 0 && (
          <TagsList tag={tag} onTagChange={setTag} allowClear={allowClear}>
            {tags.map((item) => (
              <TagsListItem key={item.value} value={item.value}>
                {item.name}
              </TagsListItem>
            ))}
          </TagsList>
        )}
        {footer}
      </SearchDialogFooter>
    </SearchDialog>
  );
}
