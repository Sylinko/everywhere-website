export interface ConsentTranslation {
  toast: {
    title: string;
    description: string;
    cookiePolicy: string;
    accept: string;
    preferences: string;
  };
  dialog: {
    title: string;
    description: string;
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
  'en-US': {
    toast: {
      title: 'Data & Privacy',
      description:
        'Anonymous analytics help us build a better assistant for you. See our',
      cookiePolicy: 'Cookie Policy',
      accept: 'Accept',
      preferences: 'Preferences',
    },
    dialog: {
      title: 'Cookie Preferences',
      description:
        'Manage your cookie preferences below. You can enable or disable different categories of cookies. Strictly necessary cookies cannot be disabled as they are essential for the website to function.',
      strictlyNecessary: {
        name: 'Strictly Necessary',
        description: 'Essential cookies required for the website to function. These cannot be disabled.',
      },
      purposes: {
        analytics: {
          name: 'Analytics & Performance',
          description:
            'These cookies help us understand how visitors interact with our website by collecting anonymous information. This includes tools like Google Analytics for traffic analysis.',
        },
      },
      acceptAll: 'Accept All',
      rejectAll: 'Reject All',
      savePreferences: 'Save Preferences',
      close: 'Close',
    },
  },
  'zh-CN': {
    toast: {
      title: '数据与隐私',
      description:
        '匿名分析帮助我们为您打造更好的助手。请参阅我们的',
      cookiePolicy: 'Cookie 政策',
      accept: '接受',
      preferences: '偏好设置',
    },
    dialog: {
      title: 'Cookie 偏好设置',
      description:
        '请在下方管理您的 Cookie 偏好设置。您可以启用或禁用不同类别的 Cookie。必要 Cookie 无法禁用，因为它们是网站正常运行所必需的。',
      strictlyNecessary: {
        name: '严格必要',
        description: '网站正常运行所必需的必要 Cookie。这些 Cookie 无法禁用。',
      },
      purposes: {
        analytics: {
          name: '分析与性能',
          description:
            '这些 Cookie 通过收集匿名信息帮助我们了解访客如何与网站互动，包括 Google Analytics 等流量分析工具。',
        },
      },
      acceptAll: '全部接受',
      rejectAll: '全部拒绝',
      savePreferences: '保存偏好',
      close: '关闭',
    },
  },
};
