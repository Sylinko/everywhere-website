import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cloudflare } from '@cloudflare/vite-plugin';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import tailwind from '@tailwindcss/vite';
import { fumadocsMdx } from 'fumadocs-mdx/vite';
import { staticPaths } from './scripts/static-paths.ts';

const root = fileURLToPath(new URL('./', import.meta.url))
  .replaceAll('\\', '/')
  .replace(/\/$/, '');
let runWorkerFirst: boolean | string[] | undefined;
const config = defineConfig({
  envDir: false,
  // Generated MDX boundaries are invisible to Vite's initial dependency scan.
  environments: {
    ssr: {
      optimizeDeps: {
        include: [
          'fumadocs-mdx/runtime/server',
          'fumadocs-mdx/runtime/browser',
          'fumadocs-ui/components/steps',
        ],
      },
    },
  },
  resolve: {
    alias: { '@': root, 'fumadocs-mdx:collections': root + '/.source' },
  },
  plugins: [
    cloudflare({
      viteEnvironment: { name: 'ssr' },
      remoteBindings: false,
      config(worker) {
        runWorkerFirst = worker.assets?.run_worker_first;
        // Exports do not exist yet in dev or during prerendering.
        if (worker.assets && Array.isArray(runWorkerFirst)) {
          worker.assets.run_worker_first = runWorkerFirst.filter(
            (rule) => !rule.startsWith('!')
          );
        }
      },
    }),
    fumadocsMdx(),
    tailwind(),
    tanstackStart({
      prerender: {
        enabled: true,
        // Cloudflare serves foo.html at /foo with its default HTML handling.
        autoSubfolderIndex: false,
        autoStaticPathsDiscovery: false,
        crawlLinks: false,
        failOnError: true,
        retryCount: 0,
        concurrency: 4,
      },
      pages: staticPaths().map((path) => ({ path })),
    }),
    react(),
    {
      name: 'static-assets-after-prerender',
      enforce: 'post',
      buildApp: {
        order: 'post',
        async handler(builder) {
          // Run after TanStack's prerender hook; preview/deploy use these final rules.
          const configPath = resolve(
            builder.environments.ssr.config.build.outDir,
            'wrangler.json'
          );
          const output = JSON.parse(await readFile(configPath, 'utf8'));
          output.assets.run_worker_first = runWorkerFirst;
          await writeFile(configPath, JSON.stringify(output));
        },
      },
    },
  ],
});

export default defineConfig(({ command, isPreview }) => {
  if (command === 'serve' && !isPreview) {
    process.env.CLOUDFLARE_ENV ??= 'dev';
  }

  return config;
});
