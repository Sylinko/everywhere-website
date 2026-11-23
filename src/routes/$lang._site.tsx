import { createFileRoute, Outlet } from '@tanstack/react-router';
import { SiteLayout } from '@/src/features/site/site-layout';

export const Route = createFileRoute('/$lang/_site')({
  component: Site,
});

function Site() {
  const { lang } = Route.useParams();
  return (
    <SiteLayout lang={lang}>
      <Outlet />
    </SiteLayout>
  );
}
