import type { LLMsOptions } from 'fumadocs-core/mdx-plugins/remark-llms';
import { getSlugs } from 'fumadocs-core/source';
import { posix } from 'node:path';

type Node = Parameters<NonNullable<LLMsOptions['stringify']>>[0];
type Element = Extract<
  Node,
  { type: 'mdxJsxFlowElement' | 'mdxJsxTextElement' }
>;
const origin = 'https://everywhere.sylinko.com';

function attribute(node: Element, name: string): string | undefined {
  const attr = node.attributes.find(
    (item) => item.type === 'mdxJsxAttribute' && item.name === name
  );
  return attr?.type === 'mdxJsxAttribute' && typeof attr.value === 'string'
    ? attr.value
    : undefined;
}

/** Annotate only the Markdown representation; leave HTML and code examples intact. */
export function remarkLLMUrls() {
  return (tree: Node, file: { path: string }) => {
    const match = file.path
      .replaceAll('\\', '/')
      .match(/\/content\/(docs|policies)\/(en|zh)\/(.+)$/);
    if (!match) return;
    const [, section, lang, filePath] = match;
    const pageUrl =
      `${origin}/${lang}/${section}/${getSlugs(filePath).join('/')}`.replace(
        /\/$/,
        ''
      );

    function resolveUrl(value: string): string {
      const href = value.replaceAll('/[lang]/', `/${lang}/`);
      if (/^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith('//'))
        return href;
      const [, path, suffix] = href.match(/^([^?#]*)(.*)$/s)!;
      if (!path.startsWith('/') && /\.mdx?$/.test(path)) {
        const target = posix.join(posix.dirname(filePath), path);
        return `${origin}/${lang}/${section}/${getSlugs(target).join('/')}${suffix}`;
      }
      return new URL(href, pageUrl).href;
    }

    function visit(node: Node) {
      if (
        node.type === 'mdxFlowExpression' ||
        (node.type === 'mdxJsxFlowElement' && node.name === 'SponsorList')
      ) {
        // These sections require runtime data/JS. Link to the rendered source,
        // rather than exposing an unevaluated expression or an empty section.
        node.data = {
          ...node.data,
          _stringify: {
            text: `[${lang === 'zh' ? '在原页面查看此动态内容' : 'View this dynamic content on the original page'}](${pageUrl})`,
          },
        };
      } else if (
        node.type === 'link' ||
        node.type === 'image' ||
        node.type === 'definition'
      ) {
        node.data = {
          ...node.data,
          _stringify: { node: { ...node, url: resolveUrl(node.url) } },
        };
      } else if (
        node.type === 'mdxJsxFlowElement' ||
        node.type === 'mdxJsxTextElement'
      ) {
        node.data = {
          ...node.data,
          _stringify: {
            node: {
              ...node,
              attributes: node.attributes.map((attr) =>
                attr.type === 'mdxJsxAttribute' &&
                (attr.name === 'href' || attr.name === 'src') &&
                typeof attr.value === 'string'
                  ? { ...attr, value: resolveUrl(attr.value) }
                  : attr
              ),
            },
          },
        };
      }
      if ('children' in node) node.children.forEach(visit);
    }
    visit(tree);
  };
}

export const llmMarkdownOptions: LLMsOptions = {
  headingIds: false,
  stringify(original, _parent, state, info) {
    if (
      original.type !== 'mdxJsxFlowElement' &&
      original.type !== 'mdxJsxTextElement'
    )
      return;
    const annotated = original.data?._stringify;
    if (annotated && typeof annotated === 'object' && 'text' in annotated)
      return annotated.text;
    const node =
      annotated && typeof annotated === 'object' && 'node' in annotated
        ? (annotated.node as Element)
        : original;
    const children = () =>
      node.type === 'mdxJsxTextElement'
        ? state.containerPhrasing(node, info)
        : state.containerFlow(node, info);
    const href = attribute(node, 'href');
    const title = attribute(node, 'title');
    if (node.name === 'HorizontalImg' || node.name === 'img') {
      const src = attribute(node, 'src');
      if (src)
        return state.handle(
          {
            type: 'image',
            url: src,
            alt: attribute(node, 'alt') ?? '',
            title: null,
          },
          undefined,
          state,
          info
        );
    }
    if (href) {
      const label = (title ?? children().trim()) || href;
      return `[${label.replaceAll('[', '\\[').replaceAll(']', '\\]')}](<${href}>)${title ? '\n\n' + children() : ''}`;
    }
    if (node.name === 'PermissionBadge') {
      const risk = attribute(node, 'risk');
      return children() + (risk ? ` (risk: ${risk})` : '');
    }
    // Keep semantic HTML tables; discard layout components, not their content.
    if (node.name === 'Table') return `<table>\n${children()}\n</table>`;
    if (node.name && /^[a-z]/.test(node.name)) return;
    return (title ? `**${title}**\n\n` : '') + children() || '\n';
  },
};
