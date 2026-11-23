const CACHE_TTL = 86400;

const badgeTargets = {
  trendshift: 'https://trendshift.io/api/badge/repositories/15106',
  producthuntLight:
    'https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1034853&theme=light&t=1762403775174',
  producthuntDark:
    'https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1034853&theme=dark&t=1762403775174',
  hellogithubLight:
    'https://abroad.hellogithub.com/v1/widgets/recommend.svg?rid=0bd4328c24794902bd6097055cda6f36&claim_uid=LNYEf6O9Qv5JeR2',
  hellogithubDark:
    'https://abroad.hellogithub.com/v1/widgets/recommend.svg?rid=0bd4328c24794902bd6097055cda6f36&claim_uid=LNYEf6O9Qv5JeR23&theme=dark',
} as const;

export async function getBadge(badge: string) {
  if (!Object.hasOwn(badgeTargets, badge)) {
    return Response.json({ error: 'Badge not found' }, { status: 404 });
  }

  const response = await fetch(
    badgeTargets[badge as keyof typeof badgeTargets],
    {
      headers: {
        Accept: 'image/svg+xml,image/*;q=0.8,*/*;q=0.5',
      },
      cf: {
        cacheTtlByStatus: { '200-299': CACHE_TTL },
      },
    }
  );

  if (!response.ok) {
    return Response.json(
      { error: 'Failed to fetch badge' },
      { status: response.status }
    );
  }

  return new Response(response.body, {
    headers: {
      'Cache-Control': `public, max-age=${CACHE_TTL}, stale-while-revalidate=${CACHE_TTL}`,
      'Content-Type': response.headers.get('content-type') ?? 'image/svg+xml',
    },
  });
}
