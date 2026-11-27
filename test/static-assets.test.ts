import assert from 'node:assert/strict';
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { test } from 'node:test';
import { parseConfigFileTextToJson } from 'typescript';
import { staticPaths } from '../scripts/static-paths';

// Exercise Cloudflare's asset router, using the runtime already shipped with Vite.
const { Miniflare } = createRequire(
  import.meta.resolve('@cloudflare/vite-plugin')
)('miniflare');

test('serves generated Markdown exports without invoking the Worker', async (t) => {
  const { config, error } = parseConfigFileTextToJson(
    'wrangler.jsonc',
    await readFile('wrangler.jsonc', 'utf8')
  );
  assert.equal(error, undefined);
  const directory = await mkdtemp(join(tmpdir(), 'everywhere-static-assets-'));
  t.after(async () => {
    assert.equal(dirname(directory), resolve(tmpdir()));
    await rm(directory, { recursive: true, force: true });
  });
  const exports = staticPaths().filter((path) =>
    /^\/(en|zh)\/.*\.(md|txt)$/.test(path)
  );
  assert.ok(exports.length > 0);
  for (const path of [...exports, '/en.html', '/zh.html']) {
    const file = join(directory, path);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, `# ${path}\n`);
  }
  await copyFile('public/_headers', join(directory, '_headers'));
  const runtime = new Miniflare({
    cf: false,
    enableDevRegistry: false,
    telemetry: { enabled: false },
    workers: [
      {
        config: {
          name: 'static-assets-test',
          compatibilityDate: config.compatibility_date,
          assets: {
            directory,
            hasUserWorker: true,
            htmlHandling: config.assets.html_handling,
            runWorkerFirst: config.assets.run_worker_first,
          },
          manifest: {
            mainModule: 'index.js',
            modules: {
              'index.js': {
                type: 'esm',
                contents: `export default {
                fetch() { return new Response('Worker', { headers: { 'X-Test-Worker': 'true' } }); }
              };`,
              },
            },
          },
        },
      },
    ],
  });
  try {
    for (const path of exports) {
      for (const method of ['GET', 'HEAD']) {
        const response = await runtime.dispatchFetch(
          `https://example.com${path}`,
          { method }
        );
        assert.equal(response.status, 200, `${method} ${path}`);
        assert.equal(
          response.headers.get('X-Test-Worker'),
          null,
          `${method} ${path}`
        );
        assert.match(
          response.headers.get('Content-Type') ?? '',
          /^text\/markdown/
        );
        assert.equal(
          response.headers.get('Content-Language'),
          path.startsWith('/zh/') ? 'zh-CN' : 'en'
        );
        assert.equal(response.headers.get('X-Robots-Tag'), 'noindex');
        assert.equal(
          await response.text(),
          method === 'HEAD' ? '' : `# ${path}\n`
        );
      }
    }
    for (const path of [
      '/',
      '/en',
      '/zh',
      '/en/docs',
      '/zh/pricing',
      '/en/docs/',
      '/en/docs.md/',
    ]) {
      const response = await runtime.dispatchFetch(
        `https://example.com${path}`
      );
      assert.equal(response.headers.get('X-Test-Worker'), 'true', path);
      await response.body?.cancel();
    }
    const post = await runtime.dispatchFetch('https://example.com/en/docs.md', {
      method: 'POST',
    });
    assert.equal(post.status, 405);
    assert.equal(post.headers.get('X-Test-Worker'), null);
    await post.body?.cancel();
    const missing = await runtime.dispatchFetch(
      'https://example.com/en/docs/missing.md'
    );
    assert.equal(missing.status, 404);
    assert.equal(missing.headers.get('X-Test-Worker'), null);
    await missing.body?.cancel();
  } finally {
    await runtime.dispose();
  }
});
