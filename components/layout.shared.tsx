import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import { i18n, getLocalePath } from '../lib/i18n';
import { GitHubIcon, DiscordIcon, QQIcon } from './common/icons';
import Favicon from '@/public/favicon.ico';
import { RepoUrl } from '@/lib/github';

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
    url: 'https://discord.gg/5fyg6nE3yn',
    label: 'Discord',
    text: 'Discord',
    icon: DiscordIcon,
    external: true,
  },
  {
    type: 'icon',
    url: 'https://qm.qq.com/cgi-bin/qm/qr?k=wp9aDBBnLc7pYATqT99tB-N2ZP2ETmJC&jump_from=webapi&authKey=97qUJfsQoI70dUNcgBZ0C3HCZeiEn8inLT7pzg8x+KinbQwfIrHFu3dB2+aHMbRD',
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
