import Link from '@/components/site-link';
import { CircleHelp } from 'lucide-react';
import { LinuxIcon } from '@/components/common/icons';
import { cardVariants } from '@/components/common/variants';
import { Command } from '@/components/command';
import { cn } from '@/lib/cn';
import {
  DownloadLinks,
  LinuxAurInstallCommand,
  LinuxInstallCommand,
} from '@/lib/constants';

export function LinuxCard({
  lang,
  channel,
}: {
  lang: string;
  channel: 'stable' | 'canary';
}) {
  const zh = lang === 'zh';
  const packages = [
    {
      name: 'Debian / Ubuntu',
      note: '.deb',
      key: 'deb',
      href: DownloadLinks.linux.deb,
    },
    {
      name: 'Fedora',
      note: '.rpm',
      key: 'rpm',
      href: DownloadLinks.linux.rpm,
    },
    {
      name: zh ? '通用归档' : 'Generic Archive',
      note: '.tar.zst',
      key: 'tarZst',
      href: DownloadLinks.linux.tarZst,
    },
  ];

  return (
    <div
      id="linux"
      className={cn(
        cardVariants(),
        'channel-card hover:border-brand/50 relative mt-6 flex w-full min-w-0 scroll-mt-24 flex-col rounded-3xl p-8 hover:shadow-lg'
      )}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <span className="size-6">{LinuxIcon}</span>
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-fd-muted text-fd-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-medium">
            {zh ? '社区维护' : 'Community Maintained'}
          </span>
          <Link
            href={`/${lang}/docs/linux`}
            className="text-fd-muted-foreground hover:text-fd-foreground focus-visible:ring-fd-ring inline-flex items-center gap-1.5 rounded-sm text-sm underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:outline-none"
          >
            <CircleHelp className="size-3.5 shrink-0" aria-hidden="true" />
            {zh ? '兼容性要求' : 'Compatibility'}
          </Link>
        </div>
      </div>

      <h3 className="mb-2 text-xl font-semibold">Linux</h3>
      <p className="text-muted-foreground mb-5 text-sm leading-relaxed">
        {zh
          ? '推荐使用 Hyprland。X11 和 Plasma、GNOME、Niri 的 Wayland 会话仅支持部分功能；其他 Wayland 桌面暂不支持。'
          : 'We recommend Hyprland. Support is limited on X11 and on Plasma, GNOME, or Niri under Wayland. Other Wayland desktops are unsupported.'}
      </p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Command
          label="$"
          command={`${LinuxInstallCommand} -s -- --channel ${channel}`}
          lang={lang}
          aria-label={zh ? 'Linux 安装命令' : 'Linux install command'}
          className="channel-link"
        />
        <Command
          label="AUR"
          command={LinuxAurInstallCommand}
          lang={lang}
          aria-label={zh ? 'AUR 安装命令' : 'AUR install command'}
          className="channel-link"
        />
      </div>

      <div className="mt-5 space-y-2.5">
        <p className="text-fd-muted-foreground text-xs font-medium">
          {zh ? '离线安装包直链' : 'Direct Package Downloads'}
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {packages.map((pkg) => (
            <Link
              key={pkg.key}
              href={`${pkg.href}&channel=${channel}`}
              target="_blank"
              rel="noopener"
              data-track-event="docs_download_click"
              data-track-section="download"
              data-track-param-os="linux"
              data-track-param-channel={channel}
              data-track-param-variant={pkg.key}
              className="channel-link bg-fd-muted hover:bg-fd-accent focus-visible:ring-fd-ring flex items-center justify-between rounded-lg px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
            >
              <span className="text-foreground/80 font-medium">{pkg.name}</span>
              <span className="text-muted-foreground text-xs">{pkg.note}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
