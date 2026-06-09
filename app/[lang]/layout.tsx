import { defineI18nUI } from 'fumadocs-ui/i18n';
import { i18n } from '@/lib/i18n';
import { Provider } from '@/components/provider';
import '../global.css';
import type { Metadata } from 'next';
import { createMetadata, baseUrl } from '@/lib/metadata';
import { notFound } from 'next/navigation';
import { softwareApplicationSchema, JsonLdScript } from '@/lib/json-ld';
import {
  EverywhereDescriptions,
  EverywhereTitles,
  OfficialUrl,
} from '@/lib/constants';

const ogTitles: Record<string, string> = {
  en: 'AI Assistant that flows with your desktop.',
  zh: '你的通用智能体，一键呼出的桌面 AI 助手',
};

const { provider } = defineI18nUI(i18n, {
  translations: {
    en: {
      displayName: 'English',
    },
    zh: {
      displayName: '简体中文',
      search: '搜索文档',
      searchNoResult: '没有结果',
      toc: '目录',
      lastUpdate: '最后更新于',
      chooseTheme: '选择主题',
      chooseLanguage: '选择语言',
      nextPage: '下一页',
      previousPage: '上一页',
      tocNoHeadings: '目录为空',
    },
  },
});

const titleMap: Record<
  string,
  { default: string; template: string; description: string }
> = {
  en: {
    default: EverywhereTitles['en'],
    template: '%s | Everywhere',
    description: EverywhereDescriptions['en'],
  },
  zh: {
    default: EverywhereTitles['zh'],
    template: '%s | Everywhere',
    description: EverywhereDescriptions['zh'],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const lang = (await params).lang;
  const titles = titleMap[lang] || titleMap[i18n.defaultLanguage];

  return createMetadata({
    metadataBase: baseUrl,
    title: {
      default: titles.default,
      template: titles.template,
    },
    description: titles.description,
    authors: [{ name: 'Sylinko', url: OfficialUrl }],
    creator: 'Sylinko',
    openGraph: {
      title: ogTitles[lang] ?? ogTitles['en'],
    },
  });
}

export async function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export default async function RootLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}) {
  const lang = (await params).lang;

  // Check if the language is valid, prevent invalid language codes (e.g. 'api') from causing errors
  if (!i18n.languages.includes(lang as (typeof i18n.languages)[number])) {
    notFound();
  }

  return (
    <Provider i18n={provider(lang)} lang={lang}>
      <JsonLdScript data={softwareApplicationSchema(lang)} />
      {children}
    </Provider>
  );
}
