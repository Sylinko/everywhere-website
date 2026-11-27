import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { request as httpRequest, type IncomingMessage } from 'node:http';
import { request as httpsRequest } from 'node:https';
import { parseConfigFileTextToJson } from 'typescript';
import { staticPaths } from './static-paths';
import { getPricingContent } from '../src/features/site/pricing/pricing-data';

// Run against `pnpm start` after building, so the real asset router is exercised.
const origin = process.argv[2] ?? 'http://127.0.0.1:3000';
const pages = [
  ...staticPaths().filter((path) => !/\.[^/]+$/.test(path)),
  '/en/pricing',
  '/zh/pricing',
];
const get = (path: string, headers: HeadersInit = {}, method = 'GET') =>
  fetch(new URL(path, origin), { headers, method, redirect: 'manual' });
const markdownHeaders = { Accept: 'text/markdown' };

// Prerendering needs the Worker; the deployable config must restore asset bypasses.
const { config: sourceConfig, error } = parseConfigFileTextToJson(
  'wrangler.jsonc',
  await readFile('wrangler.jsonc', 'utf8')
);
assert.equal(error, undefined);
const outputConfig = JSON.parse(
  await readFile('dist/server/wrangler.json', 'utf8')
);
assert.deepEqual(
  outputConfig.assets.run_worker_first,
  sourceConfig.assets.run_worker_first
);

// Discovery must survive redirects, static assets, Markdown and HEAD handling.
const discoveryTargets = new Set<string>();
for (const path of ['/', '/en', '/zh', '/en/', '/zh/']) {
  for (const method of ['GET', 'HEAD']) {
    for (const accept of ['text/html', 'text/markdown']) {
      const response = await get(path, { Accept: accept }, method);
      assert.equal(
        response.status,
        path === '/' ? 307 : path.endsWith('/') ? 301 : 200,
        path
      );
      const links = response.headers.get('Link') ?? '';
      assert.match(
        links,
        /<\/llms\.txt>; rel="describedby"; type="text\/markdown"/,
        path
      );
      for (const lang of ['en', 'zh']) {
        assert.ok(
          links.includes(
            `</${lang}/docs.md>; rel="service-doc"; type="text/markdown"; hreflang="${lang}"`
          ),
          path
        );
      }
      for (const [, target] of links.matchAll(/<([^>]+)>/g))
        discoveryTargets.add(target);
      if (method === 'HEAD') assert.equal(await response.text(), '', path);
      else await response.body?.cancel();
    }
  }
}
for (const target of discoveryTargets) {
  const response = await get(target);
  assert.equal(response.status, 200, target);
  assert.match(
    response.headers.get('Content-Type') ?? '',
    /^text\/markdown/,
    target
  );
  assert.match(await response.text(), /^# /m, target);
}
process.stdout.write(
  'Verified homepage discovery Link headers and all advertised targets.\n'
);

for (const path of pages) {
  const html = await get(path);
  assert.equal(html.status, 200, path);
  assert.match(html.headers.get('Content-Type') ?? '', /^text\/html/, path);
  assert.match(html.headers.get('Vary') ?? '', /\bAccept\b/i, path);
  const htmlBody = await html.text();
  if (!path.endsWith('/pricing')) {
    assert.equal(
      htmlBody,
      await readFile(`dist/client${path}.html`, 'utf8'),
      path
    );
  }

  const markdown = await get(path, markdownHeaders);
  assert.equal(markdown.status, 200, path);
  assert.match(
    markdown.headers.get('Content-Type') ?? '',
    /^text\/markdown/,
    path
  );
  assert.match(markdown.headers.get('Vary') ?? '', /\bAccept\b/i, path);
  assert.equal(
    markdown.headers.get('Content-Language'),
    path.startsWith('/zh') ? 'zh-CN' : 'en',
    path
  );
  assert.equal(markdown.headers.get('ETag'), null, path);
  const body = await markdown.text();
  assert.match(body, /^Source: https?:\/\//m, path);
  assert.match(body, /^(?:# .+|=+)$/m, path);
  assert.doesNotMatch(body, /<!DOCTYPE html|<html|<script|__TSR__/i, path);

  if (path.includes('/docs')) {
    const exported = await get(`${path}.md`);
    assert.equal(exported.status, 200, path);
    assert.equal(body, await exported.text(), path);
  }
  if (path.endsWith('/pricing')) {
    assert.equal(markdown.headers.get('Cache-Control'), 'private, no-store');
    for (const plan of getPricingContent(path.split('/')[1]).plans) {
      const price = plan.originalPrice
        ? `~~${plan.originalPrice}~~ ${plan.price}`
        : plan.price;
      assert.ok(body.includes(price), `${path}: ${plan.name} price`);
    }
  }
  if (path === '/en') {
    assert.equal(body.match(/\[OpenAI\]/g)?.length, 1);
  }
  if (path.endsWith('/download')) {
    assert.doesNotMatch(body, /Detecting your system/);
    assert.match(
      body,
      /`curl -fsSL https:\/\/aka.sylinko.com\/get-everywhere.sh \| sh -s -- --channel stable`/
    );
  }
}

for (const accept of [
  '*/*',
  'text/markdown;q=0',
  'text/html, text/markdown;q=0.5',
]) {
  const response = await get('/en', { Accept: accept });
  assert.match(response.headers.get('Content-Type') ?? '', /^text\/html/);
  await response.body?.cancel();
}

const html = await get('/en');
const etag = html.headers.get('ETag');
assert.ok(etag, 'Prerendered HTML retains its validator');
await html.body?.cancel();
const notModified = await get('/en', { 'If-None-Match': etag });
assert.equal(notModified.status, 304);
assert.match(notModified.headers.get('Vary') ?? '', /\bAccept\b/i);
assert.match(notModified.headers.get('Link') ?? '', /rel="describedby"/);
const converted = await get('/en', {
  ...markdownHeaders,
  'If-None-Match': etag,
  Range: 'bytes=0-9',
});
assert.equal(converted.status, 200);
assert.match(await converted.text(), /Everywhere/);

for (const path of [
  '/en',
  '/en/docs/models',
  '/zh/policies/privacy',
  '/en/pricing',
]) {
  // Fetch omits Content-Length: 0 on HEAD; native clients can send it.
  const target = new URL(path, origin);
  const response = await new Promise<IncomingMessage>((resolve, reject) => {
    const request = (target.protocol === 'https:' ? httpsRequest : httpRequest)(
      target,
      {
        method: 'HEAD',
        headers: { ...markdownHeaders, 'Content-Length': '0' },
      },
      resolve
    );
    request.on('error', reject);
    request.end();
  });
  assert.equal(response.statusCode, 200, path);
  assert.match(response.headers['content-type'] ?? '', /^text\/markdown/, path);
  let body = '';
  for await (const chunk of response) body += chunk;
  assert.equal(body, '', path);
}

for (const [path, target, status] of [
  ['/', '/zh', 307],
  ['/docs/models', '/zh/docs/models', 307],
  ['/en/docs/', '/en/docs', 301],
  ['/EN-us/docs/', '/en/docs', 301],
] as const) {
  const response = await get(path, {
    ...markdownHeaders,
    'Accept-Language': 'zh-CN',
  });
  assert.equal(response.status, status, path);
  assert.equal(
    new URL(response.headers.get('Location')!, origin).pathname,
    target,
    path
  );
  await response.body?.cancel();
}

for (const path of [
  '/en/missing-page',
  '/en/docs/missing-page',
  '/en/docs/missing-page.md',
  '/zh/docs/missing-page.md',
]) {
  const response = await get(path, markdownHeaders);
  assert.equal(response.status, 404, path);
  await response.body?.cancel();
}

for (const [path, contentType] of [
  ['/api/search?query=Everywhere', /application\/json/],
  ['/favicon.ico', /image\//],
  ['/sitemap.xml', /xml/],
  ['/llms.txt', /text\/markdown/],
  ['/en/llms-full.txt', /text\/markdown/],
] as const) {
  const response = await get(path, markdownHeaders);
  assert.equal(response.status, 200, path);
  assert.match(response.headers.get('Content-Type') ?? '', contentType, path);
  await response.body?.cancel();
}

process.stdout.write(
  `Verified HTML and Markdown for ${pages.length} pages, exports, HEAD, redirects, validators and non-page routes.\n`
);
