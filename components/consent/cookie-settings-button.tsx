'use client';

import { cn } from '@/lib/cn';
import { useConsent } from './consent-provider';
import { Cookie } from 'lucide-react';

interface CookieSettingsButtonProps {
  className?: string;
}

export function CookieSettingsButton({ className }: CookieSettingsButtonProps) {
  const { translation, openDialog } = useConsent();

  return (
    <button
      onClick={openDialog}
      className={cn(
        'inline-flex items-center gap-1.5 text-xs transition-colors',
        'text-fd-muted-foreground hover:text-fd-foreground',
        'focus-visible:ring-fd-border/50 focus-visible:ring-2 focus-visible:outline-none',
        className,
      )}
    >
      <Cookie className="h-3.5 w-3.5" />
      {translation.dialog.title}
    </button>
  );
}
