import { BookOpen, BookText } from 'lucide-react';
import {
  Hero,
  KeyConceptsSection,
  ModelProviderSection,
  SponsorsSection,
  BoundlessSection,
  CTASection,
} from './page.client';
import { i18n } from '@/lib/i18n';
import { DynamicLink } from 'fumadocs-core/dynamic-link';
import { HeroDownloadButton } from './hero-download-button';
import {
  AnthropicClaudeIcon,
  DeepSeekIcon,
  GoogleGeminiIcon,
  MoonshotKimiIcon,
  OllamaIcon,
  OpenAIIcon,
  SiliconCloudIcon,
  MiniMaxIcon,
} from '@/components/common/icons';
import type { Metadata } from 'next';
import { getLanguageAlternates, getLocalePath } from '@/lib/i18n';
import { baseUrl, siteName, absoluteUrl } from '@/lib/metadata';
import { breadcrumbSchema, JsonLdScript, webPageSchema } from '@/lib/json-ld';
import { EverywhereDescriptions, EverywhereTitles } from '@/lib/constants';

const contentMap = {
  'en': {
    // Hero
    badges: ['Context-aware', 'Interactive', 'Flexible'],
    title: 'Every moment, Every place.',
    subtitle: 'Your AI:',
    highlight: 'Everywhere',
    getStarted: 'Get Started',
    download: 'Download',
    docs: 'Docs',
    description: (
      <>
        Everywhere is dedicated to{' '}
        <span className="text-brand font-medium">liberating</span> AI from
        browser tabs and standalone apps, making it a{' '}
        <span className="text-brand font-medium">
          ubiquitous, native capability
        </span>{' '}
        of your operating system. We believe true productivity gains stem from
        the <span className="text-brand font-medium">seamless integration</span>{' '}
        of AI with your current tasks.
      </>
    ),
    // Key Concepts
    keyConceptsTitle: 'Engineering Your Flow State',
    keyConceptsSubtitle:
      'Built on context awareness, delivering an uninterrupted thinking experience.',
    keyConceptsBadges: [
      {
        href: 'https://trendshift.io/repositories/15106',
        src: 'https://trendshift.io/api/badge/repositories/15106',
        darkSrc: 'https://trendshift.io/api/badge/repositories/15106',
        alt: 'Everywhere | Trendshift',
      },
      {
        href: 'https://www.producthunt.com/products/everywhere?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-everywhere',
        src: 'https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1034853&theme=light&t=1762403775174',
        darkSrc: 'https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1034853&theme=dark&t=1762403775174',
        alt: 'Product Hunt',
      },
      {
        href: 'https://hellogithub.com/repository/DearVa/Everywhere',
        src: 'https://abroad.hellogithub.com/v1/widgets/recommend.svg?rid=0bd4328c24794902bd6097055cda6f36&claim_uid=LNYEf6O9Qv5JeR2',
        darkSrc: 'https://abroad.hellogithub.com/v1/widgets/recommend.svg?rid=0bd4328c24794902bd6097055cda6f36&claim_uid=LNYEf6O9Qv5JeR23&theme=dark',
        alt: 'Featured | HelloGitHub',
      },
    ],
    keyConceptsFeatures: [
      {
        icon: 'eye' as const,
        title: 'Broad Context Awareness',
        desc: 'We integrate deep accessibility APIs and UI automation to accurately extract structured data across apps with near-zero intrusion.',
      },
      {
        icon: 'zap' as const,
        title: 'Scenario Invocation & Strategy Engine',
        desc: 'Skip the copy-paste routine. One shortcut instantly reads your context and pushes tailored AI strategies, keeping you in a flow state.',
      },
      {
        icon: 'shield' as const,
        title: 'Commitment to Core Quality',
        desc: "We prioritize rigorous system engineering over rushed development. Every line is meticulously polished for better performance and security.",
      },
    ],
    // Model Providers
    modelProviderTitle: 'Model Providers',
    modelProviderDesc:
      'Reshape your interaction with the power of cutting-edge intelligence.',
    modelProviderLearnMoreDesc: 'Configure',
    // Sponsors
    sponsorsTitle: 'Sponsors',
    sponsorsDesc:
      'A special thank you to the individuals and organizations who believe in our vision. Your trust and support mean the world to us.',
    // AI Without Boundaries
    boundlessTitle: 'AI Without Boundaries',
    boundlessDesc:
      'Unlock the full potential of artificial intelligence in your daily workflow. From simple automation to complex creative tasks, the possibilities are endless.',
    boundlessItems: [
      {
        label: 'Scenario 01',
        title: 'Instant In-Page Summaries',
        desc: 'Grasp key points, terms, and insights on any page without switching context.',
        imgName: 'content-summary.webp',
      },
      {
        label: 'Scenario 02',
        title: 'Real-Time Market Insights on Charts',
        desc: 'Access financial reports, news, and key indicators instantly without leaving your charts to aid trading decisions.',
        warn: 'This does not constitute investment advice',
        imgName: 'data-analysis.webp',
      },
      {
        label: 'Scenario 03',
        title: 'Natural Language System Commands',
        desc: "Invoke your system's shell, see live output, and handle permission elevations. Manage services, free up ports, clear caches, and run scripts—all with natural language.",
        imgName: 'terminal-calling.webp',
      },
      {
        label: 'Scenario 04',
        title: 'Instant Error Diagnosis',
        desc: 'Capture context from error, identify the cause, and get suggested commands and solutions to resolve it.',
        imgName: 'error-analysis.webp',
      },
    ],
    cta: {
      title: 'Never Break Your Rhythm',
      desc: 'Experience frontier intelligence that moves at the speed of your thoughts. No context switching, just pure flow.',
      action: 'Get Everywhere',
    },
  },
  'zh': {
    // Hero
    badges: ['感知', '交互', '灵活'],
    title: '呼之即来，智能相伴',
    subtitle: '你的桌面 AI 助手:',
    highlight: 'Everywhere',
    getStarted: '快速开始',
    download: '立即下载',
    docs: '文档',
    description: (
      <>
        Everywhere 致力于将 AI 从标签页和独立应用中
        <span className="text-brand font-medium">解放</span>出来，
        使其成为您操作系统中无处不在的
        <span className="text-brand font-medium">原生能力</span>。
        我们相信，真正的生产力提升源于 AI 与您当前任务的
        <span className="text-brand font-medium">无缝结合</span>。
      </>
    ),
    // Key Concepts
    keyConceptsTitle: '构筑你的心流状态',
    keyConceptsSubtitle:
      '基于环境感知，专为不间断的思考而生。',
    keyConceptsBadges: [
      {
        href: 'https://trendshift.io/repositories/15106',
        src: 'https://trendshift.io/api/badge/repositories/15106',
        darkSrc: 'https://trendshift.io/api/badge/repositories/15106',
        alt: 'Everywhere | Trendshift',
      },
      {
        href: 'https://www.producthunt.com/products/everywhere?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-everywhere',
        src: 'https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1034853&theme=light&t=1762403775174',
        darkSrc: 'https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1034853&theme=dark&t=1762403775174',
        alt: 'Product Hunt',
      },
      {
        href: 'https://hellogithub.com/repository/DearVa/Everywhere',
        src: 'https://abroad.hellogithub.com/v1/widgets/recommend.svg?rid=0bd4328c24794902bd6097055cda6f36&claim_uid=LNYEf6O9Qv5JeR2',
        darkSrc: 'https://abroad.hellogithub.com/v1/widgets/recommend.svg?rid=0bd4328c24794902bd6097055cda6f36&claim_uid=LNYEf6O9Qv5JeR23&theme=dark',
        alt: 'Featured | HelloGitHub',
      },
    ],
    keyConceptsFeatures: [
      {
        icon: 'eye' as const,
        title: '智能上下文感知',
        desc: '我们深度集成底层无障碍 API 与 UI 自动化技术，以近乎零的侵入性，跨应用提取结构化环境数据。',
      },
      {
        icon: 'zap' as const,
        title: '场景唤醒与策略引擎',
        desc: '告别繁琐的复制粘贴。一键快捷唤醒，瞬间感知当前上下文并推送对应 AI 执行策略，助你始终保持心流状态。',
      },
      {
        icon: 'shield' as const,
        title: '坚守核心质量',
        desc: '我们尊崇严谨的系统工程，拒绝盲目赶工。每一行代码都经过精心打磨，以实现更好的性能表现与系统安全。',
      },
    ],
    // Model Providers
    modelProviderTitle: '主流大模型支持',
    modelProviderDesc:
      '以前沿智能，重塑交互体验。',
    modelProviderLearnMoreDesc: '开始配置',
    // Sponsors
    sponsorsTitle: '赞助方',
    sponsorsDesc:
      '鸣谢所有认同本项目理念并给予慷慨支持的个人与机构，感谢你们见证我们的成长。',
    // AI Without Boundaries
    boundlessTitle: 'AI 无界应用',
    boundlessDesc:
      '在日常工作流中释放人工智能的无限潜力。从简单的自动化到复杂的创造性任务，一切皆有可能。',
    boundlessItems: [
      {
        label: '场景 01',
        title: '页内提要，一目了然',
        desc: '无需切换上下文，在当前页面即可呈现关键点、术语和相关条目。',
        imgName: 'content-summary.webp',
      },
      {
        label: '场景 02',
        title: '盘中资讯，图上速览',
        desc: '无需离开图表，即时查询财报、新闻与核心指标，辅助交易决策。',
        warn: 'AI 生成内容不构成投资建议',
        imgName: 'data-analysis.webp',
      },
      {
        label: '场景 03',
        title: '自然语言，高效执行系统命令',
        desc: '调用系统 Shell，实时展示输出，处理权限提升。用自然语言管理服务、释放端口、清理缓存、运行脚本等。',
        imgName: 'terminal-calling.webp',
      },
      {
        label: '场景 04',
        title: '即时错误诊断与分析',
        desc: '捕获错误，定位原因，提供修复建议、备用方案和参考资料。',
        imgName: 'error-analysis.webp',
      },
    ],
    cta: {
      title: '让灵感，从不间断',
      desc: '感受与思绪同频的前沿智能。无需跳出当前工作流，尽享沉浸体验。',
      action: '立即体验 Everywhere',
    },
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const titles: Record<string, { default: string; description: string }> = {
    'en': {
      default: EverywhereTitles['en'],
      description: EverywhereDescriptions['en'],
    },
    'zh': {
      default: EverywhereTitles['zh'],
      description: EverywhereDescriptions['zh'],
    },
  };
  const t = titles[lang] || titles['en'];
  const canonical = absoluteUrl(getLocalePath(lang));

  return {
    metadataBase: baseUrl,
    title: t.default,
    description: t.description,
    alternates: {
      canonical,
      languages: getLanguageAlternates(absoluteUrl),
    },
    openGraph: {
      title: t.default,
      description: t.description,
      url: canonical,
      siteName,
      type: 'website',
      locale: lang,
    },
    twitter: {
      card: 'summary_large_image',
      title: t.default,
      description: t.description,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const content =
    contentMap[lang as keyof typeof contentMap] || contentMap['en'];
  const pageUrl = absoluteUrl(getLocalePath(lang));

  const modelProviders = [
    {
      icon: OpenAIIcon,
      link: 'https://openai.com/',
      title: 'OpenAI',
      inversedIconColor: true,
    },
    {
      icon: AnthropicClaudeIcon,
      link: 'https://claude.ai/',
      title: 'Anthropic (Claude)',
      inversedIconColor: true,
    },
    {
      icon: GoogleGeminiIcon,
      link: 'https://gemini.google.com/',
      title: 'Google (Gemini)',
    },
    {
      icon: DeepSeekIcon,
      link: 'https://www.deepseek.com/',
      title: 'DeepSeek',
    },
    {
      icon: MoonshotKimiIcon,
      link: 'https://www.kimi.com/',
      title: 'Moonshot (Kimi)',
      inversedIconColor: true,
    },
    {
      icon: SiliconCloudIcon,
      link: 'https://www.siliconflow.cn/',
      title: 'SiliconCloud',
    },
    {
      icon: MiniMaxIcon,
      link: 'https://www.minimaxi.com/',
      title: 'MiniMax',
    },
    {
      icon: OllamaIcon,
      link: 'https://ollama.com/',
      title: 'Ollama',
      inversedIconColor: true,
    },
  ];

  const orgSponsors = [
    {
      title: '302.AI',
      iconPath: '/sponsors/302-ai',
      link: 'https://share.302.ai/5rzmPr',
      themeDifferentiated: true,
    },
    {
      title: 'Certum',
      iconPath: '/sponsors/certum-cn',
      link: 'https://www.certum.cn',
      scale: 1.5,
    },
  ];

  return (
    <main className="text-landing-foreground dark:text-landing-foreground-dark pt-4 pb-6 md:pb-12">
      <JsonLdScript
        data={webPageSchema({
          url: pageUrl,
          lang,
        })}
      />
      <JsonLdScript
        data={breadcrumbSchema([
          { name: lang === 'zh' ? '首页' : 'Home', url: pageUrl },
        ])}
      />
      <div className="relative mx-auto flex max-h-100 min-h-95 w-full max-w-350 overflow-hidden border bg-origin-border min-[1400px]:rounded-2xl md:h-[70vh] md:min-h-150">
        <Hero />
        <div className="z-2 flex size-full flex-col px-4 max-md:items-center max-md:text-center md:p-12">
          <div className="mt-12 flex w-fit flex-row flex-wrap items-center justify-center gap-2">
            <p className="border-brand/50 text-brand text-s w-fit rounded-full border pt-1 pr-2 pb-1 pl-2 font-medium">
              {content.badges[0]}
            </p>
            <p className="border-brand/50 text-brand text-s w-fit rounded-full border pt-1 pr-2 pb-1 pl-2 font-medium">
              {content.badges[1]}
            </p>
            <p className="border-brand/50 text-brand text-s w-fit rounded-full border pt-1 pr-2 pb-1 pl-2 font-medium">
              {content.badges[2]}
            </p>
          </div>
          <h1 className="leading-tighter my-8 text-4xl font-medium xl:mb-12 xl:text-5xl">
            {content.title}
            <br />
            {content.subtitle}{' '}
            <span className="text-brand">{content.highlight}</span>
          </h1>
          <div className="flex w-fit flex-row flex-wrap items-center justify-center gap-4">
            <HeroDownloadButton label={content.download} lang={lang} />
            <DynamicLink
              href="/[lang]/docs/quick-start"
              className="bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 font-medium tracking-tight transition-colors max-sm:text-sm"
            >
              <BookOpen className="size-4" />
              {content.getStarted}
            </DynamicLink>
            <DynamicLink
              href="/[lang]/docs"
              className="bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 font-medium tracking-tight transition-colors max-sm:text-sm"
            >
              <BookText className="size-4" />
              {content.docs}
            </DynamicLink>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 w-full max-w-350 gap-10 px-6 md:px-12 lg:grid-cols-2">
        <p className="leading-snug font-light md:text-2xl">
          {content.description}
        </p>

        <KeyConceptsSection
          title={content.keyConceptsTitle}
          subtitle={content.keyConceptsSubtitle}
          badges={content.keyConceptsBadges}
          concepts={content.keyConceptsFeatures}
        />

        <ModelProviderSection
          title={content.modelProviderTitle}
          description={content.modelProviderDesc}
          learnMoreDesc={content.modelProviderLearnMoreDesc}
          models={modelProviders}
          lang={lang}
        />

        <SponsorsSection
          title={content.sponsorsTitle}
          description={content.sponsorsDesc}
          sponsors={orgSponsors}
        />

        <BoundlessSection
          title={content.boundlessTitle}
          description={content.boundlessDesc}
          items={content.boundlessItems}
          lang={lang}
        />

        <CTASection
          title={content.cta.title}
          description={content.cta.desc}
          actionText={content.cta.action}
          lang={lang}
        />
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}
