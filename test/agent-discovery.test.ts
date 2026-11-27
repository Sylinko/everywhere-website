import assert from 'node:assert/strict';
import { test } from 'node:test';
import { withAgentDiscovery } from '../lib/agent-discovery';

const origin = 'https://everywhere.sylinko.com';
const links = [
  '</llms.txt>; rel="describedby"; type="text/markdown"',
  '</en/docs.md>; rel="service-doc"; type="text/markdown"; hreflang="en"',
  '</zh/docs.md>; rel="service-doc"; type="text/markdown"; hreflang="zh"',
].join(', ');

test('advertises existing Markdown resources on homepage GET and HEAD responses', async () => {
  for (const path of ['/', '/en', '/zh', '/en/', '/zh/', '/en?source=agent']) {
    for (const method of ['GET', 'HEAD']) {
      for (const contentType of ['text/html', 'text/markdown']) {
        const body = method === 'HEAD' ? null : 'Homepage';
        const response = withAgentDiscovery(
          new Request(origin + path, { method }),
          new Response(body, { headers: { 'Content-Type': contentType } })
        );
        assert.equal(response.headers.get('Link'), links);
        assert.equal(response.headers.get('Content-Type'), contentType);
        assert.equal(await response.text(), body ?? '');
      }
    }
  }
});

test('preserves existing Link values, cache validators and response policy', async () => {
  const originalLink = '</assets/site.css>; rel="preload"; as="style"';
  const response = withAgentDiscovery(
    new Request(`${origin}/en`),
    new Response('Homepage', {
      headers: {
        Link: originalLink,
        ETag: '"html"',
        Vary: 'Accept',
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'Content-Language': 'en',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  );
  assert.equal(response.headers.get('Link'), `${originalLink}, ${links}`);
  assert.equal(response.headers.get('ETag'), '"html"');
  assert.equal(response.headers.get('Vary'), 'Accept');
  assert.equal(
    response.headers.get('Cache-Control'),
    'public, max-age=0, must-revalidate'
  );
  assert.equal(response.headers.get('Content-Language'), 'en');
  assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
  assert.equal(await response.text(), 'Homepage');
});

test('adds discovery to immutable redirects and conditional homepage responses', () => {
  const redirect = withAgentDiscovery(
    new Request(origin),
    Response.redirect(`${origin}/zh`, 307)
  );
  assert.equal(redirect.status, 307);
  assert.equal(redirect.headers.get('Location'), `${origin}/zh`);
  assert.equal(redirect.headers.get('Link'), links);
  const notModified = withAgentDiscovery(
    new Request(`${origin}/en`),
    new Response(null, { status: 304, headers: { ETag: '"html"' } })
  );
  assert.equal(notModified.status, 304);
  assert.equal(notModified.body, null);
  assert.equal(notModified.headers.get('Link'), links);
  assert.equal(notModified.headers.get('ETag'), '"html"');
});

test('does not change other routes, methods or error responses', () => {
  for (const [path, method, status] of [
    ['/en/docs', 'GET', 200],
    ['/en/docs.md', 'GET', 200],
    ['/api/search', 'GET', 200],
    ['/llms.txt', 'GET', 200],
    ['/en/missing', 'GET', 404],
    ['/fr', 'GET', 404],
    ['/en', 'POST', 200],
    ['/en', 'GET', 500],
  ] as const) {
    const original = new Response('Original', { status });
    assert.equal(
      withAgentDiscovery(new Request(origin + path, { method }), original),
      original
    );
  }
});
