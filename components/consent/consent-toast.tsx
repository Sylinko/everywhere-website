'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import type { ConsentTranslation } from './translations';
import { Cookie } from 'lucide-react';

interface ConsentToastProps {
  visible: boolean;
  translation: ConsentTranslation['toast'];
  lang: string;
  onAccept: () => void;
  onSettings: () => void;
}

export function ConsentToast({
  visible,
  translation: t,
  lang,
  onAccept,
  onSettings,
}: ConsentToastProps) {
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (visible) {
      // Mount first, then trigger slide-up on next frame
      setMounted(true);
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimating(true));
      });
      return () => cancelAnimationFrame(raf);
    } else {
      setAnimating(false);
      const timer = setTimeout(() => setMounted(false), 350);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!mounted) return null;

  const cookiePolicyHref = `/${lang}/policies/cookie`;

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-9999 w-101 max-w-[calc(100vw-3rem)]',
        'transition-all duration-350 ease-out',
        animating
          ? 'translate-y-0 opacity-100'
          : 'translate-y-full opacity-0',
      )}
      role="dialog"
      aria-label={t.title}
    >
      <div
        className={cn(
          'rounded-xl border p-5 shadow-2xl backdrop-blur-xl',
          'bg-fd-card/95 border-fd-border',
          'dark:bg-fd-card/90 dark:border-fd-border/80',
        )}
      >
        {/* Header */}
        <div className="mb-3 flex items-center gap-2">
          <Cookie className="text-brand h-5 w-5 shrink-0" />
          <h3 className="text-fd-foreground text-sm font-semibold">
            {t.title}
          </h3>
        </div>

        {/* Description with Cookie Policy link */}
        <p className="text-fd-muted-foreground mb-4 text-xs leading-relaxed">
          {t.description}{' '}
          <a
            href={cookiePolicyHref}
            className="text-brand hover:text-brand-secondary underline underline-offset-2 transition-colors"
          >
            {t.cookiePolicy}
          </a>
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onAccept}
            className={cn(
              'flex-1 rounded-lg px-4 py-2 text-xs font-medium transition-colors',
              'bg-brand text-brand-foreground hover:bg-brand-secondary',
              'focus-visible:ring-brand/50 focus-visible:ring-2 focus-visible:outline-none',
            )}
          >
            {t.accept}
          </button>
          <button
            onClick={onSettings}
            className={cn(
              'flex-1 rounded-lg border px-4 py-2 text-xs font-medium transition-colors',
              'border-fd-border text-fd-foreground',
              'hover:bg-fd-muted',
              'focus-visible:ring-fd-border/50 focus-visible:ring-2 focus-visible:outline-none',
            )}
          >
            {t.preferences}
          </button>
        </div>
      </div>
    </div>
  );
}