import Link from 'next/link';
import { Clock } from 'lucide-react';
import { buttonVariants } from '@/components/common/variants';
import { cn } from '@/lib/cn';
import { i18n } from '@/lib/i18n';
import type { Metadata } from 'next';
import { DownloadAutoDetect } from './download-auto-detect';
import { DynamicLink } from 'fumadocs-core/dynamic-link';
import { ChannelToggle } from './channel-toggle';
import { WindowsIcon, AppleIcon, GitHubIcon } from '@/components/common/icons';
import { absoluteUrl } from '@/lib/metadata';
import {
  softwareApplicationSchema,
  breadcrumbSchema,
  JsonLdScript,
} from '@/lib/json-ld';
import {
  getLanguageAlternates,
  getLocalePath,
  getOpenGraphLocale,
} from '@/lib/i18n';
import { RepoUrl } from '@/lib/github';

const contentMap = {
  en: {
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
    channel: {
      stable: 'Stable',
      canary: 'Canary',
    },
    history: {
      title: 'Release History',
      desc: 'View all past releases on GitHub.',
      action: 'View on GitHub',
    },
  },
  zh: {
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
    channel: {
      stable: '稳定通道',
      canary: 'Canary 通道',
    },
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
  const pageUrl = absoluteUrl(getLocalePath(lang, 'download'));
  return {
    title: content.title,
    description:
      lang === 'zh'
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
      locale: getOpenGraphLocale(lang),
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
          {
            name: lang === 'zh' ? '首页' : 'Home',
            url: absoluteUrl(getLocalePath(lang)),
          },
          {
            name: content.title,
            url: absoluteUrl(getLocalePath(lang, 'download')),
          },
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

        {/* Channel Toggle + All Platforms Grid */}
        <h2 className="mb-4 text-center text-2xl font-semibold">
          {content.allVersions}
        </h2>
        <ChannelToggle
          platforms={platforms}
          lang={lang}
          labels={{
            stable: content.channel.stable,
            canary: content.channel.canary,
            comingSoon: content.comingSoon,
          }}
        />

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
