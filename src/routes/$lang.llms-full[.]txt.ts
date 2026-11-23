import { createFileRoute } from '@tanstack/react-router';
import { llmsFull } from '@/src/features/docs/llms.server';

export const Route = createFileRoute('/$lang/llms-full.txt')({
  server: { handlers: { GET: ({ params }) => llmsFull(params.lang) } },
});
