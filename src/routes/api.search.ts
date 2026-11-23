import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/search')({
  server: {
    handlers: {
      GET: async ({ request }) =>
        (await import('@/src/features/docs/search.server')).search.GET(request),
    },
  },
});
