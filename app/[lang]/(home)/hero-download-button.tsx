'use client';

import { Download } from 'lucide-react';
import Link from 'next/link';
import { useDetectOS, platforms } from '@/lib/os-detect';

export function HeroDownloadButton({
  label,
  lang,
}: {
  label: string;
  lang: string;
}) {
  const { os, mounted } = useDetectOS();
  const platform = os ? platforms[os] : null;
  const href = platform ? platform.primaryLink : `/${lang}/download`;

  return (
    <Link
      href={href}
      target={platform ? '_blank' : undefined}
      rel={platform ? 'noopener noreferrer' : undefined}
      className="bg-brand text-brand-foreground hover:bg-brand-200 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-medium tracking-tight transition-colors max-sm:text-sm"
    >
      {mounted && platform ? platform.smallIcon : <Download className="size-4" />}
      {label}
    </Link>
  );
}
