'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

const STORAGE_KEY = 'site-banner-dismissed';

interface SiteBannerProps {
  id: string;
  height?: string;
  className?: string;
  children: React.ReactNode;
}

export function SiteBanner({
  id,
  height = '2.25rem',
  className,
  children,
}: SiteBannerProps) {
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const dismissedId = localStorage.getItem(STORAGE_KEY);
      setOpen(dismissedId !== id);
    } catch {
      // localStorage not available
    }
  }, [id]);

  if (!mounted) return null;

  if (!open) {
    return <style>{`:root { --fd-banner-height: 0px; }`}</style>;
  }

  return (
    <>
      <style>{`:root { --fd-banner-height: ${height}; }`}</style>
      <div
        id={id}
        className={cn(
          'sticky top-0 z-40 flex flex-row items-center justify-center px-4 text-center font-medium',
          className
        )}
        style={{ height }}
      >
        {children}
        <button
          type="button"
          aria-label="Close Banner"
          onClick={() => {
            setOpen(false);
            try {
              localStorage.setItem(STORAGE_KEY, id);
            } catch {
              // ignore
            }
          }}
          className="absolute inset-e-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </>
  );
}
