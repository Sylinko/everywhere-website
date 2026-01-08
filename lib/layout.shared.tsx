import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import { i18n, getLocalePath } from './i18n';
import { GithubIcon } from './icons';

export const linkItems = [
  {
    type: 'icon',
    url: 'https://github.com/DearVa/Everywhere',
    label: 'GitHub',
    text: 'GitHub',
    icon: GithubIcon,
    external: true,
  },
] as const;

export const logo = (
  <Image
    src="/favicon.ico"
    alt="Everywhere"
    width={20}
    height={20}
    className="size-5"
  />
);

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          {logo}
          <span className="font-medium in-[header]:text-[15px] [.uwu_&]:hidden">
            Everywhere
          </span>
        </>
      ),
      url: getLocalePath(locale),
    },
    i18n,
  };
}
