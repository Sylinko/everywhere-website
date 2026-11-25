import {
  readFileSync,
  mkdirSync,
  writeFileSync,
  globSync,
  unlinkSync,
} from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import matter from 'gray-matter';
import { contentPages } from './static-paths.ts';
import { i18n } from '../lib/i18n.ts';
import {
  createDocsOgResponse,
  createSiteOgResponse,
  type SiteOgOptions,
} from './og-layout.tsx';

const sitePageContent: Record<
  string,
  Record<'home' | 'download' | 'pricing', Omit<SiteOgOptions, 'lang'>>
> = {
  en: {
    home: {
      variant: 'home',
      title: 'Every moment, Every place.',
      description:
        'An on-demand AI assistant that grasps your on-screen context and assists instantly with one shortcut.',
    },
    download: {
      variant: 'download',
      title: 'Native AI that lives on your desktop.',
      description:
        'Install Everywhere on Windows, macOS, or Linux. Summon instant on-screen intelligence without switching apps.',
    },
    pricing: {
      variant: 'pricing',
      title: 'Plans built for your flow.',
      description:
        'Bring your own key or subscribe to Everywhere cloud service to instantly run models in your workflow.',
    },
  },
  zh: {
    home: {
      variant: 'home',
      title: '一键呼出的通用桌面智能体',
      description:
        '具备屏幕情境感知能力的交互式 AI 助手。呼之即来，秒懂你的屏幕，即刻提供协助。',
    },
    download: {
      variant: 'download',
      title: '即刻获取你的桌面 AI 助手',
      description:
        '支持 Windows、macOS 与 Linux。无需切换应用，随时随地一键呼出情境感知 AI 协助。',
    },
    pricing: {
      variant: 'pricing',
      title: '选择适合您的 Everywhere 计划',
      description:
        '自带密钥或订阅 Everywhere 云服务，随时在工作流中运行模型，获取即时 AI 协助。',
    },
  },
};

const destination = resolve('public/og');
const expected = new Set<string>();
function save(url: string, png: Buffer) {
  const path = resolve('public', '.' + url);
  if (
    png.readUInt32BE() !== 0x89504e47 ||
    png.readUInt32BE(16) !== 1200 ||
    png.readUInt32BE(20) !== 630
  )
    throw new Error(`Invalid OG image: ${url}`);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, png);
  expected.add(relative(destination, path));
}
for (const lang of i18n.languages) {
  for (const [name, page] of Object.entries(sitePageContent[lang])) {
    save(
      `/og/site/${lang}/${name}.png`,
      await createSiteOgResponse({ lang, ...page })
    );
  }
  for (const section of ['docs', 'policies'] as const) {
    for (const page of contentPages(section, lang)) {
      const { title, description } = matter(
        readFileSync(page.file, 'utf8')
      ).data;
      if (typeof title !== 'string')
        throw new Error('Missing OG title: ' + page.file);
      save(
        page.image,
        section === 'docs'
          ? await createDocsOgResponse({ lang, title, description })
          : await createSiteOgResponse({
              lang,
              variant: 'policy',
              title,
              description:
                description ??
                (lang === 'zh'
                  ? '查看 Everywhere 的服务条款、隐私声明与相关合规政策。'
                  : 'Read Everywhere legal terms, privacy commitments, and service policies.'),
            })
      );
    }
  }
}
// This directory contains generated cards only. A renamed page must not leave its old image live.
for (const file of globSync('**/*.png', { cwd: destination }))
  if (!expected.has(file)) unlinkSync(resolve(destination, file));
console.log(`Generated ${expected.size} localized Open Graph images.`);
