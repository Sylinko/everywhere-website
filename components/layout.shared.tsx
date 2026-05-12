import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import { i18n, getLocalePath } from '../lib/i18n';
import { GitHubIcon, DiscordIcon, QQIcon } from './common/icons';
import Favicon from '@/public/favicon.ico';
import { RepoUrl } from '@/lib/github';
import { DiscordUrl, QQGroupUrl } from '@/lib/constants';

export const linkItems = [
  {
    type: 'icon',
    url: RepoUrl,
    label: 'GitHub',
    text: 'GitHub',
    icon: GitHubIcon,
    external: true,
  },
  {
    type: 'icon',
    url: DiscordUrl,
    label: 'Discord',
    text: 'Discord',
    icon: DiscordIcon,
    external: true,
  },
  {
    type: 'icon',
    url: QQGroupUrl,
    label: 'QQ',
    text: 'QQ',
    icon: QQIcon,
    external: true,
  },
] as const;

export const logo = (
  <Image
    src={Favicon}
    alt="Everywhere Logo"
    width={22}
    height={22}
  />
);

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          {logo}
          <span className="font-medium in-[.uwu]:hidden in-[header]:text-[15px]">
            Everywhere
          </span>
        </>
      ),
      url: getLocalePath(locale),
    },
    i18n,
  };
}
