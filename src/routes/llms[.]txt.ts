import { createFileRoute } from '@tanstack/react-router';
import { llmsIndex } from '@/src/features/docs/llms.server';

export const Route = createFileRoute('/llms.txt')({
  server: { handlers: { GET: () => llmsIndex() } },
});
