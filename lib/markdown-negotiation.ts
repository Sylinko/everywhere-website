/** Wildcards alone keep HTML; an explicit, equally preferred Markdown type wins. */
export function prefersMarkdown(accept: string | null): boolean {
  const qualities = new Map<string, number>();
  for (const entry of (accept ?? '').split(',')) {
    const [type, ...parameters] = entry.trim().toLowerCase().split(';');
    const q = parameters.find((parameter) => /^\s*q\s*=/.test(parameter));
    const value = q?.split('=')[1]?.trim() ?? '1';
    const quality = /^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?|\.\d{1,3})$/.test(value)
      ? Number(value)
      : 0;
    const mediaType = type.trim();
    qualities.set(mediaType, Math.max(qualities.get(mediaType) ?? 0, quality));
  }
  const markdown = qualities.get('text/markdown') ?? 0;
  const html =
    qualities.get('text/html') ??
    qualities.get('text/*') ??
    qualities.get('*/*') ??
    0;
  return markdown > 0 && markdown >= html;
}

/** Negotiate page responses without changing redirects, errors or non-HTML bodies. */
export async function negotiateMarkdown(
  request: Request,
  respond: (request: Request) => Promise<Response>,
  render: (response: Response, url: URL) => Promise<string>
): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD')
    return respond(request);

  const markdown = prefersMarkdown(request.headers.get('Accept'));
  let upstream = request;
  if (markdown) {
    const headers = new Headers(request.headers);
    // HTML validators/ranges cannot describe the negotiated Markdown body.
    for (const name of [
      'If-None-Match',
      'If-Modified-Since',
      'If-Match',
      'If-Unmodified-Since',
      'If-Range',
      'Range',
    ])
      headers.delete(name);
    headers.set('Accept', 'text/html');
    headers.delete('Content-Length');
    // Incoming HEAD requests can carry an empty stream; never copy it into a GET.
    upstream = new Request(request.url, {
      method: 'GET',
      headers,
      signal: request.signal,
    });
  }

  const response = await respond(upstream);
  const html = /^text\/html(?:\s*;|$)/i.test(
    response.headers.get('Content-Type') ?? ''
  );
  if (!html && response.status !== 304) {
    if (markdown && request.method === 'HEAD') {
      await response.body?.cancel();
      return new Response(null, response);
    }
    return response;
  }

  const headers = new Headers(response.headers);
  const vary = (headers.get('Vary') ?? '').toLowerCase().split(/\s*,\s*/);
  if (!vary.includes('accept') && !vary.includes('*'))
    headers.append('Vary', 'Accept');

  if (!markdown || response.status !== 200) {
    if (request.method === 'HEAD') await response.body?.cancel();
    return new Response(request.method === 'HEAD' ? null : response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  const body = await render(response, new URL(request.url));
  headers.set('Content-Type', 'text/markdown; charset=utf-8');
  for (const name of [
    'Content-Length',
    'Content-Encoding',
    'Content-Range',
    'Transfer-Encoding',
    'ETag',
    'Last-Modified',
    'Accept-Ranges',
  ])
    headers.delete(name);
  return new Response(request.method === 'HEAD' ? null : body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
