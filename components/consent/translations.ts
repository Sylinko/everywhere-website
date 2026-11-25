export interface ConsentTranslation {
  toast: {
    title: string;
    description: string;
    cookiePolicy: string;
    accept: string;
    reject: string;
    preferences: string;
  };
  dialog: {
    title: string;
    description: string;
    gpcNotice: string;
    strictlyNecessary: {
      name: string;
      description: string;
    };
    purposes: {
      analytics: { name: string; description: string };
    };
    acceptAll: string;
    rejectAll: string;
    savePreferences: string;
    close: string;
  };
}

export const consentTranslations: Record<string, ConsentTranslation> = {
  en: {
    toast: {
      title: 'Data & Privacy',
      description:
        'With your permission, we use analytics cookies to see which pages people visit. See our',
      cookiePolicy: 'Cookie Policy',
      accept: 'Accept All',
      reject: 'Reject All',
      preferences: 'Preferences',
    },
    dialog: {
      title: 'Cookie Preferences',
      description:
        'Manage your cookie preferences below. You can enable or disable different categories of cookies. Strictly necessary cookies cannot be disabled as they are essential for the website to function.',
      gpcNotice: 'Your browser sends a Global Privacy Control (GPC) signal. Optional tracking is off unless you explicitly allow it here.',
      strictlyNecessary: {
        name: 'Strictly Necessary',
        description:
          'Essential cookies required for the website to function. These cannot be disabled.',
      },
      purposes: {
        analytics: {
          name: 'Analytics & Performance',
          description:
            'Google Analytics uses cookies to distinguish visits and measure how people use the website.',
        },
      },
      acceptAll: 'Accept All',
      rejectAll: 'Reject All',
      savePreferences: 'Save Preferences',
      close: 'Close',
    },
  },
  zh: {
    toast: {
      title: '数据与隐私',
      description: '经你同意，我们会使用统计 Cookie 了解哪些页面有人访问。详情请见',
      cookiePolicy: 'Cookie 政策',
      accept: '全部接受',
      reject: '全部拒绝',
      preferences: '偏好设置',
    },
    dialog: {
      title: 'Cookie 偏好设置',
      description:
        '请在下方管理你的 Cookie 偏好设置。你可以按类别启用或关闭 Cookie；必要 Cookie 用于保障网站基本运行，无法关闭。',
      gpcNotice: '已检测到浏览器的 Global Privacy Control (GPC) 信号。除非你在本站明确同意，否则非必要追踪会自动关闭。',
      strictlyNecessary: {
        name: '严格必要',
        description: '保障网站正常运行所必需的 Cookie，无法关闭。',
      },
      purposes: {
        analytics: {
          name: '分析与性能',
          description:
            'Google Analytics 使用 Cookie 区分不同访问，统计网站的使用情况。',
        },
      },
      acceptAll: '全部接受',
      rejectAll: '全部拒绝',
      savePreferences: '保存偏好',
      close: '关闭',
    },
  },
};
