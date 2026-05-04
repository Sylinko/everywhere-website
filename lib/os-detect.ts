import { useEffect, useState } from 'react';
import { WindowsIcon, AppleIcon, SmallWindowsIcon, SmallAppleIcon } from '@/components/common/icons';
import { DownloadLinks } from './constants';

// ── Types ────────────────────────────────────────────────────────────────

export type OSId = 'windows' | 'macos';

export interface OSPlatform {
  id: OSId;
  name: string;
  icon: typeof WindowsIcon;
  smallIcon: typeof WindowsIcon;
  primaryLink: string;
}

// ── Platform registry (single source of truth) ───────────────────────────
// Add a new platform here — both the hero button and download page will pick it up.

export const platforms: Record<OSId, OSPlatform> = {
  windows: {
    id: 'windows',
    name: 'Windows',
    icon: WindowsIcon,
    smallIcon: SmallWindowsIcon,
    primaryLink: DownloadLinks.windows.installer,
  },
  macos: {
    id: 'macos',
    name: 'macOS',
    icon: AppleIcon,
    smallIcon: SmallAppleIcon,
    primaryLink: DownloadLinks.macos.silicon,
  },
};

// ── Detection rules ──────────────────────────────────────────────────────
// Each rule maps a user-agent test to an OSId. First match wins.

const detectionRules: [(ua: string) => boolean, OSId][] = [
  [(ua) => ua.indexOf('win') !== -1, 'windows'],
  [(ua) => ua.indexOf('mac') !== -1, 'macos'],
];

export function detectOS(): OSId | null {
  if (typeof window === 'undefined') return null;
  const ua = window.navigator.userAgent.toLowerCase();
  for (const [test, id] of detectionRules) {
    if (test(ua)) return id;
  }
  return null;
}

// ── React hook ───────────────────────────────────────────────────────────

export function useDetectOS(): { os: OSId | null; mounted: boolean } {
  const [os, setOs] = useState<OSId | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setOs(detectOS());
      setMounted(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  return { os, mounted };
}
