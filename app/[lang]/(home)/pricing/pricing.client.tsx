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
  Info,
  Calculator,
  Search,
  Banknote,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import {
  type PricingPlan,
  type FAQGroup,
  type UsageLimitContent,
  planData,
} from './pricing-data';
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
        'relative flex h-full flex-col rounded-3xl p-5 transition-all duration-300',
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
        {plan.features.map((feature, idx) => {
          const text = typeof feature === 'string' ? feature : feature.text;
          const rawNote =
            typeof feature === 'string' ? undefined : feature.note;
          const notes =
            rawNote == null ? [] : Array.isArray(rawNote) ? rawNote : [rawNote];
          return (
            <li
              key={idx}
              className={cn('flex flex-col gap-0.5', !text && 'invisible')}
            >
              <div className="flex items-start gap-2.5">
                <Check className="text-brand mt-0.5 size-4 shrink-0" />
                <span className="text-sm">{text || '\u00A0'}</span>
              </div>
              {notes.map((note, noteIdx) => (
                <span
                  key={noteIdx}
                  className="text-fd-muted-foreground mt-1 pl-[26px] text-sm whitespace-pre-line"
                >
                  {note}
                </span>
              ))}
            </li>
          );
        })}
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
  requestEstimateNote,
  promoBanner,
}: {
  plans: PricingPlan[];
  taxNote: string;
  title: string;
  lang: string;
  webSearchExtraNote: string;
  requestEstimateNote: string;
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

      {/* Request estimate basis note */}
      <div className="mt-6 flex gap-2.5">
        <Calculator className="text-fd-muted-foreground mt-0.5 size-4 shrink-0" />
        <p className="text-fd-muted-foreground text-sm">
          {requestEstimateNote}
        </p>
      </div>

      {/* Web search extra cost note */}
      <div className="mt-3 flex gap-2.5">
        <Search className="mt-0.5 size-4 shrink-0 text-amber-500" />
        <p className="text-fd-muted-foreground text-sm">{webSearchExtraNote}</p>
      </div>

      {/* Tax note */}
      <div className="mt-3 flex gap-2.5">
        <Banknote className="mt-0.5 size-4 shrink-0 text-blue-500" />
        <p className="text-fd-muted-foreground text-sm">{taxNote}</p>
      </div>
    </section>
  );
}

export { ModelSupportTable } from './model-support-table';

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
      fiveHourCredits: planData.starter.fiveHourCredits,
      sevenDayCredits: planData.starter.sevenDayCredits,
      ratio: planData.starter.ratio,
    },
    {
      id: 'plus',
      name: 'Plus',
      fiveHourRequests: planData.plus.fiveHourRequests,
      sevenDayRequests: planData.plus.sevenDayRequests,
      fiveHourCredits: planData.plus.fiveHourCredits,
      sevenDayCredits: planData.plus.sevenDayCredits,
      ratio: planData.plus.ratio,
    },
    {
      id: 'pro',
      name: 'Pro',
      fiveHourRequests: planData.pro.fiveHourRequests,
      sevenDayRequests: planData.pro.sevenDayRequests,
      fiveHourCredits: planData.pro.fiveHourCredits,
      sevenDayCredits: planData.pro.sevenDayCredits,
      ratio: planData.pro.ratio,
    },
  ];
  const maxCapacity = Math.max(...rows.flatMap((row) => [row.ratio]));

  const approxLabel = lang === 'zh' ? '约' : '~';
  const requestsLabel = lang === 'zh' ? '次请求' : 'requests';
  const creditsLabel = lang === 'zh' ? '积分' : 'credits';

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
          <table className="w-full table-fixed text-left text-sm">
            <thead className="text-fd-muted-foreground bg-fd-muted/40 text-xs font-medium uppercase">
              <tr>
                <th scope="col" className="w-1/5 px-3 py-3 sm:px-6">
                  {content.headers.plan}
                </th>
                <th scope="col" className="w-3/10 px-3 py-3 sm:w-1/4 sm:px-4">
                  {content.headers.fiveHour}
                </th>
                <th scope="col" className="w-3/10 px-3 py-3 sm:w-1/4 sm:px-4">
                  {content.headers.sevenDay}
                </th>
                <th
                  scope="col"
                  className="w-1/5 px-2 py-3 sm:w-3/10 sm:px-4 sm:pr-6"
                >
                  {content.headers.ratio}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-current/5">
                  <th scope="row" className="px-3 py-4 font-medium sm:px-6">
                    {row.name}
                  </th>
                  <td className="px-3 py-4 tabular-nums sm:px-4">
                    <span className="block font-medium">
                      <span className="whitespace-nowrap">
                        {approxLabel}{' '}
                        {row.fiveHourRequests.toLocaleString('en-US')}
                      </span>{' '}
                      <span className="whitespace-nowrap">{requestsLabel}</span>
                    </span>
                    <span className="text-fd-muted-foreground mt-0.5 block">
                      {(row.fiveHourCredits / 1_000_000).toLocaleString(
                        'en-US'
                      )}
                      M {creditsLabel}
                    </span>
                  </td>
                  <td className="px-3 py-4 tabular-nums sm:px-4">
                    <span className="block font-medium">
                      <span className="whitespace-nowrap">
                        {approxLabel}{' '}
                        {row.sevenDayRequests.toLocaleString('en-US')}
                      </span>{' '}
                      <span className="whitespace-nowrap">{requestsLabel}</span>
                    </span>
                    <span className="text-fd-muted-foreground mt-0.5 block">
                      {(row.sevenDayCredits / 1_000_000).toLocaleString(
                        'en-US'
                      )}
                      M {creditsLabel}
                    </span>
                  </td>
                  <td className="px-3 py-4 sm:px-4 sm:pr-6">
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
          <Calculator className="text-fd-muted-foreground mt-0.5 size-4 shrink-0" />
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
