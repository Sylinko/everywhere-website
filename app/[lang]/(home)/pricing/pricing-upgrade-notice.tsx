'use client';

import { cn } from '@/lib/cn';
import { Megaphone } from 'lucide-react';
import { buttonVariants } from '@/components/common/variants';
import Link from 'next/link';
import type { UpgradeNotice } from './pricing-data';

export function UpgradeNotice({
  data,
  lang,
}: {
  data: UpgradeNotice;
  lang: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border px-4 py-3',
        'bg-amber-500/6 border-amber-500/25 dark:bg-amber-500/10 dark:border-amber-500/20',
      )}
    >
      <Megaphone className="size-5 shrink-0 text-amber-500" />
      <p className="flex-1 text-sm">
        {data.description}
      </p>
      <Link
        href={`/${lang}/pricing/upgrade-notice`}
        className={cn(
          buttonVariants({ size: 'sm', variant: 'secondary' }),
          'rounded-lg shrink-0',
        )}
      >
        {data.buttonText}
      </Link>
    </div>
  );
}
