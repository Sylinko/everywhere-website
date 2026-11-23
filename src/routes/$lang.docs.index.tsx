import { createFileRoute } from '@tanstack/react-router';
import { pageHead } from '@/lib/metadata';
import { loadDocument } from '@/src/features/docs/load';
import { contentLoaders } from '@/src/features/docs/mdx';

export const Route = createFileRoute('/$lang/docs/')({
  loader: ({ params }) => loadDocument('docs', params.lang),
  head: ({ loaderData }) =>
    loaderData ? pageHead({ ...loaderData, title: loaderData.seoTitle }) : {},
  component: Page,
});

function Page() {
  const page = Route.useLoaderData();
  return contentLoaders.docs.useContent(page.file, { page });
}
