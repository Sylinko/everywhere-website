import { createFileRoute } from '@tanstack/react-router';
import { getSupportedModels } from '@/lib/pricing-models';

export const Route = createFileRoute('/api/models')({
  server: {
    handlers: {
      GET: async () =>
        Response.json(
          { models: await getSupportedModels() },
          {
            headers: { 'Cache-Control': 'public, max-age=600' },
          }
        ),
    },
  },
});
