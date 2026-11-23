import { createFileRoute } from '@tanstack/react-router';
import { Download } from '@/src/features/site/download/download';
import { getSiteOgImageUrl, pageHead } from '@/lib/metadata';

export const Route = createFileRoute('/$lang/_site/download')({
  head: ({ params: { lang } }) =>
    pageHead({
      lang,
      path: 'download',
      title: lang === 'zh' ? '下载' : 'Download',
      description:
        lang === 'zh'
          ? '下载 Everywhere — 获取你的通用 AI 智能体。随处感知情境，即刻提供协助。支持 Windows 和 macOS。'
          : 'Download Everywhere — Get your Universal AI Agent. On-screen awareness assistance, delivered instantly. Supporting Windows and macOS.',
      image: getSiteOgImageUrl(lang, 'download'),
    }),
  component: () => <Download lang={Route.useParams().lang} />,
});
