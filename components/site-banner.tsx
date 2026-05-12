'use client';

import { useEffect, useRef, useState } from 'react';
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
  const [bannerHeight, setBannerHeight] = useState(height);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const dismissedId = localStorage.getItem(STORAGE_KEY);
      setOpen(dismissedId !== id);
    } catch {
      // localStorage not available
    }
  }, [id]);

  useEffect(() => {
    if (!open || !bannerRef.current) return;

    const banner = bannerRef.current;
    const updateBannerHeight = () => {
      setBannerHeight(`${banner.offsetHeight}px`);
    };

    updateBannerHeight();

    const resizeObserver = new ResizeObserver(updateBannerHeight);
    resizeObserver.observe(banner);

    return () => resizeObserver.disconnect();
  }, [open]);

  if (!mounted) return null;

  if (!open) {
    return <style>{`:root { --fd-banner-height: 0px; }`}</style>;
  }

  return (
    <>
      <style>{`:root { --fd-banner-height: ${bannerHeight}; }`}</style>
      <div
        ref={bannerRef}
        id={id}
        className={cn(
          'sticky top-0 z-40 flex flex-row items-center justify-center px-10 py-2 text-center font-medium leading-snug',
          className
        )}
        style={{ minHeight: height }}
      >
        <span className="relative z-10">{children}</span>
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
          className="absolute inset-e-2 top-1/2 z-10 -translate-y-1/2 text-white/70 transition-colors hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
    </>
  );
}
