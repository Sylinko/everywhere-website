import { defineI18nUI } from 'fumadocs-ui/i18n';
import { i18n } from '@/lib/i18n';
import { Provider } from '@/components/provider';
import { siteName } from '@/lib/metadata';
import '../global.css';
import type { Metadata } from 'next';
import { createMetadata, baseUrl, absoluteUrl } from '@/lib/metadata';
import { notFound } from 'next/navigation';
import { softwareApplicationSchema, JsonLdScript } from '@/lib/json-ld';

const { provider } = defineI18nUI(i18n, {
  translations: {
    'en-US': {
      displayName: 'English',
    },
    'zh-CN': {
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
  'en-US': {
    default: 'Everywhere — AI Assistant that flows with your desktop.',
    template: '%s | Everywhere',
    description:
      'Everywhere is an intuitive AI assistant designed to work alongside you. It intelligently grasps your on-screen context and assists you instantly with a single shortcut, staying out of your way until called.',
  },
  'zh-CN': {
    default: 'Everywhere — 你的通用智能体，一键呼出的桌面 AI 助手',
    template: '%s | Everywhere',
    description:
      '探索 Everywhere：一款具备情境感知能力的交互式 AI 助手。呼之即来，秒懂你的屏幕，即刻提供协助。',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const lang = (await params).lang;
  const titles = titleMap[lang] || titleMap.en;

  return createMetadata({
    metadataBase: baseUrl,
    title: {
      default: titles.default,
      template: titles.template,
    },
    description: titles.description,
    keywords: [
      'AI Application',
      'AI ChatBot',
      'AI Assistant',
      'AI Integration',
      'AI Platform',
      'AI Ecosystem',
      'AI-Powered Solutions',
      'Cross-Platform AI',
      'Desktop Software',
      'Productivity Tools',
      'Automation',
      'Workflow Enhancement',
    ],
    authors: [{ name: 'Sylinko', url: 'https://sylinko.com' }],
    creator: 'Sylinko',
    canonical: absoluteUrl(`/${lang}`),
    alternates: {
      languages: {
        en: '/en-US',
        zh: '/zh-CN',
      },
    },
    openGraph: {
      type: 'website',
      locale: lang,
      title: titles.default,
      description: titles.description,
      siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: titles.default,
      description: titles.description,
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
