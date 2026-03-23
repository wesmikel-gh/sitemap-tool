import type { SitemapNode } from '../types/sitemap';
import { createDefaultNode } from './defaults';
import { flattenTree } from './tree';

export function treeToMarkdown(nodes: SitemapNode[], depth = 0): string {
  const lines: string[] = [];
  for (const node of nodes) {
    const indent = '  '.repeat(depth);
    const pathSuffix = node.path ? ` (${node.path})` : '';
    lines.push(`${indent}- ${node.title}${pathSuffix}`);
    if (node.children.length > 0) {
      lines.push(treeToMarkdown(node.children, depth + 1));
    }
  }
  return lines.join('\n');
}

export function markdownToTree(markdown: string, existingNodes: SitemapNode[]): SitemapNode[] {
  const lines = markdown.split('\n').filter((l) => l.trim().length > 0);
  const existingFlat = flattenTree(existingNodes);

  const root: SitemapNode[] = [];
  const stack: { node: SitemapNode; depth: number }[] = [];

  for (const line of lines) {
    const match = line.match(/^(\s*)- (.+)$/);
    if (!match) continue;

    const indent = match[1].length;
    const depth = Math.floor(indent / 2);
    let rawTitle = match[2].trim();

    let path = '';
    const pathMatch = rawTitle.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
    if (pathMatch) {
      rawTitle = pathMatch[1].trim();
      path = pathMatch[2].trim();
    }

    const existing = existingFlat.find((n) => n.title === rawTitle);
    const node: SitemapNode = existing
      ? { ...existing, children: [], title: rawTitle, path: path || existing.path }
      : { ...createDefaultNode(rawTitle), path: path || '/' + rawTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-/]/g, '') };

    while (stack.length > 0 && stack[stack.length - 1].depth >= depth) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(node);
    } else {
      stack[stack.length - 1].node.children.push(node);
    }

    stack.push({ node, depth });
  }

  return root;
}
