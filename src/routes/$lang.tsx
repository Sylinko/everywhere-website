import { createFileRoute, notFound, Outlet } from '@tanstack/react-router';
import { defineI18n } from 'fumadocs-core/i18n';
import { i18nProvider, uiTranslations } from 'fumadocs-ui/i18n';
import { zhCN } from '@fumadocs/language/zh-cn';
import { Provider } from '@/components/provider';
import { NotFoundContent } from '@/components/not-found';
import { i18n } from '@/lib/i18n';

const translations = defineI18n(i18n)
  .translations()
  .extend(uiTranslations())
  .preset('zh', zhCN());
export const Route = createFileRoute('/$lang')({
  beforeLoad({ params }) {
    if (!i18n.languages.includes(params.lang)) throw notFound();
  },
  component: LocaleLayout,
  notFoundComponent: () => <NotFoundContent />,
});
function LocaleLayout() {
  const { lang } = Route.useParams();
  return (
    <Provider lang={lang} i18n={i18nProvider(translations, lang)}>
      <Outlet />
    </Provider>
  );
}
