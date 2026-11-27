import handler, { createServerEntry } from '@tanstack/react-start/server-entry';
import { env } from 'cloudflare:workers';
import { withAgentDiscovery } from '@/lib/agent-discovery';
import { negotiateMarkdown } from '@/lib/markdown-negotiation';
import { renderPageMarkdown } from '@/src/features/markdown.server';

export default createServerEntry({
  async fetch(request, options) {
    const { pathname } = new URL(request.url);
    if (
      !['GET', 'HEAD'].includes(request.method) ||
      !/^\/(en|zh)(?:\/|$)/.test(pathname) ||
      pathname.endsWith('/')
    )
      return withAgentDiscovery(request, await handler.fetch(request, options));

    const respond = async (request: Request) => {
      // Keep prerendered HTML fast; Vite dev renders pages through Start instead.
      if (import.meta.env.PROD) {
        const asset = await env.ASSETS.fetch(request);
        if (asset.status !== 404) return asset;
        await asset.body?.cancel();
      }
      return handler.fetch(request, options);
    };
    // Existing .md exports and other file-shaped routes keep their own semantics.
    if (/\.[^/]+$/.test(pathname)) return respond(request);
    return withAgentDiscovery(
      request,
      await negotiateMarkdown(request, respond, renderPageMarkdown)
    );
  },
});
