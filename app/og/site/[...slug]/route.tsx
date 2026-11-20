import { notFound } from 'next/navigation';
import { i18n } from '@/lib/i18n';
import { policySource } from '@/lib/source';
import { createSiteOgResponse, type SiteOgOptions } from '@/lib/og';

export const revalidate = false;
export const dynamicParams = false;

const sitePageContent: Record<
  string,
  Record<'home' | 'download' | 'pricing', Omit<SiteOgOptions, 'lang'>>
> = {
  en: {
    home: {
      variant: 'home',
      title: 'Every moment, Every place.',
      description:
        'An on-demand AI assistant that grasps your on-screen context and assists instantly with one shortcut.',
    },
    download: {
      variant: 'download',
      title: 'Native AI that lives on your desktop.',
      description:
        'Install Everywhere on Windows or macOS. Summon instant on-screen intelligence without switching apps.',
    },
    pricing: {
      variant: 'pricing',
      title: 'Plans built for your flow.',
      description:
        'Bring your own key or subscribe to Everywhere cloud service to instantly run models in your workflow.',
    },
  },
  zh: {
    home: {
      variant: 'home',
      title: '一键呼出的通用桌面智能体',
      description:
        '具备屏幕情境感知能力的交互式 AI 助手。呼之即来，秒懂你的屏幕，即刻提供协助。',
    },
    download: {
      variant: 'download',
      title: '即刻获取你的桌面 AI 助手',
      description:
        '支持 Windows 与 macOS 原生安装。无需切换应用，随时随地一键呼出情境感知 AI 协助。',
    },
    pricing: {
      variant: 'pricing',
      title: '选择适合您的 Everywhere 计划',
      description:
        '自带密钥或订阅 Everywhere 云服务，随时在工作流中运行模型，获取即时 AI 协助。',
    },
  },
};

export async function GET(
  _req: Request,
  { params }: RouteContext<'/og/site/[...slug]'>
) {
  const { slug } = await params;
  const [lang, ...rest] = slug;
  if (!lang || !i18n.languages.includes(lang)) notFound();

  const lastSegment = rest.at(-1);
  if (!lastSegment || !lastSegment.endsWith('.png')) notFound();

  const pageName = lastSegment.slice(0, -4);
  if (
    rest.length === 1 &&
    (pageName === 'home' || pageName === 'download' || pageName === 'pricing')
  ) {
    const content =
      sitePageContent[lang]?.[pageName] ?? sitePageContent['en'][pageName];
    return createSiteOgResponse({
      lang,
      ...content,
    });
  }

  if (rest[0] === 'policies' && rest.length >= 2) {
    const policySlugs = [...rest.slice(1, -1), pageName];
    const policyPage = policySource.getPage(policySlugs, lang);
    if (!policyPage) notFound();

    return createSiteOgResponse({
      lang,
      variant: 'policy',
      title: policyPage.data.title,
      description:
        policyPage.data.description ??
        (lang === 'zh'
          ? '查看 Everywhere 的服务条款、隐私声明与相关合规政策。'
          : 'Read Everywhere legal terms, privacy commitments, and service policies.'),
    });
  }

  notFound();
}

export function generateStaticParams() {
  const staticRoutes = i18n.languages.flatMap((lang) => [
    { slug: [lang, 'home.png'] },
    { slug: [lang, 'download.png'] },
    { slug: [lang, 'pricing.png'] },
  ]);

  const policyRoutes = policySource.getPages().map((page) => {
    const lastSlug = page.slugs.at(-1) ?? 'index';
    return {
      slug: [
        page.locale ?? i18n.defaultLanguage,
        'policies',
        ...page.slugs.slice(0, -1),
        `${lastSlug}.png`,
      ],
    };
  });

  return [...staticRoutes, ...policyRoutes];
}
