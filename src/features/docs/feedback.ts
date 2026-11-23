import { createServerFn } from '@tanstack/react-start';
import type { Feedback } from '@/components/feedback';

export const rateDocument = createServerFn({ method: 'POST' })
  .validator((input: { url: string; feedback: Feedback }) => {
    if (
      typeof input?.url !== 'string' ||
      !/^\/(en|zh)\/docs(?:\/|$)/.test(input.url) ||
      !['good', 'bad'].includes(input.feedback?.opinion) ||
      typeof input.feedback.message !== 'string'
    ) {
      throw new Error('Invalid document feedback');
    }
    return input;
  })
  .handler(async ({ data }) => {
    const { onRateAction } = await import('@/lib/github');
    return onRateAction(data.url, data.feedback);
  });
