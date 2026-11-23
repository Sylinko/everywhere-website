import { createFileRoute } from '@tanstack/react-router';
import { serveMarkdown } from '@/src/features/docs/llms.server';

export const Route = createFileRoute('/$lang/docs.md')({
  server: { handlers: { GET: serveMarkdown } },
});
