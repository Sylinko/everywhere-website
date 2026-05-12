export const DownloadLinks = {
  windows: {
    installer:
      'https://download.sylinko.com/download?product=everywhere&os=win-x64&type=setup&version=latest',
    portable:
      'https://download.sylinko.com/download?product=everywhere&os=win-x64&type=zip&version=latest',
  },
  macos: {
    silicon:
      'https://download.sylinko.com/download?product=everywhere&os=osx-arm64&type=pkg&version=latest',
    intel:
      'https://download.sylinko.com/download?product=everywhere&os=osx-x64&type=pkg&version=latest',
  },
  linux: {
    deb: '',
    rpm: '',
    aur: '',
  },
} as const;

export const OfficialUrl = 'https://sylinko.com';
export const AccountUrl = 'https://account.sylinko.com';

export const ProductHuntUrl = 'https://www.producthunt.com/products/everywhere';
export const YoutubeUrl = 'https://www.youtube.com/@everywhere_official';
export const XUrl = 'https://x.com/everywhere_team';

export const QQGroupUrl = 'https://aka.sylinko.com/everywhere-qq-group';
export const DiscordUrl = 'https://aka.sylinko.com/everywhere-discord';

export const EverywhereTitles: Record<string, string> = {
  'en':
    'Everywhere - AI Assistant that flows with your desktop.',
  'zh':
    'Everywhere - 你的通用智能体，一键呼出的桌面 AI 助手',
};

export const EverywhereDescriptions: Record<string, string> = {
  'en':
    'Everywhere is an intuitive AI that works seamlessly alongside you. It grasps your screen context and assists instantly via a shortcut, hidden until needed.',
  'zh':
    '探索 Everywhere：一款具备情境感知能力的交互式 AI 助手。呼之即来，秒懂你的屏幕，即刻提供协助。',
};

// ── Sitemap configuration ────────────────────────────────────────────────

export interface StaticPageConfig {
  path: string;
  priority: number;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

/** Marketing / product pages that live outside the docs tree. */
export const staticPages: StaticPageConfig[] = [
  {
    path: 'download',
    priority: 0.9,
    changeFrequency: 'weekly',
  },
  {
    path: 'pricing',
    priority: 0.8,
    changeFrequency: 'weekly',
  },
];
