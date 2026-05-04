'use client';

import { Download } from 'lucide-react';
import { buttonVariants } from '@/components/common/variants';
import { cn } from '@/lib/cn';
import Link from 'next/link';
import { DownloadLinks } from '@/lib/constants';
import { useDetectOS, platforms, type OSId } from '@/lib/os-detect';

interface Variant {
  name: string;
  note: string;
  key: string;
  link: string;
}

// ── Per-OS variant definitions (extend here when adding a new platform) ──

const osVariants: Record<
  OSId,
  { primary: Variant; others: Variant[] }
> = {
  windows: {
    primary: {
      name: 'Installer',
      note: '.msi',
      key: 'installer',
      link: DownloadLinks.windows.installer,
    },
    others: [
      {
        name: 'Portable',
        note: '.zip',
        key: 'portable',
        link: DownloadLinks.windows.portable,
      },
    ],
  },
  macos: {
    primary: {
      name: 'Apple Silicon (M Series)',
      note: '.pkg',
      key: 'silicon',
      link: DownloadLinks.macos.silicon,
    },
    others: [
      {
        name: 'Intel (x64)',
        note: '.pkg',
        key: 'intel',
        link: DownloadLinks.macos.intel,
      },
    ],
  },
};

export function DownloadAutoDetect({
  dictionary,
}: {
  dictionary: {
    downloadFor: string;
    loading: string;
  };
}) {
  const { os, mounted } = useDetectOS();

  if (!mounted) {
    return (
      <div className="flex h-24 items-center justify-center">
        <span className="text-muted-foreground animate-pulse">
          {dictionary.loading}
        </span>
      </div>
    );
  }

  if (!os) return null;

  const platform = platforms[os];
  const variants = osVariants[os];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center gap-4 duration-700">
      <div className="flex flex-col items-center gap-2">
        <Link
          href={variants.primary.link}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ size: 'lg' }),
            'h-14 gap-3 rounded-full px-8 text-lg'
          )}
        >
          {platform.icon}
          {dictionary.downloadFor.replace('{os}', platform.name)}
          <Download className="size-5" />
        </Link>

        <span className="text-muted-foreground text-sm">
          {variants.primary.name}{' '}
          <span className="text-muted-foreground/60">
            ({variants.primary.note})
          </span>
        </span>
      </div>
    </div>
  );
}
