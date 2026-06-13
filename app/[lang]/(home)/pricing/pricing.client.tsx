'use client';

import { cn } from '@/lib/cn';
import {
  buttonVariants,
  cardVariants,
  headingVariants,
} from '@/components/common/variants';
import {
  Check,
  ChevronDown,
  Sparkles,
  Type,
  Image,
  Video,
  AudioLines,
  FileText,
  TriangleAlert,
  Info,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { type ReactNode, JSX, useState } from 'react';
import {
  type PricingPlan,
  type FAQGroup,
  type UsageLimitContent,
  planData,
  upgradeNoticeContent,
} from './pricing-data';
import { UpgradeNotice } from './pricing-upgrade-notice';
import { type ModelSupportItem, type Modality } from './types';
import {
  AnthropicClaudeIcon,
  DeepSeekIcon,
  GoogleGeminiIcon,
  MiniMaxIcon,
  MoonshotKimiIcon,
  OpenAIIcon,
} from '@/components/common/icons';
import { AccountUrl } from '@/lib/constants';

export function PricingCard({
  plan,
  lang,
}: {
  plan: PricingPlan;
  lang: string;
}) {
  const isHighlighted = plan.highlighted;
  const ctaHref = plan.ctaLink
    ? `/${lang}${plan.ctaLink}`
    : `${AccountUrl}/sign-in?intent=everywhere`;

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-3xl p-5 transition-all duration-300',
        !isHighlighted && 'bg-fd-card border hover:shadow-xl',
        isHighlighted && [
          'shadow-brand/20 scale-[1.04] shadow-lg',
          'dark:shadow-brand/10',
          // Gradient Border
          'before:from-brand before:to-brand-alter-2 before:absolute before:inset-0 before:-z-20 before:rounded-3xl before:bg-linear-to-br before:content-[""]',
          // Card Background
          'after:bg-fd-card after:absolute after:inset-px after:-z-10 after:rounded-[calc(1.5rem-1px)] after:content-[""]',
        ]
      )}
    >
      {/* Badge */}
      {plan.badge && plan.badgeVariant !== 'green' && (
        <div className="bg-brand text-brand-foreground absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-sm font-medium">
          {plan.badge}
        </div>
      )}

      {/* Header */}
      <h3 className="text-fd-muted-foreground mb-2 text-lg font-semibold">
        {plan.name}
      </h3>

      {/* Price */}
      <div className="mb-4 flex items-baseline gap-1.5">
        {plan.originalPrice ? (
          <>
            <span className="text-fd-muted-foreground text-lg font-medium line-through">
              {plan.originalPrice}
            </span>
            <span className="text-3xl font-bold">{plan.price}</span>
          </>
        ) : (
          <span className="text-3xl font-bold">{plan.price}</span>
        )}
        <span className="text-fd-muted-foreground">{plan.period}</span>
      </div>

      {/* Features */}
      <p className="text-fd-muted-foreground mb-4 text-sm">{plan.includes}</p>
      <ul className="mb-6 flex-1 space-y-2.5">
        {plan.features.map((feature, idx) => (
          <li
            key={idx}
            className={cn('flex items-start gap-2.5', !feature && 'invisible')}
          >
            <Check className="text-brand mt-0.5 size-4 shrink-0" />
            <span className="text-sm">{feature || '\u00A0'}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="relative">
        {plan.badge && plan.badgeVariant === 'green' && (
          <div className="absolute -top-2.5 -right-2.5 z-10 rounded-full bg-emerald-700 px-2.5 py-0.5 text-xs font-medium text-white shadow-sm">
            {plan.badge}
          </div>
        )}
        {plan.disabled ? (
          <span
            className={cn(
              buttonVariants({
                size: 'lg',
                variant: 'secondary',
              }),
              'w-full',
              'rounded-xl',
              'pointer-events-none cursor-not-allowed opacity-50'
            )}
          >
            {plan.disabledText || plan.cta}
          </span>
        ) : (
          <Link
            href={ctaHref}
            data-track-event="docs_pricing_click"
            data-track-section="pricing"
            data-track-param-plan-id={plan.id}
            data-track-param-plan-name={plan.name}
            className={cn(
              buttonVariants({
                size: 'lg',
                variant: 'secondary',
              }),
              'w-full',
              'rounded-xl'
            )}
          >
            {plan.cta}
          </Link>
        )}
      </div>
    </div>
  );
}

export function PrimaryPlansSection({
  plans,
  taxNote,
  title,
  lang,
  webSearchExtraNote,
  promoBanner,
}: {
  plans: PricingPlan[];
  taxNote: string;
  title: string;
  lang: string;
  webSearchExtraNote: string;
  promoBanner: string;
}) {
  let text = '';
  if (planData.saleBadge) {
    if (lang === 'zh') {
      text = planData.saleBadge.zh;
    } else {
      text = planData.saleBadge.en;
    }
  }

  const notice = upgradeNoticeContent[lang] || upgradeNoticeContent['en'];

  return (
    <section className="mx-auto max-w-340 px-4">
      <div className="mb-6 text-center">
        <h2 className={cn(headingVariants({ variant: 'h2' }), 'mb-3')}>
          {title}
        </h2>
        {planData.saleBadge && (
          <div className="border-brand/20 bg-brand/5 text-brand animate-in fade-in zoom-in inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium duration-500">
            <Sparkles className="size-3.5" />
            <span>{text}</span>
          </div>
        )}
      </div>

      {/* Upgrade Notice */}
      {/* <div className="mb-10 flex items-center justify-center">
        <UpgradeNotice data={notice} lang={lang} />
      </div> */}

      {/* Promo Banner */}
      {promoBanner && (
        <div className="mb-8 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-5 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
            <Sparkles className="size-4" />
            <span>{promoBanner}</span>
          </div>
        </div>
      )}

      {/* All breakpoints: vertical stack on mobile, 4-column grid on desktop */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan, idx) => (
          <div
            key={plan.id}
            className="animate-in fade-in slide-in-from-bottom-8 fill-mode-backwards duration-700"
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            <PricingCard plan={plan} lang={lang} />
          </div>
        ))}
      </div>

      {/* Web search extra cost note */}
      <div className="mt-6 flex gap-2.5">
        <Info className="mt-0.5 size-4 shrink-0 text-amber-500" />
        <p className="text-fd-muted-foreground text-sm">{webSearchExtraNote}</p>
      </div>

      {/* Tax note */}
      <div className="mt-3 flex gap-2.5">
        <Info className="mt-0.5 size-4 shrink-0 text-blue-500" />
        <p className="text-fd-muted-foreground text-sm">{taxNote}</p>
      </div>
    </section>
  );
}

function formatCredits(value: number): string {
  if (value === 0) return '0';
  const rounded = Math.round(value * 10000) / 1000000;
  if (Number.isInteger(rounded)) {
    return rounded.toLocaleString('en-US') + 'M';
  }
  if (rounded >= 1) {
    return rounded.toLocaleString('en-US', { maximumFractionDigits: 2 }) + 'M';
  }
  return rounded.toLocaleString('en-US', { maximumFractionDigits: 4 }) + 'M';
}

const modalityIcons: Record<Modality, { icon: typeof Type; label: string }> = {
  text: { icon: Type, label: 'Text' },
  image: { icon: Image, label: 'Image' },
  video: { icon: Video, label: 'Video' },
  audio: { icon: AudioLines, label: 'Audio' },
  pdf: { icon: FileText, label: 'PDF' },
};

function ModalityBadges({ modalities }: { modalities: Modality[] }) {
  return (
    <div className="flex items-center gap-1">
      {modalities.map((m) => {
        const { icon: Icon, label } = modalityIcons[m];
        return (
          <span
            key={m}
            title={label}
            className="text-fd-muted-foreground/70 hover:text-fd-foreground transition-colors"
          >
            <Icon className="size-4" />
          </span>
        );
      })}
    </div>
  );
}

function DeprecationWarning({ date }: { date: string }) {
  if (!date) return null;
  return (
    <span
      className="ml-1.5 inline-flex cursor-help text-amber-500 transition-colors hover:text-amber-600"
      title={`Deprecated: ${date}`}
    >
      <TriangleAlert className="size-4" />
    </span>
  );
}

const tierStyles = {
  pro: {
    bg: 'bg-amber-600/5 dark:bg-amber-950/15',
    bar: 'bg-amber-600/75 text-white',
    borderColor: 'border-amber-600/75',
    line: 'bg-amber-400 dark:bg-amber-500/70',
  },
  plus: {
    bg: 'bg-purple-600/5 dark:bg-purple-950/15',
    bar: 'bg-purple-600/75 text-white',
    borderColor: 'border-purple-600/75',
    line: 'bg-purple-400 dark:bg-purple-500/70',
  },
  starter: {
    bg: 'bg-blue-600/5 dark:bg-blue-950/15',
    bar: 'bg-blue-600/75 text-white',
    borderColor: 'border-blue-600/75',
    line: 'bg-blue-400 dark:bg-blue-500/70',
  },
};

function CreditModelRow({
  item,
  providerIcon,
  noWindowLimitLabel,
  noWindowLimitHelper,
  limitedTimeOfferLabel,
  limitedTimeOfferHelper,
  modalitiesPositionOffset,
  creditsPositionOffset,
  isLast,
}: {
  item: ModelSupportItem;
  providerIcon: Record<string, JSX.Element>;
  noWindowLimitLabel: string;
  noWindowLimitHelper: string;
  limitedTimeOfferLabel: string;
  limitedTimeOfferHelper: string;
  modalitiesPositionOffset?: string;
  creditsPositionOffset?: string;
  isLast?: boolean;
}) {
  const basePricing = item.pricing[0]?.pricing;
  return (
    <div
      className={cn(
        'flex items-center gap-4 px-3 py-2.5',
        !isLast && 'border-b border-current/5'
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="bg-fd-muted text-fd-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-lg border text-xs font-bold">
          {providerIcon[item.company] || item.company[0]}
        </div>
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2 text-sm font-medium">
            <span className="truncate">{item.model}</span>
            <DeprecationWarning date={item.deprecationDate} />
            {!item.quotaLimited && (
              <span
                title={noWindowLimitHelper}
                className="shrink-0 cursor-help rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[11px] leading-none font-medium text-emerald-600 dark:text-emerald-400"
              >
                {noWindowLimitLabel}
              </span>
            )}
            {item.limitedTimeOffer && (
              <span
                title={limitedTimeOfferHelper}
                className="shrink-0 cursor-help rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 text-[11px] leading-none font-medium text-amber-600 dark:text-amber-400"
              >
                {limitedTimeOfferLabel}
              </span>
            )}
          </div>
          <div className="text-fd-muted-foreground text-xs">{item.company}</div>
        </div>
      </div>
      <div
        className={cn(
          'hidden w-24 shrink-0 lg:block',
          modalitiesPositionOffset
        )}
      >
        <ModalityBadges modalities={item.inputModalities} />
      </div>
      <div
        className={cn(
          'hidden w-32 shrink-0 text-center text-sm tabular-nums sm:block sm:w-40',
          creditsPositionOffset
        )}
      >
        {basePricing ? formatCredits(basePricing.input) : '—'}
      </div>
      <div
        className={cn(
          'hidden w-32 shrink-0 text-center text-sm tabular-nums sm:block sm:w-40',
          creditsPositionOffset
        )}
      >
        {basePricing ? formatCredits(basePricing.output) : '—'}
      </div>
    </div>
  );
}

function TierFolder({
  tier,
  models,
  borderRadius,
  modalitiesPositionOffset,
  creditsPositionOffset,
  providerIcon,
  noWindowLimitLabel,
  noWindowLimitHelper,
  limitedTimeOfferLabel,
  limitedTimeOfferHelper,
  children,
}: {
  tier: 'pro' | 'plus' | 'starter';
  models: ModelSupportItem[];
  borderRadius?: string;
  modalitiesPositionOffset?: string;
  creditsPositionOffset?: string;
  providerIcon: Record<string, JSX.Element>;
  noWindowLimitLabel: string;
  noWindowLimitHelper: string;
  limitedTimeOfferLabel: string;
  limitedTimeOfferHelper: string;
  children?: ReactNode;
}) {
  const style = tierStyles[tier];
  const label = tier.charAt(0).toUpperCase() + tier.slice(1);

  return (
    <div className="relative">
      <div
        className={cn(
          'overflow-hidden border-t-2 border-r-2 border-b-2 border-l-2',
          borderRadius,
          style.borderColor,
          style.bg
        )}
      >
        {/* Solid color bar header */}
        <div
          className={cn('px-4 py-1 text-lg font-bold tracking-wide', style.bar)}
        >
          {label}
        </div>

        <div className="px-2 py-2">
          {/* Model rows */}
          {models.map((item, idx) => (
            <CreditModelRow
              key={idx}
              item={item}
              modalitiesPositionOffset={modalitiesPositionOffset}
              creditsPositionOffset={creditsPositionOffset}
              providerIcon={providerIcon}
              noWindowLimitLabel={noWindowLimitLabel}
              noWindowLimitHelper={noWindowLimitHelper}
              limitedTimeOfferLabel={limitedTimeOfferLabel}
              limitedTimeOfferHelper={limitedTimeOfferHelper}
              isLast={idx === models.length - 1}
            />
          ))}

          {/* Nested tier folders */}
          {children && (
            <div className={cn(models.length > 0 && 'mt-2')}>{children}</div>
          )}
        </div>
      </div>
    </div>
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
  const providerIcon: Record<string, JSX.Element> = {
    OpenAI: OpenAIIcon,
    Google: GoogleGeminiIcon,
    Anthropic: AnthropicClaudeIcon,
    DeepSeek: DeepSeekIcon,
    MoonshotAI: MoonshotKimiIcon,
    MiniMax: MiniMaxIcon,
  };

  const headers =
    lang === 'zh'
      ? {
          model: '模型',
          modality: '输入模态',
          input: '输入积分',
          output: '输出积分',
          unit: '(1M Token)',
          noWindowLimitLabel: '无窗口限制',
          noWindowLimitHelper: '该模型不受 5 小时或 7 天使用窗口限制。',
          limitedTimeOfferLabel: '限时特惠',
          limitedTimeOfferHelper: '该模型当前享受限时优惠。',
        }
      : {
          model: 'Model',
          modality: 'Input Modality',
          input: 'Input Credits',
          output: 'Output Credits',
          unit: '(1M Token)',
          noWindowLimitLabel: 'No window limit',
          noWindowLimitHelper:
            'This model is not subject to 5-hour or 7-day usage window limits.',
          limitedTimeOfferLabel: 'Limited-time offer',
          limitedTimeOfferHelper:
            'This model is currently available at a special limited-time offer.',
        };

  const disclaimers =
    lang === 'zh'
      ? {
          tierAccess:
            '我们会根据您的订阅方案提供相应的模型访问权限。升级到更高级别计划，即可解锁包括低等级在内的所有模型。',
          noWindowLimit:
            '标记为“无窗口限制”的模型不受 5 小时或 7 天使用窗口限制，仅消耗每月积分。',
          priceChange:
            '由于各模型官方更新频繁，模型可用性、积分消耗和滚动限制状态可能会动态调整。',
        }
      : {
          tierAccess:
            'Your access depends on your current plan. Upgrading to a higher tier automatically unlocks all models from the lower tiers.',
          noWindowLimit:
            'Models marked “No window limit” are not subject to 5-hour or 7-day usage windows. They only consume monthly credits.',
          priceChange:
            'To keep pace with frequent official updates, model availability, credit pricing, and rolling-limit status may be adjusted dynamically.',
        };

  const proModels = models.filter((m) => m.minimumTier === 'pro');
  const plusModels = models.filter((m) => m.minimumTier === 'plus');
  const starterModels = models.filter(
    (m) => m.minimumTier === 'starter' || m.minimumTier === 'free'
  );

  return (
    <section className="mx-auto mt-20 max-w-300 px-4">
      <div className="mb-10 text-center">
        <h2 className={cn(headingVariants({ variant: 'h2' }), 'mb-3')}>
          {title}
        </h2>
      </div>

      <div className="overflow-x-auto">
        <div className="bg-fd-card relative overflow-hidden rounded-xl rounded-b-3xl">
          {/* Column headers */}
          <div className="text-fd-muted-foreground flex items-center gap-4 py-3 pr-5 pl-5">
            <div className="min-w-0 flex-1 text-xs font-medium sm:text-sm">
              {headers.model}
            </div>
            <div className="relative right-2 mx-4 hidden w-28 shrink-0 text-xs font-medium sm:text-sm lg:block">
              {headers.modality}
            </div>
            <div className="mx-5 hidden w-24 shrink-0 text-center text-xs font-medium sm:block sm:text-sm">
              {headers.input}
              <span className="text-fd-muted-foreground ml-1 block">
                {headers.unit}
              </span>
            </div>
            <div className="mx-8 hidden w-28 shrink-0 text-center text-xs font-medium sm:block sm:text-sm">
              {headers.output}
              <span className="text-fd-muted-foreground ml-1 block">
                {headers.unit}
              </span>
            </div>
          </div>

          <div className="p-2">
            <TierFolder
              tier="pro"
              models={proModels}
              providerIcon={providerIcon}
              noWindowLimitLabel={headers.noWindowLimitLabel}
              noWindowLimitHelper={headers.noWindowLimitHelper}
              limitedTimeOfferLabel={headers.limitedTimeOfferLabel}
              limitedTimeOfferHelper={headers.limitedTimeOfferHelper}
              borderRadius="rounded-2xl"
              modalitiesPositionOffset="relative right-6"
              creditsPositionOffset="relative left-[4px]"
            >
              <TierFolder
                tier="plus"
                models={plusModels}
                providerIcon={providerIcon}
                noWindowLimitLabel={headers.noWindowLimitLabel}
                noWindowLimitHelper={headers.noWindowLimitHelper}
                limitedTimeOfferLabel={headers.limitedTimeOfferLabel}
                limitedTimeOfferHelper={headers.limitedTimeOfferHelper}
                modalitiesPositionOffset="relative right-4"
                creditsPositionOffset="relative left-[12px]"
                borderRadius="rounded-xl"
              >
                <TierFolder
                  tier="starter"
                  models={starterModels}
                  providerIcon={providerIcon}
                  noWindowLimitLabel={headers.noWindowLimitLabel}
                  noWindowLimitHelper={headers.noWindowLimitHelper}
                  limitedTimeOfferLabel={headers.limitedTimeOfferLabel}
                  limitedTimeOfferHelper={headers.limitedTimeOfferHelper}
                  modalitiesPositionOffset="relative right-2"
                  creditsPositionOffset="relative left-[20px]"
                  borderRadius="rounded-lg"
                />
              </TierFolder>
            </TierFolder>
          </div>
        </div>
      </div>

      {/* Disclaimers */}
      <div className="mt-6 space-y-3 px-2">
        <div className="text-fd-muted-foreground flex items-start gap-2.5 text-sm">
          <Info className="mt-0.5 size-4 shrink-0 text-blue-500" />
          <span>{disclaimers.tierAccess}</span>
        </div>
        <div className="text-fd-muted-foreground flex items-start gap-2.5 text-sm">
          <Info className="mt-0.5 size-4 shrink-0 text-emerald-500" />
          <span>{disclaimers.noWindowLimit}</span>
        </div>
        <div className="text-fd-muted-foreground flex items-start gap-2.5 text-sm">
          <RefreshCw className="mt-0.5 size-4 shrink-0 text-amber-500" />
          <span>{disclaimers.priceChange}</span>
        </div>
      </div>
    </section>
  );
}

function RatioBar({ value, max }: { value: number; max: number }) {
  return (
    <div className="bg-fd-muted mt-2 h-2 w-full overflow-hidden rounded-full">
      <div
        className="bg-brand h-full rounded-full"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );
}

export function UsageLimitSection({
  content,
  lang,
}: {
  content: UsageLimitContent;
  lang: string;
}) {
  const rows = [
    {
      id: 'starter',
      name: 'Starter',
      fiveHourRequests: planData.starter.fiveHourRequests,
      sevenDayRequests: planData.starter.sevenDayRequests,
      ratio: planData.starter.ratio,
    },
    {
      id: 'plus',
      name: 'Plus',
      fiveHourRequests: planData.plus.fiveHourRequests,
      sevenDayRequests: planData.plus.sevenDayRequests,
      ratio: planData.plus.ratio,
    },
    {
      id: 'pro',
      name: 'Pro',
      fiveHourRequests: planData.pro.fiveHourRequests,
      sevenDayRequests: planData.pro.sevenDayRequests,
      ratio: planData.pro.ratio,
    },
  ];
  const maxCapacity = Math.max(...rows.flatMap((row) => [row.ratio]));

  const approxLabel = lang === 'zh' ? '约' : '~';
  const requestsLabel = lang === 'zh' ? '次请求' : ' requests';

  return (
    <section className="mx-auto mt-20 max-w-260 px-4">
      <div className="mb-8 text-center">
        <h2 className={cn(headingVariants({ variant: 'h2' }), 'mb-4')}>
          {content.title}
        </h2>
        <div className="text-fd-muted-foreground mx-auto max-w-220 space-y-3 text-sm leading-relaxed sm:text-base">
          <p>{content.intro}</p>
        </div>
      </div>

      <div className="bg-fd-card overflow-hidden rounded-2xl border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-180 table-fixed text-left text-sm">
            <thead className="text-fd-muted-foreground bg-fd-muted/40 text-xs font-medium uppercase">
              <tr>
                <th className="w-1/6 px-4 py-3 sm:px-6">
                  {content.headers.plan}
                </th>
                <th className="w-1/4 px-4 py-3">{content.headers.fiveHour}</th>
                <th className="w-1/4 px-4 py-3">{content.headers.sevenDay}</th>
                <th className="w-1/3 px-4 py-3 sm:pr-6">
                  {content.headers.ratio}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-current/5">
                  <td className="px-4 py-4 font-medium sm:px-6">{row.name}</td>
                  <td className="px-4 py-4 tabular-nums">
                    {approxLabel} {row.fiveHourRequests.toLocaleString('en-US')}{' '}
                    {requestsLabel}
                  </td>
                  <td className="px-4 py-4 tabular-nums">
                    {approxLabel} {row.sevenDayRequests.toLocaleString('en-US')}{' '}
                    {requestsLabel}
                  </td>
                  <td className="px-4 py-4 sm:pr-6">
                    <div className="max-w-56">
                      <span className="tabular-nums">
                        {row.ratio.toLocaleString('en-US')}×
                      </span>
                      <RatioBar value={row.ratio} max={maxCapacity} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes outside the card */}
      <div className="mt-5 space-y-3">
        <div className="flex items-start gap-2.5">
          <Info className="mt-0.5 size-4 shrink-0 text-blue-500" />
          <p className="text-fd-muted-foreground text-sm">
            {content.estimationNote}
          </p>
        </div>
      </div>
    </section>
  );
}

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b last:border-b-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-medium">{question}</span>
        <ChevronDown
          className={cn(
            'size-5 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'grid transition-all duration-200',
          isOpen ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <p className="text-fd-muted-foreground text-sm leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FAQSection({
  title,
  groups,
}: {
  title: string;
  groups: FAQGroup[];
}) {
  const [activeGroup, setActiveGroup] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Reset accordion when switching groups
  const handleGroupChange = (idx: number) => {
    setActiveGroup(idx);
    setOpenIndex(null);
  };

  const currentItems = groups[activeGroup]?.items ?? [];

  return (
    <section className="mx-auto mt-20 max-w-260 px-4 pb-20">
      <div className="mb-10 text-center">
        <h2 className={cn(headingVariants({ variant: 'h2' }), 'mb-3')}>
          {title}
        </h2>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row">
        {/* Left Tab Bar */}
        <div className="shrink-0 sm:w-48 lg:w-52">
          <div className="flex flex-row gap-1 overflow-x-auto pb-1 sm:flex-col sm:overflow-visible sm:pb-0">
            {groups.map((group, idx) => (
              <button
                key={idx}
                onClick={() => handleGroupChange(idx)}
                className={cn(
                  'relative rounded-lg px-4 py-3 text-left text-sm font-medium whitespace-nowrap transition-all duration-200',
                  'sm:rounded-l-none sm:border-l-[3px]',
                  activeGroup === idx
                    ? [
                        'bg-fd-card text-fd-foreground shadow-sm',
                        'sm:border-l-brand sm:bg-fd-card',
                      ]
                    : [
                        'text-fd-muted-foreground hover:text-fd-foreground',
                        'hover:bg-fd-muted/50',
                        'sm:border-l-transparent',
                      ]
                )}
              >
                <span className="hidden sm:block">{group.group}</span>
                <span className="sm:hidden">{group.group}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Accordion */}
        <div className="min-w-0 flex-1">
          <div className={cn(cardVariants(), 'rounded-2xl')}>
            {currentItems.length > 0 ? (
              currentItems.map((item, idx) => (
                <AccordionItem
                  key={idx}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openIndex === idx}
                  onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
                />
              ))
            ) : (
              <div className="text-fd-muted-foreground px-6 py-12 text-center text-sm">
                No items in this group.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function PricingHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto mb-16 max-w-200 px-4 pt-16 text-center">
      <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
        {title}
      </h1>
      <p className="text-fd-muted-foreground text-lg">{subtitle}</p>
    </div>
  );
}
