import type { Plan } from './types';

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
  string | { text: string; note?: string | string[] };

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
  fiveHourCredits: number;
  sevenDayCredits: number;
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

type PaidTier = Exclude<Plan, 'free'>;
const registrationBonusCredits = 300_000;
const extraSearchCredits = 8_000;
const paidPlans = {
  starter: {
    displayPriceUsd: 10,
    firstMonthPriceUsd: 8,
    monthlyDisplayCredits: 8_000_000,
    freeWebSearchLimit: 150,
    fiveHourCredits: 2_400_000,
    sevenDayCredits: 8_000_000,
  },
  plus: {
    displayPriceUsd: 20,
    firstMonthPriceUsd: 16,
    monthlyDisplayCredits: 16_000_000,
    freeWebSearchLimit: 400,
    fiveHourCredits: 5_600_000,
    sevenDayCredits: 16_000_000,
  },
  pro: {
    displayPriceUsd: 60,
    firstMonthPriceUsd: 48,
    monthlyDisplayCredits: 48_000_000,
    freeWebSearchLimit: 1_500,
    fiveHourCredits: 24_000_000,
    sevenDayCredits: 48_000_000,
  },
};

const formatNumber = (n: number) => n.toLocaleString('en-US');

// Estimates for the sample request described on the page, rounded down to tens.
const lunaCreditsPerRequest = 440;
const requests = (credits: number, perRequest: number) =>
  Math.floor(credits / perRequest / 10) * 10;

function figures(tier: PaidTier) {
  const p = paidPlans[tier];
  const { fiveHourCredits: five, sevenDayCredits: seven } = p;
  return {
    price: '$' + p.displayPriceUsd,
    credits: formatNumber(p.monthlyDisplayCredits),
    shortCredits: new Intl.NumberFormat('en-US', {
      notation: 'compact',
    }).format(p.monthlyDisplayCredits),
    freeWebSearchCount: formatNumber(p.freeWebSearchLimit),
    fiveHourCredits: five,
    sevenDayCredits: seven,
    fiveHourRequests: requests(five, lunaCreditsPerRequest),
    sevenDayRequests: requests(seven, lunaCreditsPerRequest),
    ratio: seven / paidPlans.starter.sevenDayCredits,
  };
}

function cardPrices(tier: PaidTier) {
  const { displayPriceUsd, firstMonthPriceUsd } = paidPlans[tier];
  return firstMonthPriceUsd === null
    ? { price: '$' + displayPriceUsd }
    : { price: '$' + firstMonthPriceUsd, originalPrice: '$' + displayPriceUsd };
}

function modelNotes(tier: PaidTier, lang: 'en' | 'zh') {
  const credits = paidPlans[tier].monthlyDisplayCredits;
  const estimates = [
    [
      'DeepSeek V4.1 Flash',
      `${formatNumber(requests(credits, 960))}–${formatNumber(requests(credits, 480))}`,
    ],
    ['GPT-6 Luna', formatNumber(requests(credits, lunaCreditsPerRequest))],
  ];
  return estimates.map(([model, range]) =>
    lang === 'en'
      ? `${model}\n≈ ${range} requests`
      : `${model}\n约 ${range} 次请求`
  );
}

export const planData: PlanData = {
  // saleBadge: {
  // },
  freeCredits: formatNumber(registrationBonusCredits),
  starter: {
    ...figures('starter'),
    modelAccessLabel: {
      en: 'Basic Model Access',
      zh: '基础模型权限',
    },
    usageLimitLabel: {
      en: 'Basic usage quota',
      zh: '基础使用配额',
    },
  },
  plus: {
    ...figures('plus'),
    modelAccessLabel: {
      en: 'All Model Access',
      zh: '所有模型权限',
    },
    usageLimitLabel: {
      en: 'Higher usage quota',
      zh: '更高使用配额',
    },
  },
  pro: {
    ...figures('pro'),
    modelAccessLabel: {
      en: 'All Model Access',
      zh: '所有模型权限',
    },
    usageLimitLabel: {
      en: 'Highest usage quota',
      zh: '最高使用配额',
    },
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
    usageLimit: UsageLimitContent;
    // FAQ
    faq: FAQGroup[];
  }
> = {
  en: {
    pageTitle: 'Plans & Pricing',
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
    webSearchExtraNote: `Extra web searches beyond the included limit cost ${formatNumber(extraSearchCredits)} credits each.`,
    requestEstimateNote:
      'Each estimate uses the full monthly allowance on one model, with 2,000 uncached input tokens, 12,000 cached input tokens and 240 output tokens per request.',

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
          `Limited-time ${planData.freeCredits} free credits`,
          'Message Cloud Sync',
          'Community Support',
          '',
        ],
      },
      {
        id: 'starter',
        name: 'Starter',
        ...cardPrices('starter'),
        period: '/month',
        cta: 'Subscribe Now',
        includes: 'Everything in Community and',
        features: [
          {
            text: `${planData.starter.credits} credits`,
            note: modelNotes('starter', 'en'),
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
        ...cardPrices('plus'),
        period: '/month',
        cta: 'Subscribe Now',
        highlighted: true,
        badge: 'Recommended',
        includes: 'Everything in Community and',
        features: [
          {
            text: `${planData.plus.credits} credits`,
            note: modelNotes('plus', 'en'),
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
        ...cardPrices('pro'),
        period: '/month',
        cta: 'Subscribe Now',
        includes: 'Everything in Community and',
        features: [
          {
            text: `${planData.pro.credits} credits`,
            note: modelNotes('pro', 'en'),
          },
          `Includes ${planData.pro.freeWebSearchCount} free web searches`,
          planData.pro.usageLimitLabel.en,
          planData.pro.modelAccessLabel.en,
          'Message Cloud Sync',
          'Priority Support',
        ],
      },
    ],

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
        'Request counts are estimated at GPT-6 Luna prices, using 2,000 uncached input tokens, 12,000 cached input tokens and 240 output tokens per request. GPT-6 Luna is used only as a pricing reference and has no window limit.',
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
    pageTitle: '定价与方案',
    pageSubtitle:
      '无论是浏览网页、处理文档，还是捕捉一闪而过的灵感，总有一款方案适合你。',
    promoBanner: '新用户订阅任意套餐，首月立享 8 折',
    primaryPlansTitle: '选择适合你的方案',
    taxNote: '最终价格将在结账时根据您的地区和税费政策自动计算。',
    comparisonTitle: '功能对比',
    comparisonSubtitle: '查看各方案包含的功能',
    modelSupportTitle: '模型与积分',
    faqTitle: '常见问题',
    webSearchExtraNote: `超出方案包含的网络搜索次数后，每次消耗 ${formatNumber(extraSearchCredits)} 积分。`,
    requestEstimateNote:
      '每项估算均按全部月度积分用于该模型计算，每次请求含 2,000 个未缓存输入 token、12,000 个缓存输入 token 和 240 个输出 token。',
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
          '全部本地功能',
          '自带密钥 (BYOK)',
          `限时 ${planData.freeCredits} 免费积分`,
          '消息云同步',
          '社区支持',
          '',
        ],
      },
      {
        id: 'starter',
        name: 'Starter',
        ...cardPrices('starter'),
        period: '/月',
        cta: '立即订阅',
        includes: '包含社区版的全部功能，以及',
        features: [
          {
            text: `${planData.starter.credits} 积分`,
            note: modelNotes('starter', 'zh'),
          },
          `含 ${planData.starter.freeWebSearchCount} 次免费网络搜索`,
          planData.starter.usageLimitLabel.zh,
          planData.starter.modelAccessLabel.zh,
          '消息云同步',
          '社区支持',
        ],
      },
      {
        id: 'plus',
        name: 'Plus',
        ...cardPrices('plus'),
        period: '/月',
        cta: '立即订阅',
        highlighted: true,
        badge: '推荐',
        includes: '包含社区版的全部功能，以及',
        features: [
          {
            text: `${planData.plus.credits} 积分`,
            note: modelNotes('plus', 'zh'),
          },
          `含 ${planData.plus.freeWebSearchCount} 次免费网络搜索`,
          planData.plus.usageLimitLabel.zh,
          planData.plus.modelAccessLabel.zh,
          '消息云同步',
          '优先支持',
        ],
      },
      {
        id: 'pro',
        name: 'Pro',
        ...cardPrices('pro'),
        period: '/月',
        cta: '立即订阅',
        includes: '包含社区版的全部功能，以及',
        features: [
          {
            text: `${planData.pro.credits} 积分`,
            note: modelNotes('pro', 'zh'),
          },
          `含 ${planData.pro.freeWebSearchCount} 次免费网络搜索`,
          planData.pro.usageLimitLabel.zh,
          planData.pro.modelAccessLabel.zh,
          '消息云同步',
          '优先支持',
        ],
      },
    ],

    usageLimit: {
      title: '用量限制',
      intro:
        '在方案包含的每月积分基础上，对于成本较高的模型，额度会通过 5 小时和 7 天滚动窗口进行动态平衡。',
      headers: {
        plan: '方案',
        fiveHour: '5 小时限制',
        sevenDay: '7 天限制',
        ratio: '相对比例',
      },
      estimationNote:
        '按 GPT-6 Luna 价格估算，每次请求含 2,000 个未缓存输入 token、12,000 个缓存输入 token 和 240 个输出 token。该模型仅用于价格折算，本身无窗口限制。',
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
              '订阅后 30 天内，只要未消耗任何额度，即可申请全额退款。如果只使用了少量额度但觉得不合适，欢迎联系我们——我们会根据具体情况为你妥善处理。完整条款请查看页面底部的退款政策。',
          },
          {
            question: '如何升级或降级我的方案？',
            answer:
              '你可以随时在账户设置中升级或降级方案。升级后会按新方案价格计费；降级则在下一个计费周期生效。',
          },
          {
            question: '如何取消订阅？',
            answer:
              '你可以随时在订阅管理页面取消订阅。取消后，当前计费周期内仍可正常使用，到期后不再续费。',
          },
        ],
      },
      {
        group: '积分与用量限制',
        items: [
          {
            question: '什么是滚动窗口？',
            answer:
              '滚动窗口会在你首次发起请求时开始计时。例如，5 小时窗口会从你的第一次有效请求起算，持续统计 5 小时内的用量；周期结束后自动重置，并在下次请求时开启新周期。',
          },
          {
            question: '所有模型都会计入 5 小时和 7 天限制吗？',
            answer:
              '不是。部分模型仅消耗每月积分余额，不计入 5 小时或 7 天的滚动窗口限制，具体请查看上方的模型列表。',
          },
          {
            question: '如果触达用量限制会怎样？',
            answer:
              '当用量达到 5 小时或 7 天上限时，对应模型会暂停响应并返回 429 错误，待当前窗口结束重置后即可恢复使用。',
          },
        ],
      },
      {
        group: '自带密钥与支持',
        items: [
          {
            question: '什么是 BYOK（自带密钥）？',
            answer:
              '通过 BYOK，你可以直接填入自己在 OpenAI、Anthropic、Google 等平台申请的 API 密钥，自主掌控用量与费用。只需在设置中添加密钥，即可用自己的额度使用 Everywhere。',
          },
          {
            question: '在哪里可以获得帮助？',
            answer:
              '遇到使用问题可以前往 QQ 群或 Discord 向社区求助，Bug 反馈和功能建议请提交至 GitHub Issues；Plus 和 Pro 订阅用户享有优先技术支持。',
          },
        ],
      },
    ],
  },
};

export function getPricingContent(lang: string) {
  return pricingContent[lang] || pricingContent['en'];
}
