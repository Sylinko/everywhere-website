import { Link as RouterLink, useRouter } from '@tanstack/react-router';
import type { ComponentProps } from 'react';

type Props = ComponentProps<'a'> & { href: string };

export default function SiteLink({ href, ...props }: Props) {
  const router = useRouter();
  if (!href.startsWith('/') || href.startsWith('//') || props.download) {
    return <a href={href} {...props} />;
  }
  const { pathname, search, hash } = new URL(
    href,
    'https://everywhere.sylinko.com'
  );
  return (
    <RouterLink
      to={pathname}
      search={router.options.parseSearch(search)}
      hash={hash.slice(1)}
      {...props}
    />
  );
}
