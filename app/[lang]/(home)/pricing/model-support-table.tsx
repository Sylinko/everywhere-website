'use client';

import { Fragment, useState } from 'react';
import {
  AudioLines,
  Check,
  ChevronDown,
  FileText,
  Image,
  Info,
  Minus,
  RefreshCw,
  Type,
  Video,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { headingVariants } from '@/components/common/variants';
import {
  AnthropicClaudeIcon,
  DeepSeekIcon,
  GoogleGeminiIcon,
  MiniMaxIcon,
  MoonshotKimiIcon,
  OpenAIIcon,
} from '@/components/common/icons';
import { planData } from './pricing-data';
import {
  canAccessPlan,
  type ModelPricing,
  type ModelSupportItem,
  type Modality,
} from './types';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    color: 'text-blue-700 dark:text-blue-300',
  },
  {
    id: 'plus',
    name: 'Plus',
    color: 'text-purple-700 dark:text-purple-300',
  },
  {
    id: 'pro',
    name: 'Pro',
    color: 'text-amber-700 dark:text-amber-300',
  },
] as const;

const providerIcons: Record<string, React.ReactNode> = {
  OpenAI: OpenAIIcon,
  Google: GoogleGeminiIcon,
  Anthropic: AnthropicClaudeIcon,
  DeepSeek: DeepSeekIcon,
  MoonshotAI: MoonshotKimiIcon,
  MiniMax: MiniMaxIcon,
};

const modalityIcons = {
  text: { icon: Type, en: 'Text', zh: '文本' },
  image: { icon: Image, en: 'Image', zh: '图像' },
  video: { icon: Video, en: 'Video', zh: '视频' },
  audio: { icon: AudioLines, en: 'Audio', zh: '音频' },
  pdf: { icon: FileText, en: 'PDF', zh: 'PDF' },
} satisfies Record<Modality, { icon: typeof Type; en: string; zh: string }>;

// Gateway prices × 10,000 = user-facing credits per million tokens.
function formatCredits(value: number): string {
  return `${(value / 100).toLocaleString('en-US', { maximumFractionDigits: 4 })}M`;
}

function PricingBreakdown({
  pricing,
  lang,
}: {
  pricing: ModelPricing;
  lang: string;
}) {
  const zh = lang === 'zh';
  return (
    <div className="text-fd-muted-foreground space-y-2 pl-12 text-sm tabular-nums">
      {pricing.map((tier, index) => {
        const range = [
          index > 0 && `> ${tier.threshold.toLocaleString('en-US')}`,
          pricing[index + 1] &&
            `≤ ${pricing[index + 1].threshold.toLocaleString('en-US')}`,
        ]
          .filter(Boolean)
          .join(zh ? ' 且 ' : ' and ');
        const input = formatCredits(tier.pricing.input);
        const output = formatCredits(tier.pricing.output);

        return (
          <p key={tier.threshold}>
            {zh
              ? `当输入长度 ${range} tokens 时，输入单价为 ${input} 积分，输出单价为 ${output} 积分。`
              : `When input length is ${range} tokens, the input rate is ${input} credits and the output rate is ${output} credits.`}
          </p>
        );
      })}
    </div>
  );
}

function ModelRow({
  item,
  lang,
  index,
}: {
  item: ModelSupportItem;
  lang: string;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const zh = lang === 'zh';
  const base = item.pricing[0]?.pricing;
  const hasDetails = item.pricing.length > 1 || !!item.timeBasedPricing;
  const detailsId = `model-pricing-${index}`;
  const pricingNotice =
    item.timeBasedPricing?.description[lang] ??
    item.timeBasedPricing?.description.en;

  return (
    <Fragment>
      <tr className="md:hover:bg-fd-muted/30 grid grid-cols-6 gap-y-4 border-t p-4 transition-colors md:table-row md:p-0">
        <th
          scope="row"
          className="col-span-6 min-w-0 text-left font-normal md:w-[44%] md:px-5 md:py-4"
        >
          <div className="flex items-center gap-3">
            <span
              className="bg-fd-muted text-fd-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-xl border"
              aria-hidden="true"
            >
              {providerIcons[item.company] ?? item.company[0]}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-medium">{item.model}</span>
                {!item.quotaLimited && (
                  <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-xs text-emerald-700 dark:text-emerald-300">
                    {zh ? '无窗口限制' : 'No window limit'}
                  </span>
                )}
                {item.limitedTimeOffer && (
                  <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-xs text-amber-700 dark:text-amber-300">
                    {zh ? '限时特惠' : 'Limited-time offer'}
                  </span>
                )}
              </div>
              <div className="text-fd-muted-foreground mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                <span>{item.company}</span>
                <span className="inline-flex items-center gap-1">
                  {item.inputModalities.map((modality) => {
                    const {
                      icon: Icon,
                      en,
                      zh: labelZh,
                    } = modalityIcons[modality];
                    return (
                      <span key={modality} title={zh ? labelZh : en}>
                        <Icon className="size-3.5" aria-hidden="true" />
                        <span className="sr-only">{zh ? labelZh : en}</span>
                      </span>
                    );
                  })}
                </span>
                {hasDetails && (
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={detailsId}
                    aria-label={`${item.model} · ${zh ? '价格详情' : 'Pricing details'}`}
                    onClick={() => setExpanded(!expanded)}
                    className="text-fd-foreground decoration-fd-muted-foreground/40 focus-visible:outline-fd-primary inline-flex min-h-6 items-center gap-0.5 rounded-sm underline underline-offset-4 hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    {item.timeBasedPricing
                      ? zh
                        ? '峰谷定价'
                        : 'Variable pricing'
                      : zh
                        ? '阶梯定价'
                        : 'Tiered pricing'}
                    <ChevronDown
                      className={cn(
                        'size-3 transition-transform',
                        expanded && 'rotate-180'
                      )}
                      aria-hidden="true"
                    />
                  </button>
                )}
              </div>
              {item.deprecationDate && (
                <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                  {zh ? '停用日期：' : 'Deprecation: '}
                  {item.deprecationDate}
                </p>
              )}
            </div>
          </div>
        </th>
        {plans.map((plan) => {
          const available = canAccessPlan(plan.id, item.minimumTier);
          return (
            <td
              key={plan.id}
              className="col-span-2 text-center md:w-[10%] md:px-2 md:py-4"
            >
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 text-xs md:text-sm',
                  available ? plan.color : 'text-fd-muted-foreground'
                )}
              >
                <span className="md:hidden">{plan.name}</span>
                {available ? (
                  <Check
                    className="size-4"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                ) : (
                  <Minus className="size-4 opacity-50" aria-hidden="true" />
                )}
                <span className="sr-only">
                  {available
                    ? zh
                      ? '可用'
                      : 'Included'
                    : zh
                      ? '不可用'
                      : 'Not included'}
                </span>
              </span>
            </td>
          );
        })}
        {(['input', 'output'] as const).map((direction) => (
          <td
            key={direction}
            className="bg-fd-muted/30 col-span-3 px-3 py-2 text-right tabular-nums md:w-[13%] md:bg-transparent md:px-5 md:py-4"
          >
            <span className="text-fd-muted-foreground mb-0.5 block text-left text-xs md:hidden">
              {direction === 'input'
                ? zh
                  ? '输入积分'
                  : 'Input credits'
                : zh
                  ? '输出积分'
                  : 'Output credits'}
              <span className="block">(1M tokens)</span>
            </span>
            <span className="font-medium">
              {base ? formatCredits(base[direction]) : '—'}
            </span>
            {hasDetails && (
              <span className="text-fd-muted-foreground ml-1 text-xs">
                {zh ? '起' : '+'}
              </span>
            )}
          </td>
        ))}
      </tr>
      {hasDetails && (
        <tr
          id={detailsId}
          hidden={!expanded}
          className="bg-fd-muted/30 block md:table-row"
        >
          <td colSpan={6} className="block px-4 pb-5 md:table-cell md:px-5">
            <div className="space-y-3 border-t pt-4">
              {pricingNotice && (
                <p className="text-fd-muted-foreground pl-12 text-sm">
                  {pricingNotice}
                </p>
              )}
              {item.pricing.length > 1 && (
                <PricingBreakdown pricing={item.pricing} lang={lang} />
              )}
            </div>
          </td>
        </tr>
      )}
    </Fragment>
  );
}

export function ModelSupportTable({
  title,
  models,
  lang,
}: {
  title: string;
  models: ModelSupportItem[];
  lang: string;
}) {
  const zh = lang === 'zh';
  const hasProOnlyModels = models.some((model) => model.minimumTier === 'pro');
  // Show the models an upgrade unlocks first, without rendering empty plan groups.
  const orderedModels = [...models].sort((a, b) => {
    const rank = { free: 0, starter: 0, plus: 1, pro: 2 };
    return rank[b.minimumTier] - rank[a.minimumTier];
  });

  return (
    <section
      id="models"
      aria-labelledby="models-title"
      className="mx-auto mt-20 max-w-300 scroll-mt-24 px-4"
    >
      <div className="mb-8 text-center">
        <h2
          id="models-title"
          className={cn(headingVariants({ variant: 'h2' }), 'mb-3')}
        >
          {title}
        </h2>
      </div>

      {models.length === 0 ? (
        <p
          role="status"
          className="bg-fd-card text-fd-muted-foreground rounded-2xl border p-8 text-center"
        >
          {zh
            ? '暂时无法加载模型与价格，请稍后刷新重试。'
            : 'Models and prices are temporarily unavailable. Please refresh to try again.'}
        </p>
      ) : (
        <div className="bg-fd-card overflow-hidden rounded-2xl border">
          <table className="block w-full text-sm md:table md:table-fixed">
            <caption className="sr-only">
              {zh
                ? '各计划的模型访问权限与每百万 token 积分价格'
                : 'Model access by plan and credit prices per million tokens'}
            </caption>
            <thead className="bg-fd-muted/40 text-fd-muted-foreground hidden text-sm md:table-header-group">
              <tr>
                <th
                  scope="col"
                  className="w-[44%] px-5 py-3 text-left font-medium"
                >
                  {zh ? '模型 / 输入模态' : 'Model / input types'}
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.id}
                    scope="col"
                    className={cn('w-[10%] px-2 py-3 font-medium', plan.color)}
                  >
                    {plan.name}
                  </th>
                ))}
                <th
                  scope="col"
                  className="w-[13%] px-5 py-3 text-right font-medium"
                >
                  {zh ? '输入积分' : 'Input credits'}
                  <span className="mt-1 block font-normal">(1M tokens)</span>
                </th>
                <th
                  scope="col"
                  className="w-[13%] px-5 py-3 text-right font-medium"
                >
                  {zh ? '输出积分' : 'Output credits'}
                  <span className="mt-1 block font-normal">(1M tokens)</span>
                </th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group">
              {orderedModels.map((item, index) => (
                <ModelRow
                  key={`${item.company}:${item.model}`}
                  item={item}
                  lang={lang}
                  index={index}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="text-fd-muted-foreground mt-5 space-y-3 text-sm">
        {models.length > 0 && (
          <div className="flex items-start gap-2.5">
            <Info
              className="mt-0.5 size-4 shrink-0 text-blue-500"
              aria-hidden="true"
            />
            <p>
              {!hasProOnlyModels
                ? zh
                  ? `Plus 与 Pro 可用模型相同；Pro 的月度积分和短周期额度均为 Plus 的 ${planData.pro.ratio / planData.plus.ratio} 倍。`
                  : `Plus and Pro include the same models. Pro has ${planData.pro.ratio / planData.plus.ratio}× the monthly credits and short-term quotas of Plus.`
                : zh
                  ? '更高等级计划包含低等级计划的全部模型。'
                  : 'Higher plans include every model from the plans below.'}
            </p>
          </div>
        )}
        <div className="flex items-start gap-2.5">
          <Info
            className="mt-0.5 size-4 shrink-0 text-emerald-500"
            aria-hidden="true"
          />
          <p>
            {zh
              ? '“无窗口限制”模型仅消耗积分余额，不受 5 小时或 7 天窗口限制。'
              : '“No window limit” models draw only from your credit balance, without 5-hour or 7-day limits.'}
          </p>
        </div>
        <div className="flex items-start gap-2.5">
          <RefreshCw
            className="mt-0.5 size-4 shrink-0 text-amber-500"
            aria-hidden="true"
          />
          <p>
            {zh
              ? '标注“起”的为基础单价，展开可查看长上下文价格或峰谷定价说明。模型、价格和限额适用范围可能随更新调整。'
              : 'Prices marked “+” are base rates. Expand for long-context rates or variable-pricing details. Models, prices and applicable limits may change.'}
          </p>
        </div>
      </div>
    </section>
  );
}
