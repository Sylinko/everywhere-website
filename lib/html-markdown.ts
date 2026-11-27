import { fromHtml } from 'hast-util-from-html';
import { toMdast } from 'hast-util-to-mdast';
import { toMarkdown } from 'mdast-util-to-markdown';
import { gfmToMarkdown } from 'mdast-util-gfm';

type Tree = ReturnType<typeof fromHtml>;
type Node = Tree | Tree['children'][number];

function hasClass(node: Node, ...names: string[]): boolean {
  return (
    node.type === 'element' &&
    Array.isArray(node.properties.className) &&
    node.properties.className.some((name) => names.includes(String(name)))
  );
}

function findElement(node: Node, tag: string): Node | undefined {
  if (node.type === 'element' && node.tagName === tag) return node;
  if ('children' in node) {
    for (const child of node.children) {
      const found = findElement(child, tag);
      if (found) return found;
    }
  }
}

const excluded = new Set([
  'script',
  'style',
  'noscript',
  'nav',
  'aside',
  'footer',
  'svg',
  'canvas',
]);

export function htmlToMarkdown(html: string, url: URL): string {
  const tree = fromHtml(html);
  const structuredData: string[] = [];
  function clean(node: Node) {
    if (node.type === 'element') {
      // Retain meaning expressed by the site's utility classes, not its layout.
      if (hasClass(node, 'line-through')) node.tagName = 'del';
      if (node.tagName === 'span' && hasClass(node, 'block'))
        node.children.push({ type: 'text', value: ' ' });
      if (
        node.tagName === 'input' &&
        node.properties.readOnly &&
        typeof node.properties.value === 'string'
      ) {
        node.tagName = 'code';
        node.children = [{ type: 'text', value: node.properties.value }];
      }
      // Agents cannot expand disclosure rows (e.g. tiered model prices).
      delete node.properties.hidden;
      if (
        node.tagName === 'script' &&
        node.properties.type === 'application/ld+json'
      ) {
        structuredData.push(
          node.children
            .filter((child) => child.type === 'text')
            .map((child) => child.value)
            .join('')
        );
      }
      for (const key of ['href', 'src']) {
        const value = node.properties[key];
        if (typeof value === 'string')
          node.properties[key] = new URL(value, url).href;
      }
    }
    if ('children' in node) {
      node.children.forEach(clean);
      node.children = node.children.filter(
        (child) =>
          child.type !== 'comment' &&
          (child.type !== 'element' ||
            (!excluded.has(child.tagName) &&
              child.properties.ariaHidden !== 'true' &&
              child.properties.dataMarkdownIgnore !== 'true' &&
              !hasClass(child, 'invisible')))
      );
      if (hasClass(node, 'flex', 'inline-flex', 'grid', 'inline-grid')) {
        node.children = node.children.flatMap((child, index) =>
          index === 0 ? [child] : [{ type: 'text', value: ' ' }, child]
        );
      }
    }
  }
  clean(tree);
  const content =
    findElement(tree, 'main') ?? findElement(tree, 'body') ?? tree;
  const markdown = toMarkdown(toMdast(content), {
    extensions: [gfmToMarkdown()],
  });
  return (
    `Source: ${url.origin}${url.pathname}\n\n${markdown.trim()}\n` +
    structuredData.map((json) => `\n\`\`\`json\n${json}\n\`\`\`\n`).join('')
  );
}
