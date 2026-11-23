import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/api/badges/$badge')({
  server: {
    handlers: {
      GET: async ({ params }) =>
        (await import('../features/badges.server')).getBadge(params.badge),
    },
  },
});
