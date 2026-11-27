import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ModelSupportTable } from '../src/features/site/pricing/model-support-table';
import { htmlToMarkdown } from '../lib/html-markdown';
import {
  negotiateMarkdown,
  prefersMarkdown,
} from '../lib/markdown-negotiation';

for (const accept of [
  'text/markdown',
  'text/markdown, text/html',
  'text/markdown;q=0.9, text/html;q=0.5',
  ' TEXT/MARKDOWN ; charset=utf-8 ; Q=0.9 , text/html;q=0.5',
  'text/markdown;q=0.5, text/html;q=0, */*',
  'text/markdown;q=.5, text/*;q=0.1',
]) {
  test(`negotiates Markdown for ${accept}`, () => {
    assert.equal(prefersMarkdown(accept), true);
  });
}

for (const accept of [
  null,
  '',
  '*/*',
  'text/*',
  'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'text/markdown;q=0, */*',
  'text/markdown;q=0.5, text/html',
  'text/markdown;q=0.5, text/*;q=0.8',
  'text/markdown;q=invalid',
  'text/markdown;q=1.1',
  'text/markdown-not-really',
  'application/json;note=text/markdown',
]) {
  test(`keeps HTML for ${accept}`, () => {
    assert.equal(prefersMarkdown(accept), false);
  });
}

const url = 'https://everywhere.sylinko.com/en';
const html = '<html><body><main><h1>Everywhere</h1></main></body></html>';
const render = async (response: Response, url: URL) =>
  htmlToMarkdown(await response.text(), url);
const request = (method = 'GET') =>
  new Request(url, { method, headers: { Accept: 'text/markdown' } });

test('preserves HTML and its validators by default, adding Vary: Accept', async () => {
  const req = new Request(url);
  const response = await negotiateMarkdown(
    req,
    async (upstream) => {
      assert.equal(upstream, req);
      return new Response(html, {
        headers: { 'Content-Type': 'text/html', ETag: '"html"' },
      });
    },
    render
  );
  assert.equal(await response.text(), html);
  assert.equal(response.headers.get('ETag'), '"html"');
  assert.equal(response.headers.get('Vary'), 'Accept');
});

test('converts only the body metadata and preserves policy and cache headers', async () => {
  const req = request();
  for (const name of [
    'If-None-Match',
    'If-Modified-Since',
    'If-Range',
    'Range',
  ])
    req.headers.set(name, 'html-only');
  const response = await negotiateMarkdown(
    req,
    async (upstream) => {
      assert.equal(upstream.headers.get('Accept'), 'text/html');
      for (const name of [
        'If-None-Match',
        'If-Modified-Since',
        'If-Range',
        'Range',
      ])
        assert.equal(upstream.headers.get(name), null);
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html',
          'Content-Length': '1000',
          'Content-Encoding': 'gzip',
          'Content-Range': 'bytes 0-999/1000',
          'Accept-Ranges': 'bytes',
          ETag: '"html"',
          'Last-Modified': 'Fri, 27 Nov 2026 00:00:00 GMT',
          Vary: 'Accept-Language',
          'Cache-Control': 'private, no-store',
          'Content-Language': 'en',
          'X-Content-Type-Options': 'nosniff',
          'Content-Signal': 'ai-train=no',
          'Set-Cookie': 'example=value; Secure; HttpOnly',
        },
      });
    },
    render
  );
  assert.match(await response.text(), /# Everywhere/);
  assert.equal(
    response.headers.get('Content-Type'),
    'text/markdown; charset=utf-8'
  );
  assert.equal(response.headers.get('Vary'), 'Accept-Language, Accept');
  assert.equal(response.headers.get('Cache-Control'), 'private, no-store');
  assert.equal(response.headers.get('Content-Language'), 'en');
  assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
  assert.equal(response.headers.get('Content-Signal'), 'ai-train=no');
  assert.equal(
    response.headers.get('Set-Cookie'),
    'example=value; Secure; HttpOnly'
  );
  for (const name of [
    'Content-Length',
    'Content-Encoding',
    'Content-Range',
    'Accept-Ranges',
    'ETag',
    'Last-Modified',
  ])
    assert.equal(response.headers.get(name), null);
});

test('HEAD describes Markdown but has no body', async () => {
  const response = await negotiateMarkdown(
    request('HEAD'),
    async (upstream) => {
      assert.equal(upstream.method, 'GET');
      return new Response(html, { headers: { 'Content-Type': 'text/html' } });
    },
    render
  );
  assert.equal(
    response.headers.get('Content-Type'),
    'text/markdown; charset=utf-8'
  );
  assert.equal(await response.text(), '');
});

test('does not copy an incoming HEAD transport body into the internal GET', async () => {
  // Incoming Workers requests can retain an empty stream for Content-Length: 0.
  // Node's Request constructor disallows HEAD bodies, so model that input explicitly.
  const req = new Request(url, {
    method: 'POST',
    headers: { Accept: 'text/markdown', 'Content-Length': '0' },
    body: '',
  });
  Object.defineProperty(req, 'method', { value: 'HEAD' });
  const response = await negotiateMarkdown(
    req,
    async (upstream) => {
      assert.equal(upstream.method, 'GET');
      assert.equal(upstream.body, null);
      assert.equal(upstream.headers.get('Content-Length'), null);
      return new Response(html, { headers: { 'Content-Type': 'text/html' } });
    },
    render
  );
  assert.equal(response.status, 200);
  assert.equal(
    response.headers.get('Content-Type'),
    'text/markdown; charset=utf-8'
  );
  assert.equal(await response.text(), '');
});

test('keeps redirects, errors, JSON, exports and non-GET methods unchanged', async () => {
  for (const original of [
    Response.redirect(`${url}/docs`, 301),
    Response.json({ models: [] }),
    new Response('Not Found', { status: 404 }),
    new Response('# Export', { headers: { 'Content-Type': 'text/markdown' } }),
  ]) {
    const response = await negotiateMarkdown(
      request(),
      async () => original,
      render
    );
    assert.equal(response, original);
  }
  const original = new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
  assert.equal(
    await negotiateMarkdown(request('POST'), async () => original, render),
    original
  );
  const error = await negotiateMarkdown(
    request('HEAD'),
    async () =>
      new Response(html, {
        status: 404,
        headers: { 'Content-Type': 'text/html' },
      }),
    render
  );
  assert.equal(error.status, 404);
  assert.equal(await error.text(), '');
});

test('Vary handles conditional HTML responses, existing Accept and wildcard', async () => {
  for (const vary of ['Accept-Encoding', 'Accept', '*']) {
    const response = await negotiateMarkdown(
      new Request(url),
      async () =>
        new Response(null, {
          status: 304,
          headers: { Vary: vary, ETag: '"html"' },
        }),
      render
    );
    assert.equal(response.status, 304);
    assert.equal(
      response.headers.get('Vary'),
      vary === 'Accept-Encoding' ? 'Accept-Encoding, Accept' : vary
    );
  }
});

test('extracts readable content, links, code and tables without layout or scripts', () => {
  const markdown = htmlToMarkdown(
    `<!doctype html><html><head>
    <script type="application/ld+json">{"name":"Everywhere"}</script>
    <style>.layout { color: red }</style></head><body>
    <header>Site navigation</header><nav>Menu</nav>
    <main><h1>Everywhere 桌面助手</h1><p>Read <!-- --> <a href="/en/docs">the docs</a> &amp; learn.</p>
    <ul><li>First</li><li>Second</li></ul>
    <pre><code class="language-sh">echo hello\necho world</code></pre>
    <table><thead><tr><th>Plan</th><th>Price</th></tr></thead>
    <tbody><tr><td>Free</td><td>$0</td></tr></tbody></table>
    <img src="/image.png" alt="Screenshot" />
    <svg><text>Decorative icon</text></svg><span aria-hidden="true">Decoration</span>
    <script>window.secret = true;</script></main><footer>Footer text</footer>
    </body></html>`,
    new URL(url)
  );
  assert.match(markdown, /# Everywhere 桌面助手/);
  assert.match(
    markdown,
    /\[the docs\]\(https:\/\/everywhere.sylinko.com\/en\/docs\)/
  );
  assert.match(markdown, /\* First\n\* Second/);
  assert.match(markdown, /```sh\necho hello\necho world\n```/);
  assert.match(markdown, /\| Plan\s*\| Price\s*\|/);
  assert.match(
    markdown,
    /!\[Screenshot\]\(https:\/\/everywhere.sylinko.com\/image.png\)/
  );
  assert.match(markdown, /```json\n\{"name":"Everywhere"\}\n```/);
  assert.doesNotMatch(
    markdown,
    /Site navigation|Menu|Footer text|window.secret|Decoration|Decorative|<!--|<\/?(?:div|script|style|svg)/
  );
});

test('keeps CSS-separated prices, commands and disclosures readable without animation copies', () => {
  const markdown = htmlToMarkdown(
    `<main>
    <div class="flex"><span class="line-through">$10</span><span>$8</span><span>/month</span></div>
    <div class="flex flex-col"><span>First estimate</span><span>Second estimate</span></div>
    <table><tr><th>Usage</th></tr><tr><td><span class="block">100 requests</span><span class="block">1M credits</span></td></tr>
    <tr hidden><td>Long-context pricing</td></tr></table>
    <input readonly value="curl -fsSL https://example.com/install | sh" />
    <a href="https://example.com">Model provider</a>
    <a href="https://example.com" data-markdown-ignore="true">Animation copy</a>
    <span class="invisible">Spacing placeholder</span>
  </main>`,
    new URL(url)
  );
  assert.match(markdown, /~~\$10~~ \$8 \/month/);
  assert.match(markdown, /First estimate Second estimate/);
  assert.match(markdown, /100 requests\s+1M credits/);
  assert.match(markdown, /Long-context pricing/);
  assert.match(markdown, /`curl -fsSL https:\/\/example.com\/install \| sh`/);
  assert.match(markdown, /Model provider/);
  assert.doesNotMatch(markdown, /Animation copy|Spacing placeholder/);
});

test('preserves rendered model access, rates and collapsed long-context pricing', () => {
  const html = renderToStaticMarkup(
    createElement(ModelSupportTable, {
      title: 'Models & Credits',
      lang: 'en',
      models: [
        {
          model: 'Fixture model',
          company: 'OpenAI',
          minimumTier: 'plus',
          inputModalities: ['text', 'image'],
          quotaLimited: false,
          limitedTimeOffer: false,
          deprecationDate: '',
          pricing: [
            { threshold: 0, pricing: { input: 100, output: 500 } },
            { threshold: 200_000, pricing: { input: 200, output: 1000 } },
          ],
        },
      ],
    })
  );
  assert.match(html, /hidden=""/);
  const markdown = htmlToMarkdown(html, new URL(`${url}/pricing`));
  assert.match(markdown, /Fixture model/);
  assert.match(markdown, /No window limit/);
  assert.match(markdown, /Text Image/);
  assert.match(markdown, /Starter Not included/);
  assert.match(markdown, /Plus Included/);
  assert.match(
    markdown,
    /input rate is 1M credits and the output rate is 5M credits/
  );
  assert.match(
    markdown,
    /input rate is 2M credits and the output rate is 10M credits/
  );
  assert.match(markdown, /200,000/);
});
