import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const readJson = async (path) =>
  JSON.parse(await readFile(new URL(path, root), 'utf8'));
const { routes, dynamicRoutes } = await readJson(
  '.next/prerender-manifest.json'
);

for (const lang of ['en', 'zh']) {
  for (const suffix of [
    '',
    '/download',
    '/docs',
    '/policies/privacy',
    '/llms-full.txt',
  ]) {
    const route = `/${lang}${suffix}`;
    assert.equal(
      routes[route]?.initialRevalidateSeconds,
      false,
      `${route} must be prerendered`
    );
    const meta = await readJson(`.next/server/app${route}.meta`);
    assert.ok(
      !meta.status || meta.status === 200,
      `${route} must not prerender an error`
    );
  }

  assert.equal(
    routes[`/${lang}/pricing`],
    undefined,
    'Pricing must fetch models at request time'
  );
  const html = await readFile(
    new URL(`.next/server/app/${lang}.html`, root),
    'utf8'
  );
  assert.match(html, new RegExp(`<html[^>]*lang="${lang}"`));
  assert.ok(
    !html.includes('/_next/image?'),
    'Local images must bypass the Worker image proxy'
  );

  for (const section of ['docs', 'policies']) {
    const pages = Object.keys(routes).filter((route) =>
      route.startsWith(`/${lang}/${section}/`)
    );
    assert.ok(pages.length > 0, `${lang} ${section} must remain prerendered`);
    for (const route of pages) {
      const meta = await readJson(`.next/server/app${route}.meta`);
      assert.ok(
        !meta.status || meta.status === 200,
        `${route} must not prerender an error`
      );
    }
  }
}

for (const pattern of [
  '/[lang]/docs/[[...slug]]',
  '/[lang]/policies/[...slug]',
  '/[lang]/llms.mdx/[[...slug]]',
]) {
  assert.equal(
    dynamicRoutes[pattern]?.fallback,
    false,
    `${pattern} must reject unknown slugs without rendering`
  );
}

assert.equal(
  dynamicRoutes['/[lang]/pricing'],
  undefined,
  'Pricing must not use an SSG fallback'
);
console.log(
  'Rendering checks passed: static pages and language HTML, direct images, bounded content routes, dynamic pricing.'
);

const baseUrl = process.argv[2];
if (baseUrl) {
  for (const lang of ['en', 'zh']) {
    const headers = { Cookie: `NEXT_LOCALE=${lang}` };
    for (const suffix of [
      '',
      '/download',
      '/docs',
      '/policies/privacy',
      '/llms-full.txt',
    ]) {
      const route = `/${lang}${suffix}`;
      const response = await fetch(new URL(route, baseUrl), { headers });
      assert.equal(response.status, 200, route);
      assert.match(
        response.headers.get('cache-control') ?? '',
        /s-maxage=[1-9]/,
        route
      );
      const body = await response.text();
      if (suffix !== '/llms-full.txt') {
        assert.match(body, new RegExp(`<html[^>]*lang="${lang}"`), route);
        assert.ok(!body.includes('/_next/image?'), route);
      }
    }

    const pricing = await fetch(new URL(`/${lang}/pricing`, baseUrl), {
      headers,
    });
    assert.equal(pricing.status, 200);
    assert.match(pricing.headers.get('cache-control') ?? '', /no-store/);
    const html = await pricing.text();
    const models =
      html.match(/<section[^>]*id="models"[\s\S]*?<\/section>/)?.[0] ?? '';
    assert.match(
      models,
      /<tbody[^>]*>\s*<tr/,
      'Pricing must render models from the Gateway binding'
    );

    const missing = await fetch(
      new URL(`/${lang}/docs/__rendering-check-missing`, baseUrl),
      { headers }
    );
    assert.equal(missing.status, 404);
    assert.ok(
      (await missing.text()).includes(
        lang === 'zh' ? '页面未找到' : 'Page Not Found'
      )
    );
  }

  const rootRedirect = await fetch(new URL('/', baseUrl), {
    headers: { Cookie: 'NEXT_LOCALE=zh', 'Accept-Language': 'en' },
    redirect: 'manual',
  });
  assert.equal(rootRedirect.status, 307);
  assert.equal(
    new URL(rootRedirect.headers.get('location'), baseUrl).pathname,
    '/zh'
  );
  assert.match(
    rootRedirect.headers.get('cache-control') ?? '',
    /private.*no-store/
  );
  console.log(
    'Worker checks passed: cacheable pages, dynamic model table, localized 404 and language redirect.'
  );
}
