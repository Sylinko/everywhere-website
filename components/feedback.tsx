'use client';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/common/variants';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { type SyntheticEvent, useEffect, useState, useTransition } from 'react';
import {
  Collapsible,
  CollapsibleContent,
} from 'fumadocs-ui/components/ui/collapsible';
import { cva } from 'class-variance-authority';
import { usePathname } from '@/lib/navigation';
import Link from '@/components/site-link';

const rateButtonVariants = cva(
  'inline-flex items-center gap-2 px-3 py-2 rounded-full font-medium border text-sm [&_svg]:size-4 disabled:cursor-not-allowed cursor-pointer transition-colors',
  {
    variants: {
      active: {
        true: 'bg-fd-accent text-fd-accent-foreground [&_svg]:fill-current',
        false: 'text-fd-muted-foreground hover:bg-fd-accent/50',
      },
    },
  }
);

export interface Feedback {
  opinion: 'good' | 'bad';
  url?: string;
  message: string;
}

export interface ActionResponse {
  githubUrl: string;
}

interface Result extends Feedback {
  response?: ActionResponse;
}

export interface FeedbackProps {
  lang: string;
  onRateAction: (url: string, feedback: Feedback) => Promise<ActionResponse>;
}

const translations = {
  en: {
    question: 'How is this guide?',
    good: 'Good',
    bad: 'Bad',
    thanks: 'Thank you for your feedback!',
    viewOnGitHub: 'View on GitHub',
    submitAgain: 'Submit Again',
    placeholder: 'Leave your feedback...',
    submit: 'Submit',
    failure: 'Could not send your feedback. Please try again.',
  },
  zh: {
    question: '这篇文档对你有帮助吗？',
    good: '有帮助',
    bad: '没帮助',
    thanks: '感谢你的反馈！',
    viewOnGitHub: '在 GitHub 查看',
    submitAgain: '重新提交',
    placeholder: '请留下你的反馈...',
    submit: '提交',
    failure: '反馈发送失败，请重试。',
  },
};

export function Feedback({ lang, onRateAction }: FeedbackProps) {
  const url = usePathname();
  const [previous, setPrevious] = useState<Result | null>(null);
  const [opinion, setOpinion] = useState<'good' | 'bad' | null>(null);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  const [isPending, startTransition] = useTransition();

  const t =
    translations[lang as keyof typeof translations] || translations['en'];

  useEffect(() => {
    const item = localStorage.getItem(`docs-feedback-${url}`);

    if (item === null) return;

    const t = setTimeout(() => {
      setPrevious(JSON.parse(item) as Result);
    }, 0);

    return () => clearTimeout(t);
  }, [url]);

  useEffect(() => {
    const key = `docs-feedback-${url}`;

    if (previous) localStorage.setItem(key, JSON.stringify(previous));
    else localStorage.removeItem(key);
  }, [previous, url]);

  function submit(e?: SyntheticEvent) {
    e?.preventDefault();
    if (opinion == null || isPending || !message.trim()) return;
    setFailed(false);

    startTransition(async () => {
      const feedback: Feedback = {
        opinion,
        message,
      };

      try {
        const response = await onRateAction(url, feedback);
        setPrevious({
          response,
          ...feedback,
        });
        setMessage('');
        setOpinion(null);
      } catch {
        setFailed(true);
      }
    });
  }

  const activeOpinion = previous?.opinion ?? opinion;

  return (
    <Collapsible
      open={opinion !== null || previous !== null}
      onOpenChange={(v) => {
        if (!v) setOpinion(null);
      }}
      className="border-y py-3"
    >
      <div className="flex flex-row flex-wrap items-center gap-2">
        <p className="pe-2 text-sm font-medium">{t.question}</p>
        <button
          disabled={previous !== null}
          className={cn(
            rateButtonVariants({
              active: activeOpinion === 'good',
            })
          )}
          onClick={() => {
            setOpinion('good');
          }}
        >
          <ThumbsUp />
          {t.good}
        </button>
        <button
          disabled={previous !== null}
          className={cn(
            rateButtonVariants({
              active: activeOpinion === 'bad',
            })
          )}
          onClick={() => {
            setOpinion('bad');
          }}
        >
          <ThumbsDown />
          {t.bad}
        </button>
      </div>
      <CollapsibleContent className="mt-3">
        {previous ? (
          <div className="bg-fd-card text-fd-muted-foreground flex flex-col items-center gap-3 rounded-xl px-3 py-6 text-center text-sm">
            <p>{t.thanks}</p>
            <div className="flex flex-row items-center gap-2">
              <Link
                href={previous.response?.githubUrl || '#'}
                rel="noopener"
                target="_blank"
                className={cn(buttonVariants(), 'text-xs')}
              >
                {t.viewOnGitHub}
              </Link>

              <button
                className={cn(
                  buttonVariants({
                    variant: 'secondary',
                  }),
                  'text-xs'
                )}
                onClick={() => {
                  setOpinion(previous.opinion);
                  setPrevious(null);
                }}
              >
                {t.submitAgain}
              </button>
            </div>
          </div>
        ) : (
          <form className="flex flex-col gap-3" onSubmit={submit}>
            <textarea
              autoFocus
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-fd-secondary text-fd-secondary-foreground placeholder:text-fd-muted-foreground resize-none rounded-lg border p-3 focus-visible:outline-none"
              placeholder={t.placeholder}
              onKeyDown={(e) => {
                if (!e.shiftKey && e.key === 'Enter') {
                  submit(e);
                }
              }}
            />
            <button
              type="submit"
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'w-fit px-3'
              )}
              disabled={isPending}
            >
              {t.submit}
            </button>
            {failed && <p role="alert">{t.failure}</p>}
          </form>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
