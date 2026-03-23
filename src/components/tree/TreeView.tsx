import { SortableTree } from 'dnd-kit-sortable-tree';
import type { TreeItems } from 'dnd-kit-sortable-tree';
import { useSitemapStore } from '../../store/useSitemapStore';
import { TreeItemRow, type TreeNodeData } from './TreeItemRow';
import { EmptyState } from '../shared/EmptyState';
import { useCallback, useMemo } from 'react';
import type { SitemapNode } from '../../types/sitemap';

function toTreeItems(nodes: SitemapNode[]): TreeItems<TreeNodeData> {
  return nodes.map((node) => ({
    id: node.id,
    title: node.title,
    path: node.path,
    status: node.status,
    description: node.description,
    seoTitle: node.seoTitle,
    seoDescription: node.seoDescription,
    notes: node.notes,
    children: toTreeItems(node.children),
  }));
}

function fromTreeItems(items: TreeItems<TreeNodeData>): SitemapNode[] {
  return items.map((item) => ({
    id: String(item.id),
    title: item.title,
    path: item.path,
    status: item.status,
    description: item.description,
    seoTitle: item.seoTitle,
    seoDescription: item.seoDescription,
    notes: item.notes,
    children: fromTreeItems(item.children ?? []),
  }));
}

export function TreeView() {
  const nodes = useSitemapStore((s) => s.nodes);
  const setNodes = useSitemapStore((s) => s.setNodes);

  const items = useMemo(() => toTreeItems(nodes), [nodes]);

  const handleItemsChanged = useCallback(
    (newItems: TreeItems<TreeNodeData>) => {
      setNodes(fromTreeItems(newItems));
    },
    [setNodes]
  );

  if (nodes.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="p-4">
      <SortableTree<TreeNodeData, HTMLDivElement>
        items={items}
        onItemsChanged={handleItemsChanged}
        TreeItemComponent={TreeItemRow}
        indentationWidth={32}
      />
    </div>
  );
}
