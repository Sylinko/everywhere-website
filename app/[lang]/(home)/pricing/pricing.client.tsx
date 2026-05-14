'use client';

import { cn } from '@/lib/cn';
import {
  buttonVariants,
  cardVariants,
  headingVariants,
} from '@/components/common/variants';
import { Check, ChevronDown, Sparkles, Type, Image, Video, AudioLines, FileText, TriangleAlert, Info, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { type ReactNode, JSX, useState } from 'react';
import {
  type PricingPlan,
  type FAQItem,
  planData,
} from './pricing-data';
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

export function PricingCard({ plan, lang }: { plan: PricingPlan; lang: string }) {
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
          'before:from-brand before:absolute before:inset-0 before:-z-20 before:rounded-3xl before:bg-linear-to-br before:to-brand-alter-2 before:content-[""]',
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
      <h3 className="text-lg font-semibold text-fd-muted-foreground mb-2">{plan.name}</h3>

      {/* Price */}
      <div className="mb-4 flex items-baseline gap-1">
        <span className="text-3xl font-bold">{plan.price}</span>
        <span className="text-fd-muted-foreground">{plan.period}</span>
      </div>

      {/* Features */}
      <p className="mb-4 text-sm text-fd-muted-foreground">{plan.includes}</p>
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
          <div className="bg-emerald-700 text-white absolute -top-2.5 -right-2.5 z-10 rounded-full px-2.5 py-0.5 text-xs font-medium shadow-sm">
            {plan.badge}
          </div>
        )}
        <Link
          href={ctaHref}
          className={cn(
            buttonVariants({
              size: 'lg',
              variant: 'secondary'
            }),
            'w-full',
            'rounded-xl'
          )}
        >
          {plan.cta}
        </Link>
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
}: {
  plans: PricingPlan[];
  taxNote: string;
  title: string;
  lang: string;
  webSearchExtraNote: string;
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
      <div className="mb-10 text-center">
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
      <div className="flex gap-2.5 mt-6">
        <Info className="mt-0.5 size-4 shrink-0 text-amber-500" />
        <p className="text-sm text-fd-muted-foreground">
          {webSearchExtraNote}
        </p>
      </div>

      {/* Tax note */}
      <div className="flex gap-2.5 mt-3">
        <Info className="mt-0.5 size-4 shrink-0 text-blue-500" />
        <p className="text-sm text-fd-muted-foreground">
          {taxNote}
        </p>
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
  modalitiesPositionOffset,
  creditsPositionOffset,
  isLast,
}: {
  item: ModelSupportItem;
  providerIcon: Record<string, JSX.Element>;
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
          <div className="flex items-center truncate text-sm font-medium">
            {item.model}
            <DeprecationWarning date={item.deprecationDate} />
          </div>
          <div className="text-fd-muted-foreground text-xs">
            {item.company}
          </div>
        </div>
      </div>
      <div className={cn("w-24 shrink-0 hidden lg:block", modalitiesPositionOffset)}>
        <ModalityBadges modalities={item.inputModalities} />
      </div>
      <div className={cn("w-32 shrink-0 text-center text-sm tabular-nums sm:w-40 hidden sm:block", creditsPositionOffset)}>
        {basePricing ? formatCredits(basePricing.input) : '—'}
      </div>
      <div className={cn("w-32 shrink-0 text-center text-sm tabular-nums sm:w-40 hidden sm:block", creditsPositionOffset)}>
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
  children,
}: {
  tier: 'pro' | 'plus' | 'starter';
  models: ModelSupportItem[];
  borderRadius?: string;
  modalitiesPositionOffset?: string;
  creditsPositionOffset?: string;
  providerIcon: Record<string, JSX.Element>;
  children?: ReactNode;
}) {
  const style = tierStyles[tier];
  const label = tier.charAt(0).toUpperCase() + tier.slice(1);

  return (
    <div className="relative">
      <div
        className={cn(
          'overflow-hidden border-t-2 border-b-2 border-l-2 border-r-2',
          borderRadius,
          style.borderColor,
          style.bg
        )}
      >
        {/* Solid color bar header */}
        <div
          className={cn(
            'px-4 py-1 text-lg font-bold tracking-wide',
            style.bar
          )}
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
        }
      : {
          model: 'Model',
          modality: 'Input Modality',
          input: 'Input Credits',
          output: 'Output Credits',
          unit: '(1M Token)',
        };

  const disclaimers =
    lang === 'zh'
      ? {
          tierAccess: '我们会根据您的订阅方案提供相应的模型访问权限。升级到更高级别计划，即可解锁包括低等级在内的所有模型。',
          priceChange: '由于各模型官方更新频繁，模型列表及积分消耗可能会随市场情况进行动态调整，感谢您的理解。',
        }
      : {
          tierAccess: 'Your access depends on your current plan. upgrading to a higher tier automatically unlocks all models from the lower tiers.',
          priceChange: 'To keep pace with frequent official updates, model availability and credit pricing may be adjusted dynamically. We appreciate your understanding.',
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
          <div className="text-fd-muted-foreground flex items-center gap-4 pl-5 pr-5 py-3">
            <div className="min-w-0 flex-1 text-xs font-medium sm:text-sm">
              {headers.model}
            </div>
            <div className="w-28 mx-4 shrink-0 text-xs font-medium sm:text-sm relative right-2 hidden lg:block">
              {headers.modality}
            </div>
            <div className="w-24 mx-5 shrink-0 text-center text-xs font-medium sm:text-sm hidden sm:block">
              {headers.input}
              <span className="ml-1 text-fd-muted-foreground block">{headers.unit}</span>
            </div>
            <div className="w-28 mx-8 shrink-0 text-center text-xs font-medium sm:text-sm hidden sm:block">
              {headers.output}
              <span className="ml-1 text-fd-muted-foreground block">{headers.unit}</span>
            </div>
          </div>

          <div className="p-2">
            <TierFolder
              tier="pro"
              models={proModels}
              providerIcon={providerIcon}
              borderRadius='rounded-2xl'
              modalitiesPositionOffset='relative right-6'
              creditsPositionOffset="relative left-[4px]"
            >
              <TierFolder
                tier="plus"
                models={plusModels}
                providerIcon={providerIcon}
                modalitiesPositionOffset='relative right-4'
                creditsPositionOffset="relative left-[12px]"
                borderRadius='rounded-xl'
              >
                <TierFolder
                  tier="starter"
                  models={starterModels}
                  providerIcon={providerIcon}
                  modalitiesPositionOffset='relative right-2'
                  creditsPositionOffset="relative left-[20px]"
                  borderRadius='rounded-lg'
                />
              </TierFolder>
            </TierFolder>
          </div>
        </div>
      </div>

      {/* Disclaimers */}
      <div className="mt-6 space-y-3 px-2">
        <div className="flex items-start gap-2.5 text-sm text-fd-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0 text-blue-500" />
          <span>{disclaimers.tierAccess}</span>
        </div>
        <div className="flex items-start gap-2.5 text-sm text-fd-muted-foreground">
          <RefreshCw className="mt-0.5 size-4 shrink-0 text-amber-500" />
          <span>{disclaimers.priceChange}</span>
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
  items,
}: {
  title: string;
  items: FAQItem[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto mt-20 max-w-200 px-4 pb-20">
      <div className="mb-10 text-center">
        <h2 className={cn(headingVariants({ variant: 'h2' }), 'mb-3')}>
          {title}
        </h2>
      </div>

      <div className={cn(cardVariants(), 'rounded-2xl')}>
        {items.map((item, idx) => (
          <AccordionItem
            key={idx}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === idx}
            onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
          />
        ))}
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
