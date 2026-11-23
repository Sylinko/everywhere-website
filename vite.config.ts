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
export default defineConfig({
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
    cloudflare({ viteEnvironment: { name: 'ssr' }, remoteBindings: false }),
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
  ],
});
