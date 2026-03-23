import type { SitemapNode } from '../types/sitemap';

export interface FlatNode extends SitemapNode {
  depth: number;
  parentId: string | null;
}

export function flattenTree(nodes: SitemapNode[], depth = 0, parentId: string | null = null): FlatNode[] {
  const result: FlatNode[] = [];
  for (const node of nodes) {
    result.push({ ...node, depth, parentId });
    if (node.children.length > 0) {
      result.push(...flattenTree(node.children, depth + 1, node.id));
    }
  }
  return result;
}

export function findNodeById(nodes: SitemapNode[], id: string): SitemapNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    const found = findNodeById(node.children, id);
    if (found) return found;
  }
  return null;
}

export function updateNodeInTree(nodes: SitemapNode[], id: string, updates: Partial<SitemapNode>): SitemapNode[] {
  return nodes.map((node) => {
    if (node.id === id) {
      return { ...node, ...updates, children: updates.children ?? node.children };
    }
    return { ...node, children: updateNodeInTree(node.children, id, updates) };
  });
}

export function removeNodeFromTree(nodes: SitemapNode[], id: string): SitemapNode[] {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) => ({
      ...node,
      children: removeNodeFromTree(node.children, id),
    }));
}

export function addChildToNode(nodes: SitemapNode[], parentId: string | null, newNode: SitemapNode): SitemapNode[] {
  if (parentId === null) {
    return [...nodes, newNode];
  }
  return nodes.map((node) => {
    if (node.id === parentId) {
      return { ...node, children: [...node.children, newNode] };
    }
    return { ...node, children: addChildToNode(node.children, parentId, newNode) };
  });
}

export function countNodes(nodes: SitemapNode[]): number {
  let count = 0;
  for (const node of nodes) {
    count += 1 + countNodes(node.children);
  }
  return count;
}
