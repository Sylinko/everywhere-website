'use client';

import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/cn';
import type { ConsentTranslation } from './translations';
import { Cookie, X } from 'lucide-react';

interface ConsentSettingsDialogProps {
  open: boolean;
  translation: ConsentTranslation['dialog'];
  purposes: Record<string, boolean>;
  purposeMeta: Record<string, { id: string; name: string; description: string; order: number }>;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onSave: (preferences: Record<string, boolean>) => void;
  onClose: () => void;
}

export function ConsentSettingsDialog({
  open,
  translation: t,
  purposes,
  purposeMeta,
  onAcceptAll,
  onRejectAll,
  onSave,
  onClose,
}: ConsentSettingsDialogProps) {
  const [localPrefs, setLocalPrefs] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Sync local prefs from Zaraz when dialog opens
  useEffect(() => {
    if (open) {
      setLocalPrefs({ ...purposes });
      const timer = setTimeout(() => {
        setMounted(true);
        setAnimating(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setAnimating(false);
      const timer = setTimeout(() => setMounted(false), 250);
      return () => clearTimeout(timer);
    }
  }, [open, purposes]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  const togglePurpose = useCallback((purposeId: string) => {
    setLocalPrefs((prev) => ({ ...prev, [purposeId]: !prev[purposeId] }));
  }, []);

  const handleSave = useCallback(() => {
    onSave(localPrefs);
  }, [localPrefs, onSave]);

  if (!mounted) return null;

  // Sort purposes by order
  const sortedPurposes = Object.values(purposeMeta).sort(
    (a, b) => a.order - b.order,
  );

  return (
    <div
      className={cn(
        'fixed inset-0 z-10000 flex items-center justify-center',
        'transition-opacity duration-200',
        animating ? 'opacity-100' : 'opacity-0',
      )}
      role="dialog"
      aria-modal="true"
      aria-label={t.title}
    >
      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-0 bg-black/50 backdrop-blur-sm',
          'dark:bg-black/70',
        )}
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className={cn(
          'relative z-10 mx-4 w-full max-w-lg',
          'rounded-2xl border shadow-2xl',
          'bg-fd-card border-fd-border',
          'dark:bg-fd-card dark:border-fd-border/80',
          'transition-all duration-200',
          animating
            ? 'scale-100 translate-y-0 opacity-100'
            : 'scale-95 translate-y-4 opacity-0',
        )}
      >
        {/* Header */}
        <div className="border-fd-border flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <Cookie className="text-brand h-5 w-5" />
            <h2 className="text-fd-foreground text-base font-semibold">
              {t.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={cn(
              'rounded-lg p-1.5 transition-colors',
              'text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-muted',
              'focus-visible:ring-fd-border/50 focus-visible:ring-2 focus-visible:outline-none',
            )}
            aria-label={t.close}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-fd-muted-foreground mb-5 text-sm leading-relaxed">
            {t.description}
          </p>

          {/* Strictly necessary (always on) */}
          <div className="mb-3">
            <div
              className={cn(
                'flex items-center justify-between rounded-lg border p-4',
                'border-fd-border bg-fd-muted/30',
              )}
            >
              <div className="flex-1 pr-4">
                <h3 className="text-fd-foreground text-sm font-medium">
                  {t.strictlyNecessary.name}
                </h3>
                <p className="text-fd-muted-foreground mt-1 text-xs leading-relaxed">
                  {t.strictlyNecessary.description}
                </p>
              </div>
              <Toggle checked={true} disabled />
            </div>
          </div>

          {/* Dynamic purposes */}
          {sortedPurposes.map((purpose) => {
            const label =
              purpose.id === 'analytics'
                ? t.purposes.analytics?.name ?? purpose.name
                : purpose.name;
            const desc =
              purpose.id === 'analytics'
                ? t.purposes.analytics?.description ?? purpose.description
                : purpose.description;

            return (
              <div key={purpose.id} className="mb-3">
                <div
                  className={cn(
                    'flex items-center justify-between rounded-lg border p-4',
                    'border-fd-border',
                    'hover:border-fd-border/80 transition-colors',
                  )}
                >
                  <div className="flex-1 pr-4">
                    <h3 className="text-fd-foreground text-sm font-medium">
                      {label}
                    </h3>
                    <p className="text-fd-muted-foreground mt-1 text-xs leading-relaxed">
                      {desc}
                    </p>
                  </div>
                  <Toggle
                    checked={localPrefs[purpose.id] ?? false}
                    onChange={() => togglePurpose(purpose.id)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-fd-border flex flex-col gap-2 border-t px-6 py-4 sm:flex-row sm:justify-end">
          <button
            onClick={onRejectAll}
            className={cn(
              'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
              'border-fd-border text-fd-foreground',
              'hover:bg-fd-muted',
              'focus-visible:ring-fd-border/50 focus-visible:ring-2 focus-visible:outline-none',
            )}
          >
            {t.rejectAll}
          </button>
          <button
            onClick={onAcceptAll}
            className={cn(
              'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
              'border-brand/30 text-brand',
              'hover:bg-brand/10',
              'focus-visible:ring-brand/50 focus-visible:ring-2 focus-visible:outline-none',
            )}
          >
            {t.acceptAll}
          </button>
          <button
            onClick={handleSave}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              'bg-brand text-brand-foreground hover:bg-brand-secondary',
              'focus-visible:ring-brand/50 focus-visible:ring-2 focus-visible:outline-none',
            )}
          >
            {t.savePreferences}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Toggle switch ────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked ? "true" : "false"}
      aria-label="Toggle consent"
      onClick={onChange}
      disabled={disabled}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200',
        'focus-visible:ring-brand/50 focus-visible:ring-2 focus-visible:outline-none',
        disabled && 'cursor-not-allowed opacity-60',
        checked
          ? 'bg-brand'
          : 'bg-fd-muted-foreground/30',
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200',
          'translate-y-0.5',
          checked ? 'translate-x-5.5' : 'translate-x-0.5',
        )}
      />
    </button>
  );
}
