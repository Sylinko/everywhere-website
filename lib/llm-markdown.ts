import { posix } from 'node:path';
import type { LLMsOptions } from 'fumadocs-core/mdx-plugins/remark-llms';
import {
  replaceSource,
  type Stringifier,
} from 'fumadocs-core/mdx-plugins/stringifier';
import { getSlugs } from 'fumadocs-core/source';

type Node = Parameters<typeof replaceSource>[1];
type File = Parameters<typeof replaceSource>[0];
type Element = Extract<
  Node,
  { type: 'mdxJsxFlowElement' | 'mdxJsxTextElement' }
>;
const origin = 'https://everywhere.sylinko.com';
const escapeLabel = (text: string) => text.replace(/[\[\]]/g, '\\$&');

function attribute(node: Element, name: string) {
  const attr = node.attributes.find(
    (item) => item.type === 'mdxJsxAttribute' && item.name === name
  );
  return attr?.type === 'mdxJsxAttribute' ? attr.value : undefined;
}

export const llmMarkdownOptions = {
  headingIds: false,
  output: 'string',
} satisfies LLMsOptions;

/** Keep HTML interactive; give readers of the Markdown export absolute links and meaningful text. */
export function remarkLLMUrls() {
  return (tree: Node, file: File) => {
    const match = file.path
      .replaceAll('\\', '/')
      .match(/\/content\/(docs|policies)\/(en|zh)\/(.+)$/);
    if (!match) return;
    const [, section, lang, filePath] = match;
    const fromFile = (path: string) =>
      ['', lang, section, ...getSlugs(path)].join('/');
    const pageUrl = origin + fromFile(filePath);
    const absolute = (href: string) =>
      new URL(href.replaceAll('/[lang]/', `/${lang}/`), pageUrl).href;
    const docHref = (href: string) => {
      const [, path, suffix] = /^([^?#]*)(.*)$/s.exec(href)!;
      return !path.startsWith('/') &&
        !/^[a-z][\w+.-]*:/i.test(path) &&
        /\.mdx?$/.test(path)
        ? fromFile(posix.join(posix.dirname(filePath), path)) + suffix
        : href;
    };
    const original = `[${lang === 'zh' ? '在原页面查看此动态内容' : 'View this dynamic content on the original page'}](${pageUrl})`;
    function visit(node: Node) {
      if (
        node.type === 'mdxFlowExpression' ||
        (node.type === 'mdxJsxFlowElement' && node.name === 'SponsorList')
      ) {
        replaceSource(file, node, original, 'markdown');
      } else if (
        node.type === 'link' ||
        node.type === 'image' ||
        node.type === 'definition'
      ) {
        if (node.type !== 'image') node.url = docHref(node.url);
        const destination = `<${absolute(node.url)}>${node.title ? ' "' + node.title.replace(/["\\]/g, '\\$&') + '"' : ''}`;
        replaceSource(
          file,
          node,
          (s) => {
            if (node.type === 'definition')
              return `[${node.label ?? node.identifier}]: ${destination}`;
            if (node.type === 'image')
              return `![${escapeLabel(node.alt ?? '')}](${destination})`;
            return `[${s.inner(node)}](${destination})`;
          },
          'markdown'
        );
      } else if (
        node.type === 'mdxJsxFlowElement' ||
        node.type === 'mdxJsxTextElement'
      ) {
        const { name } = node;
        const href = attribute(node, 'href');
        const src = attribute(node, 'src');
        const title = attribute(node, 'title');
        const label = typeof title === 'string' ? title : '';
        const risk = attribute(node, 'risk');
        if (name === 'Command') {
          const command = attribute(node, 'command');
          if (typeof command === 'string') {
            replaceSource(
              file,
              node,
              `\`\`\`sh\n${command}\n\`\`\``,
              'markdown'
            );
          }
        } else if (name === 'HorizontalImg' || name === 'img') {
          if (typeof src === 'string')
            replaceSource(
              file,
              node,
              `![${escapeLabel(String(attribute(node, 'alt') ?? ''))}](<${absolute(src)}>)`,
              'markdown'
            );
        } else if (href) {
          const destination = (s: Stringifier) => {
            if (typeof href === 'string') return absolute(docHref(href));
            const statement = href.data?.estree?.body[0];
            if (statement?.type !== 'ExpressionStatement') return pageUrl;
            // Use the author's imported constant/function, just like the rendered page.
            return s.expression(
              {
                type: 'MemberExpression',
                computed: false,
                optional: false,
                property: { type: 'Identifier', name: 'href' },
                object: {
                  type: 'NewExpression',
                  callee: { type: 'Identifier', name: 'URL' },
                  arguments: [
                    statement.expression,
                    { type: 'Literal', value: pageUrl },
                  ],
                },
              },
              pageUrl
            );
          };
          replaceSource(
            file,
            node,
            (s) =>
              `[${label ? escapeLabel(label) : s.inner(node)}](<${destination(s)}>)${label ? '\n\n' + s.inner(node) : ''}`,
            'markdown'
          );
        } else if (name === 'Table') {
          replaceSource(
            file,
            node,
            (s) => `<table>\n${s.inner(node)}\n</table>`,
            'markdown'
          );
        } else if (name && /^[A-Z]/.test(name)) {
          replaceSource(
            file,
            node,
            (s) =>
              (label ? `**${label}**\n\n` : '') +
              s.inner(node) +
              (typeof risk === 'string' ? ` (risk: ${risk})` : ''),
            'markdown'
          );
        }
      }
      if ('children' in node) node.children.forEach(visit);
    }
    visit(tree);
  };
}
