'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/cn';

export function Command({
  lang = 'en',
  label,
  command,
  className,
  'aria-label': ariaLabel,
}: {
  lang?: string;
  label: string;
  command: string;
  className?: string;
  'aria-label'?: string;
}) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const commandLabel = ariaLabel ?? (lang === 'zh' ? '命令' : 'command');
  const copyLabel =
    lang === 'zh' ? `复制 ${commandLabel}` : `Copy ${commandLabel}`;
  const copiedLabel = lang === 'zh' ? '已复制' : 'Copied';

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(command);
      setStatus('copied');
      timer.current = setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="not-prose min-w-0">
      <div
        className={cn(
          'bg-fd-muted flex h-9 min-w-0 items-center gap-1.5 rounded-lg px-2',
          className
        )}
      >
        <span
          aria-hidden="true"
          className="text-fd-muted-foreground w-7 shrink-0 text-center font-mono text-xs font-bold"
        >
          {label}
        </span>
        <input
          readOnly
          value={command}
          aria-label={commandLabel}
          spellCheck={false}
          className="h-7 min-w-0 flex-1 bg-transparent [mask-image:linear-gradient(to_right,black_calc(100%-18px),transparent)] font-mono text-sm outline-none"
        />
        <button
          type="button"
          onClick={copy}
          aria-label={status === 'copied' ? copiedLabel : copyLabel}
          title={status === 'copied' ? copiedLabel : copyLabel}
          className="hover:bg-fd-accent focus-visible:ring-fd-ring flex size-7 shrink-0 items-center justify-center rounded-md focus-visible:ring-2 focus-visible:outline-none"
        >
          {status === 'copied' ? (
            <Check className="size-3.5 text-green-600 dark:text-green-400" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      </div>
      <span
        role="status"
        className={
          status === 'error'
            ? 'mt-2 block text-sm text-red-600 dark:text-red-400'
            : 'sr-only'
        }
      >
        {status === 'copied'
          ? copiedLabel
          : status === 'error'
            ? lang === 'zh'
              ? '复制失败，请选中命令手动复制。'
              : 'Could not copy. Select the command and copy it manually.'
            : ''}
      </span>
    </div>
  );
}
