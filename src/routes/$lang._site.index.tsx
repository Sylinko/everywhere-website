import { createFileRoute } from '@tanstack/react-router';
import { Home } from '@/src/features/site/home';
import { EverywhereDescriptions, EverywhereTitles } from '@/lib/constants';
import { getSiteOgImageUrl, pageHead } from '@/lib/metadata';

export const Route = createFileRoute('/$lang/_site/')({
  head: ({ params: { lang } }) =>
    pageHead({
      lang,
      path: '',
      title: EverywhereTitles[lang],
      description: EverywhereDescriptions[lang],
      image: getSiteOgImageUrl(lang, 'home'),
    }),
  component: () => <Home lang={Route.useParams().lang} />,
});
