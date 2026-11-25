import { BookOpen, BookText } from 'lucide-react';
import {
  Hero,
  KeyConceptsSection,
  ModelProviderSection,
  SponsorsSection,
  BoundlessSection,
  CTASection,
} from './home-sections';
import { DynamicLink } from 'fumadocs-core/dynamic-link';
import { HeroDownloadButton } from './hero-download-button';
import {
  AnthropicClaudeIcon,
  DeepSeekIcon,
  GoogleGeminiIcon,
  MoonshotKimiIcon,
  OpenAIIcon,
  SiliconCloudIcon,
  MiniMaxIcon,
} from '@/components/common/icons';
import { getLocalePath } from '@/lib/i18n';
import { absoluteUrl } from '@/lib/metadata';
import {
  breadcrumbSchema,
  JsonLdScript,
  softwareApplicationSchema,
  webPageSchema,
} from '@/lib/json-ld';

const contentMap = {
  en: {
    // Hero
    badges: ['On-screen Awareness', 'Interactive', 'Flexible'],
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
      'Built on on-screen awareness, delivering an uninterrupted thinking experience.',
    keyConceptsBadges: [
      {
        href: 'https://trendshift.io/repositories/15106',
        src: '/api/badges/trendshift',
        darkSrc: '/api/badges/trendshift',
        alt: 'Everywhere | Trendshift',
      },
      {
        href: 'https://www.producthunt.com/products/everywhere?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-everywhere',
        src: '/api/badges/producthuntLight',
        darkSrc: '/api/badges/producthuntDark',
        alt: 'Product Hunt',
      },
      {
        href: 'https://hellogithub.com/repository/Sylinko/Everywhere',
        src: '/api/badges/hellogithubLight',
        darkSrc: '/api/badges/hellogithubDark',
        alt: 'Featured | HelloGitHub',
      },
    ],
    keyConceptsFeatures: [
      {
        icon: 'eye' as const,
        title: 'Broad On-screen Awareness',
        desc: 'Built on native system accessibility features, Everywhere reads what is on your screen across apps—cleanly and unobtrusively.',
      },
      {
        icon: 'zap' as const,
        title: 'Instant Actions & Text Selection',
        desc: 'Skip the copy-paste routine. Press one shortcut—or select any text—to read your current context and run tailored quick actions on the spot.',
      },
      {
        icon: 'shield' as const,
        title: 'Commitment to Core Quality',
        desc: 'Built with careful engineering instead of shortcuts. Every detail is refined for better performance, stability, and security.',
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
        desc: 'Grasp key points, terms, and insights without switching pages.',
        imgName: 'content-summary.webp',
        width: 1000,
        height: 550,
      },
      {
        label: 'Scenario 02',
        title: 'Real-Time Market Insights on Charts',
        desc: 'Access financial reports, news, and key indicators instantly without leaving your charts to aid trading decisions.',
        warn: 'This does not constitute investment advice',
        imgName: 'data-analysis.webp',
        width: 1000,
        height: 550,
      },
      {
        label: 'Scenario 03',
        title: 'Natural Language System Commands',
        desc: 'Run system commands in plain language, watch live output, and approve elevated actions when needed—manage services, free ports, clear caches, and run scripts effortlessly.',
        imgName: 'terminal-calling.webp',
        width: 1000,
        height: 505,
      },
      {
        label: 'Scenario 04',
        title: 'Instant Error Diagnosis',
        desc: 'Capture error context, pinpoint the cause, and get suggested commands and fixes right away.',
        imgName: 'error-analysis.webp',
        width: 1200,
        height: 660,
      },
    ],
    cta: {
      title: 'Never Break Your Rhythm',
      desc: 'Experience frontier intelligence that moves at the speed of your thoughts. No context switching, just pure flow.',
      action: 'Get Everywhere',
    },
  },
  zh: {
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
    keyConceptsSubtitle: '基于环境感知，专为不间断的思考而生。',
    keyConceptsBadges: [
      {
        href: 'https://trendshift.io/repositories/15106',
        src: '/api/badges/trendshift',
        darkSrc: '/api/badges/trendshift',
        alt: 'Everywhere | Trendshift',
      },
      {
        href: 'https://www.producthunt.com/products/everywhere?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-everywhere',
        src: '/api/badges/producthuntLight',
        darkSrc: '/api/badges/producthuntDark',
        alt: 'Product Hunt',
      },
      {
        href: 'https://hellogithub.com/repository/Sylinko/Everywhere',
        src: '/api/badges/hellogithubLight',
        darkSrc: '/api/badges/hellogithubDark',
        alt: 'Featured | HelloGitHub',
      },
    ],
    keyConceptsFeatures: [
      {
        icon: 'eye' as const,
        title: '智能上下文感知',
        desc: '借助系统原生的无障碍能力，在不打扰你当前操作的前提下，跨应用准确读取屏幕内容。',
      },
      {
        icon: 'zap' as const,
        title: '自动划词与快捷指令',
        desc: '告别繁琐的复制粘贴。只需按下快捷键，或随手选中一段文字，即可结合当前上下文，原地调用专属 AI 快捷指令。',
      },
      {
        icon: 'shield' as const,
        title: '坚守核心质量',
        desc: '坚持严谨的工程打磨，不图快、不将就。每一个细节都经过反复优化，只为带来更流畅的体验与更可靠的安全保障。',
      },
    ],
    // Model Providers
    modelProviderTitle: '主流大模型支持',
    modelProviderDesc: '以前沿智能，重塑交互体验。',
    modelProviderLearnMoreDesc: '开始配置',
    // Sponsors
    sponsorsTitle: '赞助方',
    sponsorsDesc:
      '感谢所有认可我们理念并慷慨支持的个人与团队，一路见证 Everywhere 的成长。',
    // AI Without Boundaries
    boundlessTitle: 'AI 无界应用',
    boundlessDesc:
      '把 AI 融入你的日常工作。从轻松的小任务到复杂的创意工作，得心应手。',
    boundlessItems: [
      {
        label: '场景 01',
        title: '页内提要，一目了然',
        desc: '不用来回切换标签页，就在当前页面快速提炼要点、术语与关键信息。',
        imgName: 'content-summary.webp',
        width: 1000,
        height: 550,
      },
      {
        label: '场景 02',
        title: '盘中资讯，图上速览',
        desc: '无需离开图表，即时查询财报、新闻与核心指标，辅助交易决策。',
        warn: 'AI 生成内容不构成投资建议',
        imgName: 'data-analysis.webp',
        width: 1000,
        height: 550,
      },
      {
        label: '场景 03',
        title: '自然语言，高效执行系统命令',
        desc: '调用系统终端，实时查看运行输出并安全处理授权确认。用自然语言就能管理服务、释放端口、清理缓存或运行脚本。',
        imgName: 'terminal-calling.webp',
        width: 1002,
        height: 509,
      },
      {
        label: '场景 04',
        title: '即时错误诊断与分析',
        desc: '自动获取报错上下文，快速定位原因，并给出修复命令与解决思路。',
        imgName: 'error-analysis.webp',
        width: 1200,
        height: 660,
      },
    ],
    cta: {
      title: '让灵感，从不间断',
      desc: '让 AI 跟上你的思考节奏，不用打断手头的工作，一切一气呵成。',
      action: '立即体验 Everywhere',
    },
  },
};

export function Home({ lang }: { lang: string }) {
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
      title: 'Moonshot AI (Kimi)',
      inversedIconColor: true,
    },
    {
      icon: SiliconCloudIcon,
      link: 'https://www.siliconflow.cn/',
      title: 'SiliconFlow',
    },
    {
      icon: MiniMaxIcon,
      link: 'https://www.minimaxi.com/',
      title: 'MiniMax',
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
      <JsonLdScript data={softwareApplicationSchema(lang)} />
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
            {content.title} <br />
            {content.subtitle}{' '}
            <span className="text-brand">{content.highlight}</span>
          </h1>
          <div className="flex w-fit flex-row flex-wrap items-center justify-center gap-4">
            <HeroDownloadButton label={content.download} lang={lang} />
            <DynamicLink
              href="/[lang]/docs/installation"
              data-track-event="docs_get_started_click"
              data-track-section="hero"
              data-track-param-cta-id="hero_get_started"
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
