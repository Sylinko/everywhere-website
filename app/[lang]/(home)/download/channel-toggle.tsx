'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { cardVariants } from '@/components/common/variants';
import { cn } from '@/lib/cn';
import { DownloadLinks } from '@/lib/constants';

interface Distro {
  name: string;
  note: string;
  key: string;
}

interface Platform {
  id: string;
  icon: ReactNode;
  name: string;
  data: {
    title: string;
    desc: string;
    distros: Distro[];
  };
  comingSoon: boolean;
}

interface ChannelToggleProps {
  platforms: Platform[];
  lang: string;
  labels: {
    stable: string;
    canary: string;
    comingSoon: string;
  };
}

export function ChannelToggle({ platforms, lang, labels }: ChannelToggleProps) {
  const [channel, setChannel] = useState<'stable' | 'canary'>('stable');
  const isCanary = channel === 'canary';

  return (
    <>
      {/* Channel color overrides via CSS custom properties */}
      <style>{`
        /* Canary channel color overrides (light mode) */
        [data-channel="canary"] .channel-card {
          border-color: hsl(30, 90%, 55%);
        }
        [data-channel="canary"] .channel-card:hover {
          border-color: hsl(30, 85%, 65%) !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
        }
        [data-channel="canary"] .channel-link {
          background-color: hsla(30, 90%, 55%, 0.08);
          --tw-ring-color: hsla(30, 90%, 55%, 0.25) !important;
        }
        [data-channel="canary"] .channel-link:hover {
          background-color: hsla(30, 90%, 55%, 0.15) !important;
        }
        /* Canary channel color overrides (dark mode) */
        .dark [data-channel="canary"] .channel-card {
          border-color: hsl(30, 80%, 60%);
        }
        .dark [data-channel="canary"] .channel-card:hover {
          border-color: hsl(30, 80%, 72%) !important;
        }
        .dark [data-channel="canary"] .channel-link {
          background-color: hsla(30, 80%, 60%, 0.1);
          --tw-ring-color: hsla(30, 80%, 60%, 0.3) !important;
        }
        .dark [data-channel="canary"] .channel-link:hover {
          background-color: hsla(30, 80%, 60%, 0.2) !important;
        }
        /* Transitions */
        .channel-indicator {
          transition: transform 180ms ease-in-out, background-color 180ms ease-in-out;
        }
        .channel-card {
          transition: border-color 180ms ease-in-out, box-shadow 180ms ease-in-out;
        }
        .channel-link {
          transition: all 180ms ease-in-out;
        }
      `}</style>

      <div className="flex flex-col items-center" data-channel={channel}>
        {/* Capsule toggle — fixed width parent, two equal buttons */}
        <div className="bg-fd-muted relative w-64 rounded-full p-1">
          {/* Sliding indicator */}
          <div
            className={cn(
              'channel-indicator absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full shadow-sm',
              isCanary ? 'bg-[hsl(30,90%,55%)]' : 'bg-brand'
            )}
            style={{
              transform: `translateX(${isCanary ? '100%' : '0'})`,
            }}
          />

          {/* Buttons */}
          <div className="relative z-10 grid grid-cols-2">
            <button
              onClick={() => setChannel('stable')}
              className={cn(
                'flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-180',
                !isCanary
                  ? 'text-brand-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {labels.stable}
            </button>
            <button
              onClick={() => setChannel('canary')}
              className={cn(
                'flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-180',
                isCanary
                  ? 'text-white'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {labels.canary}
            </button>
          </div>
        </div>

        {/* Warning slot — fixed height to prevent layout shift */}
        <div className="mt-4 mb-4 flex h-6 items-center justify-center">
          {isCanary && (
            <div className="flex items-center gap-1.5 text-sm text-orange-500">
              <AlertTriangle className="size-4" />
              <span>
                {lang === 'zh'
                  ? 'Canary 通道包含实验性功能，可能不稳定，请谨慎使用。'
                  : 'The Canary channel includes experimental features and may be unstable.'}
              </span>
            </div>
          )}
        </div>

        {/* Platform cards */}
        <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className={cn(
                cardVariants(),
                'channel-card hover:border-brand/50 relative flex flex-col overflow-hidden p-8 hover:shadow-lg'
              )}
            >
              <div className="bg-muted/50 mb-6 flex size-6 items-center justify-between">
                {platform.icon}
              </div>

              <h3 className="mb-2 text-xl font-semibold">
                {platform.data.title}
              </h3>
              <p className="text-muted-foreground mb-8 min-h-10 text-sm">
                {platform.data.desc}
              </p>

              <div className="relative mt-auto">
                {platform.comingSoon && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-md text-foreground font-medium">
                      {labels.comingSoon}
                    </span>
                  </div>
                )}
                <div
                  className={cn(
                    'space-y-3',
                    platform.comingSoon &&
                      'pointer-events-none opacity-50 blur-sm select-none'
                  )}
                >
                  {platform.data.distros.map((distro, i) => {
                    const platformLinks = DownloadLinks[
                      platform.id as keyof typeof DownloadLinks
                    ] as Record<string, string>;
                    const baseHref =
                      platformLinks[distro.key as keyof typeof platformLinks] ||
                      '#';
                    const href =
                      baseHref === '#'
                        ? '#'
                        : `${baseHref}${baseHref.includes('?') ? '&' : '?'}channel=${channel}`;

                    return (
                      <Link
                        key={i}
                        href={href}
                        className="channel-link bg-muted/50 ring-foreground/5 hover:bg-muted flex items-center justify-between rounded-lg px-3 py-2 text-sm ring-1 ring-inset"
                      >
                        <span className="text-foreground/80 font-medium">
                          {distro.name}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {distro.note}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
