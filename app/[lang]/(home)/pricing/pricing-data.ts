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
  id: Plan;
  name: string;
  price: string;
  originalPrice?: string;
  period: string;
  includes: string;
  cta: string;
  ctaLink?: string;
  highlighted?: boolean;
  badge?: string;
  badgeVariant?: 'brand' | 'green';
  disabled?: boolean;
  disabledText?: string;
  features: PlanFeatureLine[];
};

// A feature line is either plain text, or text with one or more muted sub-notes
// rendered beneath it (each note becomes its own line).
export type PlanFeatureLine =
  | string
  | { text: string; note?: string | string[] };

export type FAQItem = {
  question: string;
  answer: string;
};

export type FAQGroup = {
  group: string;
  items: FAQItem[];
};

export type UsageLimitContent = {
  title: string;
  intro: string;
  headers: {
    plan: string;
    fiveHour: string;
    sevenDay: string;
    ratio: string;
  };
  estimationNote: string;
};

// Pricing Plans & i18n
type LocalizedText = {
  en: string;
  zh: string;
};

type PaidPlanData = {
  price: string;
  credits: string;
  shortCredits: string;
  freeWebSearchCount: string;
  modelAccessLabel: LocalizedText;
  usageLimitLabel: LocalizedText;
  ratio: number;
  fiveHourRequests: number;
  sevenDayRequests: number;
};

type PlanData = {
  saleBadge?: {
    en: string;
    zh: string;
  };
  freeCredits: string;
  starter: PaidPlanData;
  plus: PaidPlanData;
  pro: PaidPlanData;
};

export const planData: PlanData = {
  // saleBadge: {
  // },
  freeCredits: '300,000',
  starter: {
    price: '$10',
    credits: '5,000,000',
    shortCredits: '5M',
    freeWebSearchCount: '150',
    modelAccessLabel: {
      en: 'Basic Model Access',
      zh: '基础模型权限',
    },
    usageLimitLabel: {
      en: 'Basic usage quota',
      zh: '基础使用配额',
    },
    ratio: 1,
    fiveHourRequests: 226,
    sevenDayRequests: 565,
  },
  plus: {
    price: '$20',
    credits: '12,000,000',
    shortCredits: '12M',
    freeWebSearchCount: '400',
    modelAccessLabel: {
      en: 'All Model Access',
      zh: '所有模型权限',
    },
    usageLimitLabel: {
      en: 'Higher usage quota',
      zh: '更高使用配额',
    },
    ratio: 2.4,
    fiveHourRequests: 542,
    sevenDayRequests: 1356,
  },
  pro: {
    price: '$60',
    credits: '36,000,000',
    shortCredits: '36M',
    freeWebSearchCount: '1,500',
    modelAccessLabel: {
      en: 'All Model Access',
      zh: '所有模型权限',
    },
    usageLimitLabel: {
      en: 'Highest usage quota',
      zh: '最高使用配额',
    },
    ratio: 7.2,
    fiveHourRequests: 1627,
    sevenDayRequests: 4068,
  },
};

export const pricingContent: Record<
  string,
  {
    // Page header
    pageTitle: string;
    pageSubtitle: string;
    // Promo banner
    promoBanner: string;
    // Section titles
    primaryPlansTitle: string;
    taxNote: string;
    comparisonTitle: string;
    comparisonSubtitle: string;
    modelSupportTitle: string;
    faqTitle: string;
    webSearchExtraNote: string;
    requestEstimateNote: string;
    // Primary plans
    plans: PricingPlan[];
    // Feature comparison table
    featureCategories: FeatureCategory[];
    featureLabels: Record<string, string>;
    usageLimit: UsageLimitContent;
    // FAQ
    faq: FAQGroup[];
  }
> = {
  en: {
    pageTitle: 'Inspiration, Everywhere.',
    pageSubtitle:
      'From web pages to documents and every spark of genius in between—there’s a plan designed to keep up with you.',
    promoBanner: 'New subscribers get 20% off their first month on all plans',
    primaryPlansTitle: 'Pick Your Perfect Fit',
    taxNote:
      'Final price may vary depending on your location and will be calculated at checkout.',
    comparisonTitle: 'Feature Comparison',
    comparisonSubtitle: "See what's included in each plan",
    modelSupportTitle: 'Models & Credits',
    faqTitle: 'Frequently Asked Questions',
    webSearchExtraNote:
      'Extra web searches beyond the included limit cost 8,000 credits each.',
    requestEstimateNote:
      'Request estimates assume an average of 2,000 input tokens, 12,000 cached tokens, and 240 output tokens per request.',

    plans: [
      {
        id: 'free',
        name: 'Community',
        price: 'Free',
        period: '',
        cta: 'Download',
        ctaLink: '/download',
        includes: "What's included",
        features: [
          'All Local Features',
          'Bring Your Own Key',
          `limited-time ${planData.freeCredits} free credits`,
          'Community Support',
          '',
          '',
        ],
      },
      {
        id: 'starter',
        name: 'Starter',
        price: '$8',
        originalPrice: '$10',
        period: '/month',
        cta: 'Subscribe Now',
        includes: 'Everything in Community and',
        features: [
          {
            text: `${planData.starter.credits} credits`,
            note: [
              '≈ 4,130 DeepSeek V4 Pro requests',
              '≈ 1,410 GPT-5.4 Mini requests',
              '≈ 1,040 Kimi K2.6 requests',
            ],
          },
          `Includes ${planData.starter.freeWebSearchCount} free web searches`,
          planData.starter.usageLimitLabel.en,
          planData.starter.modelAccessLabel.en,
          'Message Cloud Sync',
          'Community Support',
        ],
      },
      {
        id: 'plus',
        name: 'Plus',
        price: '$16',
        originalPrice: '$20',
        period: '/month',
        cta: 'Subscribe Now',
        highlighted: true,
        badge: 'Recommended',
        includes: 'Everything in Community and',
        features: [
          {
            text: `${planData.plus.credits} credits`,
            note: [
              '≈ 9,920 DeepSeek V4 Pro requests',
              '≈ 3,380 GPT-5.4 Mini requests',
              '≈ 2,510 Kimi K2.6 requests',
            ],
          },
          `Includes ${planData.plus.freeWebSearchCount} free web searches`,
          planData.plus.usageLimitLabel.en,
          planData.plus.modelAccessLabel.en,
          'Message Cloud Sync',
          'Priority Support',
        ],
      },
      {
        id: 'pro',
        name: 'Pro',
        price: '$48',
        originalPrice: '$60',
        period: '/month',
        cta: 'Subscribe Now',
        includes: 'Everything in Community and',
        features: [
          {
            text: `${planData.pro.credits} credits`,
            note: [
              '≈ 29,780 DeepSeek V4 Pro requests',
              '≈ 10,160 GPT-5.4 Mini requests',
              '≈ 7,530 Kimi K2.6 requests',
            ],
          },
          `Includes ${planData.pro.freeWebSearchCount} web searches`,
          planData.pro.usageLimitLabel.en,
          planData.pro.modelAccessLabel.en,
          'Message Cloud Sync',
          'Priority Support',
        ],
      },
    ],

    featureCategories: [
      {
        category: 'Core Features',
        features: [
          {
            key: 'credits',
            starter: planData.starter.credits,
            plus: planData.plus.credits,
            pro: planData.pro.credits,
          },
          {
            key: 'modelAccess',
            starter: planData.starter.modelAccessLabel.en,
            plus: planData.plus.modelAccessLabel.en,
            pro: planData.pro.modelAccessLabel.en,
          },
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
      communitySupport: 'Community Support',
      prioritySupport: 'Priority Support',
    },

    usageLimit: {
      title: 'Usage Limits',
      intro:
        'On top of the monthly credits included in the plans, for higher-cost models, usage is balanced through 5-hour and 7-day rolling windows.',
      headers: {
        plan: 'Plan',
        fiveHour: '5-Hour Window',
        sevenDay: '7-Day Window',
        ratio: 'Relative Ratio',
      },
      estimationNote:
        'Request estimates assume an average of 2,000 input tokens, 12,000 cached tokens, and 240 output tokens per request.',
    },

    faq: [
      {
        group: 'Billing & Subscription',
        items: [
          {
            question: 'What payment methods do you accept?',
            answer:
              'We accept credit/debit cards (some UnionPay cards may not be supported), as well as Alipay, Apple Pay, Google Pay, Link, Amazon Pay, and Cash App Pay.',
          },
          {
            question: 'What is the refund policy?',
            answer:
              "If you haven't used any credits, you can request a full refund within 30 days of subscribing. If you've only used a little and it isn't working out, reach out to us—we review these case by case and try to make it right. Full details are in the refund policy linked at the bottom of the page.",
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
        ],
      },
      {
        group: 'Credits & Usage Limits',
        items: [
          {
            question: 'What is a rolling window?',
            answer:
              'In this context, a rolling window is a timed period triggered by your first request. For example, a 5-hour rolling window starts counting from your first valid request and tracks your usage for the next 5 hours. Once this period ends, the window automatically resets and waits for the next request to start a new cycle.',
          },
          {
            question:
              'Do all models count against the 5-hour and 7-day limits?',
            answer:
              'Not all of them. Some models only consume your monthly credits and do not count against the 5-hour or 7-day rolling window limits. Please refer to the model list above for details.',
          },
          {
            question: 'What happens if I reach the usage limit?',
            answer:
              'When your request volume reaches the 5-hour or 7-day limit, the affected models will pause responses and return a 429 (Too Many Requests) error. Service will resume as soon as the current window ends and resets.',
          },
        ],
      },
      {
        group: 'BYOK & Support',
        items: [
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
    ],
  },
  zh: {
    pageTitle: '让灵感，无处不在。',
    pageSubtitle:
      '无论是在网页间、文档里，还是奇思妙想的瞬间，总有一个计划契合您的脚步。',
    promoBanner: '新用户订阅任意套餐，首月立享 8 折',
    primaryPlansTitle: '选择您的计划',
    taxNote: '最终价格将在结账时根据您的地址和税法要求自动计算。',
    comparisonTitle: '功能对比',
    comparisonSubtitle: '查看每个计划包含的功能',
    modelSupportTitle: '模型与积分',
    faqTitle: '常见问题',
    webSearchExtraNote: '超出计划包含的网络搜索次数后，每次会扣 8000 积分。',
    requestEstimateNote:
      '请求数预估基于每次请求平均 2,000 个输入 token、12,000 个缓存 token 和 240 个输出 token 计算。',
    plans: [
      {
        id: 'free',
        name: 'Community',
        price: '免费',
        period: '',
        cta: '立即下载',
        ctaLink: '/download',
        includes: '包含',
        features: [
          '所有本地功能',
          '自带密钥 (BYOK)',
          `限时 ${planData.freeCredits} 免费积分`,
          '社区支持',
          '',
          '',
        ],
      },
      {
        id: 'starter',
        name: 'Starter',
        price: '$8',
        originalPrice: '$10',
        period: '/月',
        cta: '立即订阅',
        includes: '包含社区版的全部功能，以及',
        features: [
          {
            text: `${planData.starter.credits} 积分`,
            note: [
              '约 4,130 次 DeepSeek V4 Pro 请求',
              '约 1,410 次 GPT-5.4 Mini 请求',
              '约 1,040 次 Kimi K2.6 请求',
            ],
          },
          `含 ${planData.starter.freeWebSearchCount} 次网络搜索`,
          planData.starter.usageLimitLabel.zh,
          planData.starter.modelAccessLabel.zh,
          '消息云同步',
          '社区支持',
        ],
      },
      {
        id: 'plus',
        name: 'Plus',
        price: '$16',
        originalPrice: '$20',
        period: '/月',
        cta: '立即订阅',
        highlighted: true,
        badge: '推荐',
        includes: '包含社区版的全部功能，以及',
        features: [
          {
            text: `${planData.plus.credits} 积分`,
            note: [
              '约 9,920 次 DeepSeek V4 Pro 请求',
              '约 3,380 次 GPT-5.4 Mini 请求',
              '约 2,510 次 Kimi K2.6 请求',
            ],
          },
          `含 ${planData.plus.freeWebSearchCount} 次网络搜索`,
          planData.plus.usageLimitLabel.zh,
          planData.plus.modelAccessLabel.zh,
          '消息云同步',
          '优先支持',
        ],
      },
      {
        id: 'pro',
        name: 'Pro',
        price: '$48',
        originalPrice: '$60',
        period: '/月',
        cta: '立即订阅',
        includes: '包含社区版的全部功能，以及',
        features: [
          {
            text: `${planData.pro.credits} 积分`,
            note: [
              '约 29,780 次 DeepSeek V4 Pro 请求',
              '约 10,160 次 GPT-5.4 Mini 请求',
              '约 7,530 次 Kimi K2.6 请求',
            ],
          },
          `含 ${planData.pro.freeWebSearchCount} 次网络搜索`,
          planData.pro.usageLimitLabel.zh,
          planData.pro.modelAccessLabel.zh,
          '消息云同步',
          '优先支持',
        ],
      },
    ],

    featureCategories: [
      {
        category: '核心功能',
        features: [
          {
            key: 'credits',
            starter: planData.starter.credits,
            plus: planData.plus.credits,
            pro: planData.pro.credits,
          },
          {
            key: 'modelAccess',
            starter: planData.starter.modelAccessLabel.zh,
            plus: planData.plus.modelAccessLabel.zh,
            pro: planData.pro.modelAccessLabel.zh,
          },
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
      communitySupport: '社区支持',
      prioritySupport: '优先支持',
    },

    usageLimit: {
      title: '用量限制',
      intro:
        '在计划包含的每月积分基础上，对于成本较高的模型，额度会通过 5 小时和 7 天滚动窗口进行平衡。',
      headers: {
        plan: '计划',
        fiveHour: '5 小时限制',
        sevenDay: '7 天限制',
        ratio: '相对比例',
      },
      estimationNote:
        '请求数预估基于每次请求平均 2,000 个输入 token、12,000 个缓存 token 和 240 个输出 token 计算。',
    },

    faq: [
      {
        group: '账单与订阅',
        items: [
          {
            question: '支持哪些支付方式？',
            answer:
              '支持信用卡/借记卡（部分银联卡可能不支持），以及支付宝、Apple Pay、Google Pay、Link、Amazon Pay、Cash App Pay。',
          },
          {
            question: '退款政策是什么？',
            answer:
              '订阅后 30 天内，只要未消耗任何额度，即可申请全额退款。如果只使用了少量额度但觉得不合适，欢迎联系我们——我们会逐案处理，尽力为您妥善解决。完整退款政策请见页面底部。',
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
        ],
      },
      {
        group: '积分与用量限制',
        items: [
          {
            question: '什么是滚动窗口？',
            answer:
              '这里的滚动窗口是在您首次发起请求时触发的计时周期。例如：5 小时滚动窗口会从您的第一次有效请求起算，在接下来的 5 小时内统计用量；该周期结束后，窗口会自动重置并等待下次请求。',
          },
          {
            question: '所有模型都会计入 5 小时和 7 天限制吗？',
            answer:
              '并非如此。部分模型仅消耗您的每月积分，不计入 5 小时或 7 天的滚动窗口限制。具体请参阅上方的模型列表。',
          },
          {
            question: '如果触达用量限制会怎样？',
            answer:
              '当请求量达到 5 小时或 7 天限制时，受限模型将暂停响应并返回 429 (Too Many Requests) 错误，直到当前的窗口期结束并重置后，服务即可恢复。',
          },
        ],
      },
      {
        group: '自带密钥与支持',
        items: [
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
    ],
  },
};

export type UpgradeNotice = {
  title: string;
  description: string;
  buttonText: string;
};

export function getPricingContent(lang: string) {
  return pricingContent[lang] || pricingContent['en'];
}

export const upgradeNoticeContent: Record<string, UpgradeNotice> = {
  en: {
    title: "We're Adjusting Plan Benefits & Quotas",
    description: `We're upgrading our subscription plans with more monthly credits and new short-term usage quotas`,
    buttonText: 'Learn More',
  },
  zh: {
    title: '我们正在调整计划权益和额度',
    description:
      '我们近期将对订阅计划进行升级：全面提升每月积分，同时引入短周期使用配额',
    buttonText: '查看详情',
  },
};
