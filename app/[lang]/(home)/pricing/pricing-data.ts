// Pricing page data - easily modifiable
// All texts support i18n with en-US and zh-CN

import type { Plan } from './types';

export type PlanFeature = {
  key: string;
  // true = checkmark, false = x mark, string = custom text/number
  starter: boolean | string;
  plus: boolean | string;
  pro: boolean | string;
};

export type FeatureCategory = {
  category: string;
  features: PlanFeature[];
};

export type PricingPlan = {
  id: Exclude<Plan, 'free'>;
  name: string;
  description: string;
  price: string; // Price before discount
  period: string;
  cta: string;
  highlighted?: boolean;
  badge?: string;
  badgeVariant?: 'brand' | 'green';
  features: string[];
};

export type SecondaryPlan = {
  id: string;
  title: string;
  content: string;
  cta: string;
  ctaLink: string;
  icon: 'gift' | 'key';
};

export type FAQItem = {
  question: string;
  answer: string;
};

// ----- Pricing Plans & i18n Content -----
type PlanData = {
  saleBadge?: {
    en: string;
    zh: string;
  };
  freeCredits: string;
  starter: {
    price: string;
    credits: string;
  };
  plus: {
    price: string;
    credits: string;
  };
  pro: {
    price: string;
    credits: string;
  };
};

export const planData: PlanData = {
  // saleBadge: {
  // },
  freeCredits: '500,000',
  starter: {
    price: '$10',
    credits: '4,000,000',
  },
  plus: {
    price: '$20',
    credits: '10,000,000',
  },
  pro: {
    price: '$40',
    credits: '24,000,000',
  },
};

// ----- i18n Content -----

export const pricingContent: Record<
  string,
  {
    // Page header
    pageTitle: string;
    pageSubtitle: string;
    // Section titles
    primaryPlansTitle: string;
    secondaryPlansTitle: string;
    comparisonTitle: string;
    comparisonSubtitle: string;
    modelSupportTitle: string;
    faqTitle: string;
    // Primary plans
    plans: PricingPlan[];
    // Secondary plans (Free & BYOK)
    secondaryPlans: SecondaryPlan[];
    // Feature comparison table
    featureCategories: FeatureCategory[];
    featureLabels: Record<string, string>;
    // FAQ
    faq: FAQItem[];
  }
> = {
  'en-US': {
    pageTitle: 'Inspiration, Everywhere.',
    pageSubtitle:
      'From web pages to documents and every spark of genius in between—there’s a plan designed to keep up with you.',
    primaryPlansTitle: 'Pick Your Perfect Fit',
    secondaryPlansTitle: 'Other Options',
    comparisonTitle: 'Feature Comparison',
    comparisonSubtitle: "See what's included in each plan",
    modelSupportTitle: 'Models & Credits',
    faqTitle: 'Frequently Asked Questions',

    plans: [
      {
        id: 'starter',
        name: 'Starter',
        description:
          'Explore Everywhere. Perfect for light use and exploring the basics.',
        price: planData.starter.price,
        period: '/month',
        cta: 'Subscribe Now',
        badge: 'Free Trial 7 Days',
        badgeVariant: 'green',
        features: [
          `${planData.starter.credits} credits per month`,
          'Basic Model Access',
          'Message Cloud Sync',
          'Community Support',
        ],
      },
      {
        id: 'plus',
        name: 'Plus',
        description:
          'Create Everywhere. Designed to cover the daily needs of knowledge workers.',
        price: planData.plus.price,
        period: '/month',
        cta: 'Subscribe Now',
        highlighted: true,
        badge: 'Recommended',
        features: [
          `${planData.plus.credits} credits per month`,
          'Popular Model Access',
          'Message Cloud Sync',
          'Priority Support',
        ],
      },
      {
        id: 'pro',
        name: 'Pro',
        description:
          'Unleash Everywhere. Built for power users with high-intensity demands.',
        price: planData.pro.price,
        period: '/month',
        cta: 'Subscribe Now',
        features: [
          `${planData.pro.credits} credits per month`,
          'All Model Access',
          'Message Cloud Sync',
          'Priority Support',
        ],
      },
    ],

    secondaryPlans: [
      {
        id: 'free',
        title: 'Free',
        content: `Sign up now and get started with a limited-time ${planData.freeCredits} free credits.`,
        cta: 'Start for Free',
        ctaLink: '/download',
        icon: 'gift',
      },
      {
        id: 'byok',
        title: 'Bring Your Own Key',
        content: 'Connect your own model service providers.',
        cta: 'View Docs',
        ctaLink: '/docs/model-provider',
        icon: 'key',
      },
    ],

    featureCategories: [
      {
        category: 'Core Features',
        features: [
          {
            key: 'credits',
            starter: '4,000,000',
            plus: '8,000,000',
            pro: '22,000,000',
          },
          { key: 'modelAccess', starter: 'Basic', plus: 'All', pro: 'All' },
        ],
      },
      {
        category: 'Security & Compliance',
        features: [
          { key: 'dataEncryption', starter: true, plus: true, pro: true },
        ],
      },
      {
        category: 'Support',
        features: [
          { key: 'communitySupport', starter: true, plus: true, pro: true },
          { key: 'prioritySupport', starter: false, plus: true, pro: true },
        ],
      },
    ],

    featureLabels: {
      credits: 'Monthly Credits',
      modelAccess: 'Model Access',
      dataEncryption: 'Data Encryption',
      communitySupport: 'Community Support',
      prioritySupport: 'Priority Support',
    },

    faq: [
      {
        question: 'What is the refund policy?',
        answer:
          'If you are within 30 days of subscribing and have not consumed any credits, you can request a full refund. If you have usage records, refunds will be evaluated on a case-by-case basis. Please refer to the refund policy at the bottom of the page for more details.',
      },
      {
        question: 'How to upgrade or downgrade my plan?',
        answer:
          "You can upgrade or downgrade your plan at any time from your account settings. When upgrading, you'll be charged the new price. Downgrades take effect in the next billing cycle.",
      },
      {
        question: 'How do I cancel my subscription?',
        answer:
          'You can cancel your subscription at any time from your customer portal. After cancellation, you will continue to enjoy the current subscription service until the end of the billing cycle, and you will not be charged thereafter.',
      },
      {
        question: 'What is BYOK (Bring Your Own Key)?',
        answer:
          'BYOK allows you to use your own API keys from providers like OpenAI, Anthropic, Google, and others. This gives you full control over your API usage and costs. Simply add your keys in the settings and start using Everywhere with your own quotas.',
      },
      {
        question: 'Where can I get help?',
        answer:
          'Community Discord for quick help from fellow users, GitHub Issues for bug reports and feature requests, and email support for paid plan subscribers. Enterprise customers get a dedicated account manager.',
      },
    ],
  },

  'zh-CN': {
    pageTitle: '让灵感，无处不在。',
    pageSubtitle:
      '无论是在网页间、文档里，还是奇思妙想的瞬间，总有一个计划契合您的脚步。',
    primaryPlansTitle: '选择您的计划',
    secondaryPlansTitle: '更多选择',
    comparisonTitle: '功能对比',
    comparisonSubtitle: '查看每个计划包含的功能',
    modelSupportTitle: '模型与积分',
    faqTitle: '常见问题',
    plans: [
      {
        id: 'starter',
        name: 'Starter',
        description: '随处探索。适合轻度使用、测试与基础体验。',
        price: planData.starter.price,
        period: '/月',
        cta: '立即订阅',
        badge: '免费试用 7 天',
        badgeVariant: 'green',
        features: [
          `每月 ${planData.starter.credits} 积分`,
          '基础模型权限',
          '消息云同步',
          '社区支持',
        ],
      },
      {
        id: 'plus',
        name: 'Plus',
        description: '随处创造。满足知识工作者的日常需求。',
        price: planData.plus.price,
        period: '/月',
        cta: '立即订阅',
        highlighted: true,
        badge: '推荐',
        features: [
          `每月 ${planData.plus.credits} 积分`,
          '主流模型权限',
          '消息云同步',
          '优先支持',
        ],
      },
      {
        id: 'pro',
        name: 'Pro',
        description: '随处施展。为高强度需求的重度用户打造。',
        price: planData.pro.price,
        period: '/月',
        cta: '立即订阅',
        features: [
          `每月 ${planData.pro.credits} 积分`,
          '所有模型权限',
          '消息云同步',
          '优先支持',
        ],
      },
    ],

    secondaryPlans: [
      {
        id: 'free',
        title: '免费体验',
        content: `即刻注册，获取限时免费 ${planData.freeCredits} 积分。`,
        cta: '立即下载',
        ctaLink: '/download',
        icon: 'gift',
      },
      {
        id: 'byok',
        title: '自带密钥',
        content: '接入您自有的模型服务提供商。',
        cta: '查看文档',
        ctaLink: '/docs/model-provider',
        icon: 'key',
      },
    ],

    featureCategories: [
      {
        category: '核心功能',
        features: [
          {
            key: 'credits',
            starter: '4,000,000',
            plus: '8,000,000',
            pro: '22,000,000',
          },
          { key: 'modelAccess', starter: '基础', plus: '全部', pro: '全部' },
        ],
      },
      {
        category: '安全与合规',
        features: [
          { key: 'dataEncryption', starter: true, plus: true, pro: true },
        ],
      },
      {
        category: '支持服务',
        features: [
          { key: 'communitySupport', starter: true, plus: true, pro: true },
          { key: 'prioritySupport', starter: false, plus: true, pro: true },
        ],
      },
    ],

    featureLabels: {
      credits: '每月积分',
      modelAccess: '模型访问',
      dataEncryption: '数据加密',
      communitySupport: '社区支持',
      prioritySupport: '优先支持',
    },

    faq: [
      {
        question: '退款政策是什么？',
        answer:
          '计费周期内，如果您未消耗任何额度，可申请全额退款，若已产生使用记录，我们将逐案分析，详情参考页面下方的退款政策。',
      },
      {
        question: '如何升级或降级我的方案？',
        answer:
          '您可以随时在账户设置中升级或降级您的方案。升级时，您需要支付新的费用。降级后，新计划将在下一个计费周期生效。',
      },
      {
        question: '如何取消订阅？',
        answer:
          '您可以随时在客户门户中取消订阅。取消后，您将继续享受当前订阅的服务直至计费周期结束，之后不会再被收费。',
      },
      {
        question: '什么是 BYOK（自带密钥）？',
        answer:
          'BYOK 允许您使用自己的 API 密钥，来自 OpenAI、Anthropic、Google 等提供商。这让您完全控制 API 使用量和成本。只需在设置中添加您的密钥，即可使用您自己的配额开始使用 Everywhere。',
      },
      {
        question: '在哪里可以获得帮助？',
        answer:
          'QQ 或 Discord 社区可获得社区帮助，GitHub Issues 用于错误报告和功能请求，Plus 和 Pro 用户可获得优先支持。',
      },
    ],
  },
};

// Helper function to get content by language
export function getPricingContent(lang: string) {
  return pricingContent[lang] || pricingContent['en-US'];
}
