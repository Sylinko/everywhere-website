import React from 'react';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import satori from 'satori';
import sharp from 'sharp';

const icon = await sharp(
  readFileSync(new URL('../public/Everywhere.webp', import.meta.url))
)
  .resize(144, 144)
  .png()
  .toBuffer();
const everywhereIconDataUrl = `data:image/png;base64,${icon.toString('base64')}`;

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

// Fonts are build dependencies, not Worker assets or network requests.
const require = createRequire(import.meta.url);
function loadFonts(subset: 'latin' | 'chinese-simplified') {
  return ([400, 600, 700] as const).map((weight) => ({
    name: subset === 'latin' ? 'Noto Sans' : 'Noto Sans SC',
    weight,
    style: 'normal' as const,
    data: readFileSync(
      require.resolve(
        `@fontsource/noto-sans-sc/files/noto-sans-sc-${subset}-${weight}-normal.woff`
      )
    ),
  }));
}
async function renderCard(
  element: React.ReactElement,
  options: Parameters<typeof satori>[1]
) {
  const svg = await satori(element, options);
  return sharp(Buffer.from(svg)).png().toBuffer();
}
const latin = loadFonts('latin');
const bilingual = [...latin, ...loadFonts('chinese-simplified')];

function truncateText(text: string | undefined, maxLength: number): string {
  if (!text) return '';
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

function estimateVisualUnits(text: string): number {
  let units = 0;
  for (const ch of text) {
    units += /[^\u0000-\u00ff]/.test(ch) ? 1.85 : 1;
  }
  return units;
}

function getDocsTitleSize(title: string): number {
  const units = estimateVisualUnits(title);
  if (units <= 20) return 60;
  if (units <= 34) return 52;
  if (units <= 52) return 44;
  return 38;
}

function getSiteTitleSize(title: string): number {
  const units = estimateVisualUnits(title);
  if (units <= 22) return 54;
  if (units <= 34) return 46;
  return 40;
}

function OgBackdrop() {
  return (
    <svg
      width={OG_WIDTH}
      height={OG_HEIGHT}
      viewBox={`0 0 ${OG_WIDTH} ${OG_HEIGHT}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: OG_WIDTH,
        height: OG_HEIGHT,
      }}
    >
      <defs>
        <radialGradient id="tech-glow" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.055" />
          <stop offset="55%" stopColor="#a1a1aa" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="top-accent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#74b8ef" />
          <stop offset="50%" stopColor="#edeac7" />
          <stop offset="100%" stopColor="#eb65bc" />
        </linearGradient>
        <pattern
          id="og-grid"
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 48 0 L 0 0 0 48"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.06"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width={OG_WIDTH} height={OG_HEIGHT} fill="#09090b" />
      <rect width={OG_WIDTH} height={OG_HEIGHT} fill="url(#og-grid)" />
      <rect width={OG_WIDTH} height={OG_HEIGHT} fill="url(#tech-glow)" />
      <rect x="0" y="0" width={OG_WIDTH} height="3" fill="url(#top-accent)" />
    </svg>
  );
}

function TopLeftBrand() {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <img
          src={everywhereIconDataUrl}
          width={38}
          height={38}
          alt="Everywhere"
          style={{ borderRadius: 10 }}
        />
        <span
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.02em',
          }}
        >
          Everywhere
        </span>
      </div>
    </div>
  );
}

function BottomLeftUrl({ url }: { url: string }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <span
        style={{
          fontSize: 19,
          fontWeight: 400,
          color: 'rgba(255, 255, 255, 0.56)',
        }}
      >
        {url}
      </span>
    </div>
  );
}

export interface SiteOgOptions {
  lang: string;
  variant: 'home' | 'download' | 'pricing' | 'policy';
  title: string;
  description: string;
}

export async function createSiteOgResponse(options: SiteOgOptions) {
  const { lang, variant, title, description } = options;
  const isZh = lang === 'zh';

  const cleanTitle = truncateText(title, isZh ? 36 : 72);
  const cleanDescription = truncateText(description, isZh ? 68 : 135);
  const titleFontSize = getSiteTitleSize(cleanTitle);

  const previewPrompt =
    variant === 'download'
      ? isZh
        ? '安装并配置 Everywhere'
        : 'Install & set up Everywhere'
      : variant === 'pricing'
        ? isZh
          ? '对比云服务与自带密钥方案'
          : 'Compare Cloud & BYOK plans'
        : variant === 'policy'
          ? isZh
            ? '查看当前页面条款摘要'
            : 'Summarize this policy document'
          : isZh
            ? '总结当前屏幕的核心内容'
            : 'Summarize key points on screen';

  const contextLabel = isZh ? '屏幕上下文感知' : 'On-screen Context';
  const stepOne = isZh ? '感知界面结构 · 0.4s' : 'Analyze Context · 0.4s';
  const stepTwo = isZh ? '生成精准回答' : 'Instant Assistance';
  const answerTitle = isZh ? '核心要点' : 'Key Takeaways';
  const answerBody =
    variant === 'download'
      ? isZh
        ? '支持 Windows 与 macOS，安装后一键唤醒桌面助手。'
        : 'Native builds for Windows & macOS. Launch anywhere with one shortcut.'
      : variant === 'pricing'
        ? isZh
          ? '免费版永久可用，云服务按需升级，支持自由切换模型。'
          : 'Free BYOK forever. Flexible Cloud tiers with frontier models built in.'
        : isZh
          ? '无需复制粘贴或切换窗口，在当前任务中随时调用 AI 协助。'
          : 'Zero context switching. Understands your active window and responds in flow.';

  const domainText = 'everywhere.sylinko.com';
  const fonts =
    isZh || /[^\u0000-\u00ff]/.test(cleanTitle + cleanDescription)
      ? bilingual
      : latin;

  return renderCard(
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        padding: '46px 64px',
        backgroundColor: '#09090b',
        color: '#ffffff',
        fontFamily: '"Noto Sans", "Noto Sans SC", sans-serif',
        overflow: 'hidden',
      }}
    >
      <OgBackdrop />

      {/* Unified top-left brand */}
      <TopLeftBrand />

      {/* Main 2-column content */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          flex: 1,
          gap: 48,
        }}
      >
        {/* Left column: Clean title + description */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            gap: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: titleFontSize,
              fontWeight: 700,
              lineHeight: 1.16,
              letterSpacing: '-0.03em',
              color: '#ffffff',
            }}
          >
            {cleanTitle}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 24,
              fontWeight: 400,
              lineHeight: 1.5,
              color: 'rgba(228, 228, 231, 0.78)',
              maxWidth: 610,
            }}
          >
            {cleanDescription}
          </div>
        </div>

        {/* Right column: Everywhere floating assistant card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 392,
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              width: 382,
              borderRadius: 22,
              backgroundColor: '#111116',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              padding: 20,
              gap: 15,
            }}
          >
            {/* Window Header */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: 12,
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <img
                  src={everywhereIconDataUrl}
                  width={28}
                  height={28}
                  alt="Everywhere"
                  style={{ borderRadius: 8 }}
                />
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#fafafa',
                  }}
                >
                  Everywhere
                </span>
              </div>

              {/* Window controls */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 26,
                    height: 26,
                    borderRadius: 8,
                    backgroundColor: 'rgba(92, 92, 230, 0.28)',
                    border: '1px solid rgba(129, 140, 248, 0.4)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      width: 7,
                      height: 7,
                      borderRadius: 999,
                      backgroundColor: '#a5b4fc',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 26,
                    height: 26,
                    borderRadius: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      width: 10,
                      height: 2,
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.55)',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right-aligned prompt & context chip */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 8,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  padding: '8px 14px',
                  borderRadius: 12,
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: 15,
                  fontWeight: 400,
                  color: '#f4f4f5',
                }}
              >
                {previewPrompt}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '5px 11px',
                  borderRadius: 8,
                  backgroundColor: 'rgba(235, 101, 188, 0.15)',
                  border: '1px solid rgba(235, 101, 188, 0.32)',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#f9a8d4',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    backgroundColor: '#f472b6',
                  }}
                />
                <span>{contextLabel}</span>
              </div>
            </div>

            {/* Trace timeline */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 9,
                paddingLeft: 4,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: '#818cf8',
                  }}
                />
                <span
                  style={{
                    fontSize: 14,
                    color: 'rgba(212, 212, 216, 0.72)',
                  }}
                >
                  {stepOne}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: '#eb65bc',
                  }}
                />
                <span
                  style={{
                    fontSize: 14,
                    color: 'rgba(212, 212, 216, 0.72)',
                  }}
                >
                  {stepTwo}
                </span>
              </div>
            </div>

            {/* Answer Block */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 7,
                padding: '13px 15px',
                borderRadius: 14,
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#ffffff',
                }}
              >
                {answerTitle}
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: 14,
                  fontWeight: 400,
                  lineHeight: 1.48,
                  color: 'rgba(228, 228, 231, 0.78)',
                }}
              >
                {answerBody}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-left URL */}
      <BottomLeftUrl url={domainText} />
    </div>,
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts,
    }
  );
}

export interface DocsOgOptions {
  lang: string;
  title: string;
  description?: string;
}

export async function createDocsOgResponse(options: DocsOgOptions) {
  const { lang, title, description } = options;
  const isZh = lang === 'zh';

  const cleanTitle = truncateText(title, isZh ? 34 : 70);
  const cleanDescription = truncateText(description, isZh ? 76 : 155);
  const titleFontSize = getDocsTitleSize(cleanTitle);

  const footerUrl = `everywhere.sylinko.com/${lang}/docs`;

  const fonts =
    isZh || /[^\u0000-\u00ff]/.test(cleanTitle + cleanDescription)
      ? bilingual
      : latin;

  return renderCard(
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        padding: '46px 64px',
        backgroundColor: '#09090b',
        color: '#ffffff',
        fontFamily: '"Noto Sans", "Noto Sans SC", sans-serif',
        overflow: 'hidden',
      }}
    >
      <OgBackdrop />

      {/* Unified top-left brand */}
      <TopLeftBrand />

      {/* Middle row: Clean title & description */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
          gap: 22,
          maxWidth: 1020,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: titleFontSize,
            fontWeight: 700,
            lineHeight: 1.18,
            letterSpacing: '-0.03em',
            color: '#ffffff',
          }}
        >
          {cleanTitle}
        </div>
        {cleanDescription ? (
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              fontWeight: 400,
              lineHeight: 1.48,
              color: 'rgba(228, 228, 231, 0.76)',
              maxWidth: 960,
            }}
          >
            {cleanDescription}
          </div>
        ) : null}
      </div>

      {/* Bottom-left URL */}
      <BottomLeftUrl url={footerUrl} />
    </div>,
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts,
    }
  );
}
