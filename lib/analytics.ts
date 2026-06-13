export const docsEventNames = [
  'docs_download_click',
  'docs_pricing_click',
  'docs_github_click',
  'docs_cloud_signup_click',
  'docs_get_started_click',
  'docs_search_used',
  'docs_search_result_click',
] as const;

export type DocsEventName = (typeof docsEventNames)[number];

export type DocsSection =
  | 'hero'
  | 'sidebar'
  | 'content'
  | 'footer'
  | 'navbar'
  | 'pricing'
  | 'download'
  | 'search'
  | 'unknown';

export type DocsEventProperties = {
  section?: DocsSection | string;
  link_url?: string;
  link_text?: string;
  query?: string;
  query_redacted?: boolean;
  results_count?: number;
  result_url?: string;
  result_type?: string;
  os?: string;
  channel?: string;
  variant?: string;
  plan_id?: string;
  plan_name?: string;
  cta_id?: string;
  [key: string]: unknown;
};

type ZarazLike = {
  track?: (eventName: string, properties?: Record<string, unknown>) => void;
};

const docsEventNameSet = new Set<string>(docsEventNames);

const downloadHosts = new Set(['download.sylinko.com']);
const accountHosts = new Set(['account.sylinko.com']);

const sensitiveQueryPatterns = [
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  /\b(?:sk|pk|rk|ak|api|key|token|secret)[-_]?[A-Za-z0-9]{16,}\b/i,
  /\b[A-Za-z0-9_-]{32,}\b/,
];

export function isDocsEventName(value: string): value is DocsEventName {
  return docsEventNameSet.has(value);
}

export function trackDocsEvent(
  eventName: DocsEventName,
  properties: DocsEventProperties = {},
) {
  if (typeof window === 'undefined') return;

  const zaraz = (window as Window & { zaraz?: ZarazLike }).zaraz;
  if (typeof zaraz?.track !== 'function') return;

  zaraz.track(eventName, {
    source: 'docs',
    page_path: window.location.pathname,
    page_title: document.title,
    locale: document.documentElement.lang || 'unknown',
    ...properties,
  });
}

export function sanitizeSearchQuery(query: string): {
  query: string;
  query_redacted?: boolean;
} {
  const normalized = query.trim().replace(/\s+/g, ' ').slice(0, 120);

  if (!normalized) {
    return { query: '' };
  }

  if (sensitiveQueryPatterns.some((pattern) => pattern.test(normalized))) {
    return {
      query: '[redacted]',
      query_redacted: true,
    };
  }

  return { query: normalized };
}

export type ClassifiedTrackingTarget = {
  eventName: DocsEventName;
};

export function classifyTrackingTarget(linkUrl: string): ClassifiedTrackingTarget | null {
  const url = parseUrl(linkUrl);
  if (!url) return null;

  const ownPath = isSameOrigin(url) ? url.pathname : '';

  if (downloadHosts.has(url.hostname)) {
    return { eventName: 'docs_download_click' };
  }

  if (isLocalePath(ownPath, 'download')) {
    return { eventName: 'docs_download_click' };
  }

  if (isLocalePath(ownPath, 'pricing')) {
    return { eventName: 'docs_pricing_click' };
  }

  if (accountHosts.has(url.hostname)) {
    return { eventName: 'docs_cloud_signup_click' };
  }

  if (isEverywhereGitHubUrl(url)) {
    return { eventName: 'docs_github_click' };
  }

  return null;
}

function isLocalePath(pathname: string, target: string): boolean {
  return /^\/(?:en|zh)(?:\/|$)/.test(pathname)
    ? pathname === `/${pathname.split('/')[1]}/${target}` ||
        pathname.startsWith(`/${pathname.split('/')[1]}/${target}/`)
    : pathname === `/${target}` || pathname.startsWith(`/${target}/`);
}

function isEverywhereGitHubUrl(url: URL): boolean {
  if (url.hostname !== 'github.com') return false;

  const pathname = url.pathname.toLowerCase();
  if (!pathname.startsWith('/sylinko/everywhere')) return false;

  return (
    pathname === '/sylinko/everywhere' ||
    pathname.startsWith('/sylinko/everywhere/') ||
    pathname.startsWith('/sylinko/everywhere.releases')
  );
}

function parseUrl(linkUrl: string): URL | null {
  try {
    const base =
      typeof window === 'undefined' ? 'https://everywhere.sylinko.com' : window.location.origin;
    return new URL(linkUrl, base);
  } catch {
    return null;
  }
}

function isSameOrigin(url: URL): boolean {
  if (typeof window === 'undefined') {
    return url.hostname === 'everywhere.sylinko.com';
  }

  return url.origin === window.location.origin;
}
