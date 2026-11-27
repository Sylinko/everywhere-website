import { i18n } from './i18n';

const homepageLinks = [
  '</llms.txt>; rel="describedby"; type="text/markdown"',
  ...i18n.languages.map(
    (lang) =>
      `</${lang}/docs.md>; rel="service-doc"; type="text/markdown"; hreflang="${lang}"`
  ),
].join(', ');

export function withAgentDiscovery(
  request: Request,
  response: Response
): Response {
  const { pathname } = new URL(request.url);
  const homepage =
    pathname === '/' ||
    i18n.languages.some(
      (lang) => pathname === `/${lang}` || pathname === `/${lang}/`
    );
  if (
    !homepage ||
    !['GET', 'HEAD'].includes(request.method) ||
    response.status >= 400
  )
    return response;

  const headers = new Headers(response.headers);
  headers.append('Link', homepageLinks);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
