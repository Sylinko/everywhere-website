export const DownloadLinks = {
  windows: {
    installer:
      'https://ghproxy.sylinko.com/download?product=everywhere&os=win-x64&type=setup&version=latest',
    portable:
      'https://ghproxy.sylinko.com/download?product=everywhere&os=win-x64&type=zip&version=latest',
  },
  macos: {
    silicon:
      'https://ghproxy.sylinko.com/download?product=everywhere&os=osx-arm64&type=pkg&version=latest',
    intel:
      'https://ghproxy.sylinko.com/download?product=everywhere&os=osx-x64&type=pkg&version=latest',
  },
  linux: {
    deb: '',
    rpm: '',
    aur: '',
  },
} as const;

export const AccountUrl = "https://account.sylinko.com";

export const ProductHuntUrl = "https://www.producthunt.com/products/everywhere";

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
