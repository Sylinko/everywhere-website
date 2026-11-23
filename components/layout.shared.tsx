import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from '@/components/site-image';
import { useHydrated, useMatches } from '@tanstack/react-router';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { getLocalePath } from '../lib/i18n';
import { GitHubIcon, DiscordIcon, QQIcon } from './common/icons';
import { RepoUrl } from '@/lib/constants';
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
    src="/favicon.ico"
    alt="Everywhere Logo"
    width={22}
    height={22}
  />
);

export function useLayoutOptions(locale: string): BaseLayoutProps {
  const hydrated = useHydrated();
  const { locales } = useI18n();
  const target = locales?.find((item) => item.locale !== locale);
  // Use the same translation pair as the page's SEO tags, not a guessed path.
  const href = useMatches({
    select: (matches) => matches.at(-1)?.links?.find(
      (link) => link?.rel === 'alternate' && link.hrefLang === target?.locale
    )?.href,
  });
  const fallback = target && href && (
    <a
      href={new URL(href).pathname}
      hrefLang={target.locale}
      lang={target.locale}
      rel="alternate"
      className="ms-auto inline-flex min-h-8 shrink-0 items-center whitespace-nowrap rounded-md px-2 text-sm text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground focus-visible:outline-2 focus-visible:outline-fd-ring"
    >
      {target.name}
    </a>
  );
  return {
    // Before hydration (or without JS), the same translation is a regular link.
    i18n: hydrated && Boolean(href),
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
      children: !hydrated && fallback && <div className="flex justify-end">{fallback}</div>,
    },
  };
}
