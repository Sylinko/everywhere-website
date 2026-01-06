import Link from 'next/link';
import { BookOpen, Download, BookText } from 'lucide-react';
import { GithubIcon } from '@/lib/icons';
import { Hero, FeatureSection, ModelProviderSection, SponsorsSection, BoundlessSection } from './page.client';
import { getLocalePath, i18n } from '@/lib/i18n';

const contentMap = {
  'en-US': {
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
        Everywhere is dedicated to <span className="text-brand font-medium">liberating</span> AI from browser tabs and standalone apps, 
        making it a <span className="text-brand font-medium">ubiquitous, native capability</span> of your operating system. 
        We believe true productivity gains stem from the <span className="text-brand font-medium">seamless integration</span> of AI with your current tasks.
      </>
    ),
    // Features
    features: [
      { title: 'Context-Aware', desc: 'Intelligently recognizes current screen content, understands app scenarios, and responds instantly.' },
      { title: 'Multi-Scenario Usage', desc: 'One-click reminders, web summarization, instant translation, and email polishing with rich AI features.' },
      { title: 'Seamless Integration', desc: 'Works natively with your desktop — invoke via shortcuts and interact without switching apps.' },
      { title: 'Extensible', desc: 'Built with .NET and Avalonia, supports multiple models and MCP tools.' },
    ],
    // Model Providers
    modelProviderTitle: 'Supported Model Providers',
    modelProviderDesc: 'Unified access to top-tier models like OpenAI, Claude, Gemini, and more. Switch seamlessly to find the best fit for your needs.',
    modelProviderLearnMoreDesc: 'Configure',
    // Sponsors
    sponsorsTitle: 'Sponsors',
    sponsorsDesc: 'We are proud to be supported by these forward-thinking organizations building the future of AI with us.',
    // AI Boundless Applications
    boundlessTitle: 'AI Boundless Applications',
    boundlessDesc: 'Unlock the full potential of artificial intelligence in your daily workflow. From simple automation to complex creative tasks, the possibilities are endless.',
    boundlessItems: [
      { label: 'Scenario 01', title: 'Instant In-Page Summaries', desc: 'Grasp key points, terms, and insights on any page without switching context.', imgName: 'content-summary.webp' },
      { label: 'Scenario 02', title: 'Real-Time Market Insights on Charts', desc: 'Access financial reports, news, and key indicators instantly without leaving your charts to aid trading decisions.', warn: 'This does not constitute investment advice', imgName: 'data-analysis.webp' },
      { label: 'Scenario 03', title: 'Natural Language System Commands', desc: 'Invoke your system\'s shell, see live output, and handle permission elevations. Manage services, free up ports, clear caches, and run scripts—all with natural language.', imgName: 'terminal-calling.webp' },
      { label: 'Scenario 04', title: 'Instant Error Diagnosis', desc: 'Capture context from error, identify the cause, and get suggested commands and solutions to resolve it.', imgName: 'error-analysis.webp' },
    ],
  },
  'zh-CN': {
    // Hero
    badges: ['感知', '交互', '灵活'],
    title: '随时随地，智能相伴',
    subtitle: '你的桌面助手:',
    highlight: 'Everywhere',
    getStarted: '快速开始',
    download: '下载',
    docs: '文档',
    description: (
      <>
        Everywhere 致力于将 AI 从标签页和独立应用中<span className="text-brand font-medium">解放</span>出来，
        使其成为您操作系统中无处不在的<span className="text-brand font-medium">原生能力</span>。
        我们相信，真正的生产力提升源于 AI 与您当前任务的<span className="text-brand font-medium">无缝结合</span>。
      </>
    ),
    // Features
    features: [
      { title: '屏幕内容感知', desc: '智能识别当前界面内容，自动理解应用场景，随时响应操作。' },
      { title: '多场景', desc: '一键提醒、网页摘要、即时翻译、邮件润色等丰富 AI 功能。' },
      { title: '跨平台无缝集成', desc: '跨平台原生桌面环境支持，快捷键唤起，无需切换应用即可交互。' },
      { title: '可扩展', desc: '基于 .NET 和 Avalonia，支持多种大模型和 MCP 工具。' },
    ],
    // Model Providers
    modelProviderTitle: '主流大模型支持',
    modelProviderDesc: '接入 OpenAI, Claude, Gemini 等顶级模型。无缝切换，为您找到最适合的智能引擎。',
    modelProviderLearnMoreDesc: '开始配置',
    // Sponsors
    sponsorsTitle: '赞助方',
    sponsorsDesc: '感谢这些具有远见卓识的组织对我们的支持，共同构建 AI 的未来。',
    // AI Boundless Applications
    boundlessTitle: 'AI 无界应用',
    boundlessDesc: '在日常工作流中释放人工智能的无限潜力。从简单的自动化到复杂的创造性任务，一切皆有可能。',
    boundlessItems: [
      { label: '场景 01', title: '页内提要，一目了然', desc: '无需切换上下文，在当前页面即可呈现关键点、术语和相关条目。', imgName: 'content-summary.webp' },
      { label: '场景 02', title: '盘中资讯，图上速览', desc: '无需离开图表，即时查询财报、新闻与核心指标，辅助交易决策。', warn: 'AI 生成内容不构成投资建议', imgName: 'data-analysis.webp' },
      { label: '场景 03', title: '自然语言，高效执行系统命令', desc: '调用系统 Shell，实时展示输出，处理权限提升。用自然语言管理服务、释放端口、清理缓存、运行脚本等。', imgName: 'terminal-calling.webp' },
      { label: '场景 04', title: '即时错误诊断与分析', desc: '捕获错误，定位原因，提供修复建议、备用方案和参考资料。', imgName: 'error-analysis.webp' },
    ],
  },
};

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const content = contentMap[lang as keyof typeof contentMap] || contentMap['en-US'];

  const modelProviders = [
    {
      iconUrl: 'https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/openai.svg',
      link: 'https://openai.com/',
      title: 'OpenAI',
      inversedIconColor: true
    },
    {
      iconUrl: 'https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/anthropic.svg',
      link: 'https://claude.ai/',
      title: 'Anthropic (Claude)',
      inversedIconColor: true
    },
    {
      iconUrl: 'https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/google-color.svg',
      link: 'https://gemini.google.com/',
      title: 'Google (Gemini)'
    },
    {
      iconUrl: 'https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/deepseek-color.svg',
      link: 'https://www.deepseek.com/',
      title: 'DeepSeek'
    },
    {
      iconUrl: 'https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/moonshot.svg',
      link: 'https://www.kimi.com/',
      title: 'Moonshot (Kimi)',
      inversedIconColor: true
    },
    {
      iconUrl: 'https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/siliconcloud-color.svg',
      link: 'https://www.siliconflow.cn/',
      title: 'SiliconCloud'
    },
    {
      iconUrl: 'https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/ollama.svg',
      link: 'https://ollama.com/',
      title: 'Ollama',
      inversedIconColor: true
    },
  ];

  const orgSponsors = [
    {
      title: '302.AI',
      iconPath: '/sponsors/302-ai',
      link: 'https://share.302.ai/5rzmPr',
      themeDifferentiated: true
    },
    {
      title: 'Certum',
      iconPath: '/sponsors/certum-cn',
      link: 'https://www.certum.cn',
      scale: 1.5
    }
  ];

  return (
    <main className="text-landing-foreground dark:text-landing-foreground-dark pt-4 pb-6 md:pb-12">
      <div className="relative mx-auto flex h-[70vh] max-h-[900px] min-h-[600px] w-full max-w-[1400px] overflow-hidden rounded-2xl border bg-origin-border">
        <Hero />
        <div className="z-2 flex size-full flex-col px-4 max-md:items-center max-md:text-center md:p-12">
          <div className="flex w-fit flex-row flex-wrap items-center justify-center gap-2 mt-12">
            <p className="border-brand/50 text-brand w-fit rounded-full border pl-2 pr-2 pt-1 pb-1 text-xs font-medium">
              {content.badges[0]}
            </p>
            <p className="border-brand-alter-1/50 text-brand-alter-1 w-fit rounded-full border pl-2 pr-2 pt-1 pb-1 text-xs font-medium">
              {content.badges[1]}
            </p>
            <p className="border-brand-alter-2/50 text-brand-alter-2 w-fit rounded-full border pl-2 pr-2 pt-1 pb-1 text-xs font-medium">
              {content.badges[2]}
            </p>
          </div>
          <h1 className="leading-tighter my-8 text-4xl font-medium xl:mb-12 xl:text-5xl">
            {content.title}
            <br />
            {content.subtitle}{' '}
            <span className="text-brand">{content.highlight}</span>.
          </h1>
          <div className="flex w-fit flex-row flex-wrap items-center justify-center gap-4">
            <Link
              href={getLocalePath(lang, 'docs')}
              className="bg-brand text-brand-foreground hover:bg-brand-200 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-medium tracking-tight transition-colors max-sm:text-sm"
            >
              <BookOpen className="size-4" />
              {content.getStarted}
            </Link>
            <a
              href={getLocalePath(lang, 'download')}
              className="bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 font-medium tracking-tight transition-colors max-sm:text-sm"
            >
              <Download className="size-4" />
              {content.download}
            </a>
            <a
              href={getLocalePath(lang, 'docs')}
              className="bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 font-medium tracking-tight transition-colors max-sm:text-sm"
            >
              <BookText className="size-4" />
              {content.docs}
            </a>
          </div>
        </div>
      </div>
      <div className="gap-10 mt-12 px-6 mx-auto w-full max-w-[1400px] md:px-12 lg:grid-cols-2">
        <p className="leading-snug font-light md:text-2xl">
          {content.description}
        </p>

        <FeatureSection items={content.features} />
      
        <ModelProviderSection title={content.modelProviderTitle} description={content.modelProviderDesc} learnMoreDesc={content.modelProviderLearnMoreDesc} models={modelProviders} lang={lang} />

        <SponsorsSection title={content.sponsorsTitle} description={content.sponsorsDesc} sponsors={orgSponsors} />
    
        <BoundlessSection title={content.boundlessTitle} description={content.boundlessDesc} items={content.boundlessItems} lang={lang} />
      </div>      
    </main>
  );
}

export async function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}