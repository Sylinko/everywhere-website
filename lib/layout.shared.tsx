import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import { i18n } from './i18n';
import { GithubIcon } from './icons';
import type { LinkItemType } from 'fumadocs-ui/layouts/docs';

export const linkItems: LinkItemType[] = [
  {
    type: 'icon',
    url: 'https://github.com/DearVa/Everywhere',
    label: 'GitHub',
    text: 'GitHub',
    icon: GithubIcon,
    external: true,
  },
];

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
    },
    i18n,
  };
}
