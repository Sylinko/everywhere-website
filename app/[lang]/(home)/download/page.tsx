import Link from 'next/link';
import { Clock } from 'lucide-react';
import { buttonVariants, cardVariants } from '@/components/common/variants';
import { cn } from '@/lib/cn';
import { i18n } from '@/lib/i18n';
import type { Metadata } from 'next';
import { DownloadAutoDetect } from './download-auto-detect';
import { DownloadLinks } from '@/lib/constants';
import { DynamicLink } from 'fumadocs-core/dynamic-link';
import {
  WindowsIcon,
  AppleIcon,
  GitHubIcon,
} from '@/components/common/icons';
import { absoluteUrl } from '@/lib/metadata';
import { softwareApplicationSchema, breadcrumbSchema, JsonLdScript } from '@/lib/json-ld';
import { getLanguageAlternates } from '@/lib/i18n';
import { RepoUrl } from '@/lib/github';

const contentMap = {
  'en': {
    title: 'Download',
    policies: {
      prefix: 'By downloading and using Everywhere, you agree to our ',
      terms: 'Terms of Service',
      and: ' and ',
      privacy: 'Privacy Policy',
      suffix: '.',
    },
    autoDetect: {
      downloadFor: 'Download for {os}',
      loading: 'Detecting your system...',
    },
    comingSoon: 'Coming Soon',
    allVersions: 'All Versions',
    windows: {
      title: 'Windows',
      desc: 'Requires Windows 10 (19041) or later.',
      action: 'Download',
      distros: [
        { name: 'Installer', note: '.msi', key: 'installer' },
        { name: 'Portable', note: '.zip', key: 'portable' },
      ],
    },
    macos: {
      title: 'macOS',
      desc: 'Requires macOS Monterey 12.0 or later.',
      action: 'Download',
      distros: [
        { name: 'Apple Silicon (for M Series)', note: '.pkg', key: 'silicon' },
        { name: 'Intel (x64)', note: '.pkg', key: 'intel' },
      ],
    },
    // linux: {
    //   title: 'Linux',
    //   desc: 'Community maintained distributions.',
    //   action: 'Download',
    //   distros: [
    //     { name: 'Debian / Ubuntu', note: '.deb', key: 'deb' },
    //     { name: 'Fedora / RedHat', note: '.rpm', key: 'rpm' },
    //     { name: 'Arch Linux', note: 'AUR', key: 'aur' },
    //   ],
    // },
    history: {
      title: 'Release History',
      desc: 'View all past releases on GitHub.',
      action: 'View on GitHub',
    },
  },
  'zh': {
    title: '下载',
    policies: {
      prefix: '下载并使用 Everywhere 即表示您同意我们的 ',
      terms: '服务条款',
      and: ' 和 ',
      privacy: '隐私政策',
      suffix: '。',
    },
    autoDetect: {
      downloadFor: '下载 {os} 版本',
      loading: '正在检测您的系统...',
    },
    comingSoon: '敬请期待',
    allVersions: '所有版本',
    windows: {
      title: 'Windows',
      desc: '需要 Windows 10 (19041) 或更高版本。',
      action: '下载',
      distros: [
        { name: '安装包', note: '.msi', key: 'installer' },
        { name: '便携版', note: '.zip', key: 'portable' },
      ],
    },
    macos: {
      title: 'macOS',
      desc: '需要 macOS Monterey 12.0 或更高版本。',
      action: '下载',
      distros: [
        { name: 'Apple Silicon (M 系列芯片)', note: '.pkg', key: 'silicon' },
        { name: 'Intel (x64)', note: '.pkg', key: 'intel' },
      ],
    },
    // linux: {
    //   title: 'Linux',
    //   desc: '社区维护版本。',
    //   action: '下载',
    //   distros: [
    //     { name: 'Debian / Ubuntu', note: '.deb', key: 'deb' },
    //     { name: 'Fedora / RedHat', note: '.rpm', key: 'rpm' },
    //     { name: 'Arch Linux', note: 'AUR', key: 'aur' },
    //   ],
    // },
    history: {
      title: '版本历史',
      desc: '在 GitHub 上查看所有历史版本。',
      action: '查看 GitHub Releases',
    },
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const content =
    contentMap[lang as keyof typeof contentMap] || contentMap['en'];
  const pageUrl = absoluteUrl(`/${lang}/download`);
  return {
    title: content.title,
    description: lang === 'zh'
      ? '下载 Everywhere — 获取你的通用 AI 智能体。随处感知情境，即刻提供协助。支持 Windows 和 macOS。'
      : 'Download Everywhere — Get your Universal AI Agent. Context-aware assistance, delivered instantly. Supporting Windows and macOS.',
    alternates: {
      canonical: pageUrl,
      languages: getLanguageAlternates(absoluteUrl, 'download'),
    },
    openGraph: {
      title: content.title,
      url: pageUrl,
      type: 'website',
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const content =
    contentMap[lang as keyof typeof contentMap] || contentMap['en'];

  const platforms = [
    {
      id: 'windows',
      icon: WindowsIcon,
      name: 'Windows',
      data: content.windows,
      comingSoon: false,
    },
    {
      id: 'macos',
      icon: AppleIcon,
      name: 'macOS',
      data: content.macos,
      comingSoon: false,
    },
    // {
    //   id: 'linux',
    //   icon: LinuxIcon,
    //   name: 'Linux',
    //   data: content.linux,
    //   comingSoon: true,
    // },
  ];

  return (
    <main className="min-h-[calc(100vh-4rem)] pt-24">
      <JsonLdScript data={softwareApplicationSchema(lang)} />
      <JsonLdScript
        data={breadcrumbSchema([
          { name: lang === 'zh' ? '首页' : 'Home', url: absoluteUrl(`/${lang}`) },
          { name: content.title, url: absoluteUrl(`/${lang}/download`) },
        ])}
      />
      <div className="mx-auto max-w-300">
        <div className="mb-24 flex flex-col items-center text-center">
          <h1 className="text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
            <span>{content.title}</span>
            <span className="text-brand"> Everywhere</span>
          </h1>

          <div className="text-muted-foreground mb-10 text-sm">
            {content.policies.prefix}
            <DynamicLink
              href="/[lang]/policies/terms"
              className="hover:text-foreground underline underline-offset-4"
            >
              {content.policies.terms}
            </DynamicLink>
            {content.policies.and}
            <DynamicLink
              href="/[lang]/policies/privacy"
              className="hover:text-foreground underline underline-offset-4"
            >
              {content.policies.privacy}
            </DynamicLink>
            {content.policies.suffix}
          </div>

          <div className="w-full max-w-md">
            <DownloadAutoDetect dictionary={content.autoDetect} />
          </div>
        </div>

        {/* All Platforms Grid */}
        <h2 className="text-center mb-8 font-semibold text-2xl">
          {content.allVersions}
        </h2>
        <div className="mr-50 ml-50 grid grid-cols-1 gap-6 md:grid-cols-2">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className={cn(
                cardVariants(),
                'hover:border-brand/50 relative flex flex-col overflow-hidden p-8 transition-all hover:shadow-lg'
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
                      {content.comingSoon}
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
                    const href =
                      platformLinks[distro.key as keyof typeof platformLinks] ||
                      '#';

                    return (
                      <Link
                        key={i}
                        href={href}
                        className="bg-muted/50 ring-foreground/5 hover:bg-muted flex items-center justify-between rounded-lg px-3 py-2 text-sm ring-1 transition-colors ring-inset"
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

        {/* Release History */}
        <div className="border-border/50 mt-48 flex flex-col items-center justify-center border-t py-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-muted-foreground flex items-center gap-2">
              <Clock className="size-4" />
              <span className="text-sm font-medium">
                {content.history.title}
              </span>
            </div>
            <p className="text-muted-foreground/80 text-sm">
              {content.history.desc}
            </p>
            <Link
              href={`${RepoUrl}/releases`}
              target="_blank"
              rel="noopener"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'gap-2 rounded-full px-4'
              )}
            >
              {GitHubIcon}
              {content.history.action}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}
