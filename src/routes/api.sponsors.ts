import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/api/sponsors')({
  server: {
    handlers: {
      GET: async ({ request }) =>
        (await import('../features/sponsors.server')).getSponsors(request),
    },
  },
});
