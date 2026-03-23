import React, { useState } from 'react';
import type { TreeItemComponentProps } from 'dnd-kit-sortable-tree';
import { SimpleTreeItemWrapper } from 'dnd-kit-sortable-tree';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { useSitemapStore } from '../../store/useSitemapStore';
import type { NodeStatus } from '../../types/sitemap';

export type TreeNodeData = {
  title: string;
  path: string;
  status: NodeStatus;
  description: string;
  seoTitle: string;
  seoDescription: string;
  notes: string;
};

export const TreeItemRow = React.forwardRef<HTMLDivElement, React.PropsWithChildren<TreeItemComponentProps<TreeNodeData>>>(
  (props, ref) => {
    const { item, depth, onCollapse, collapsed, ...rest } = props;
    const selectNode = useSitemapStore((s) => s.selectNode);
    const addNode = useSitemapStore((s) => s.addNode);
    const deleteNode = useSitemapStore((s) => s.deleteNode);
    const selectedNodeId = useSitemapStore((s) => s.selectedNodeId);
    const [showConfirm, setShowConfirm] = useState(false);

    const isSelected = selectedNodeId === item.id;

    return (
      <>
        <SimpleTreeItemWrapper
          {...rest}
          ref={ref}
          item={item}
          depth={depth}
          onCollapse={onCollapse}
          collapsed={collapsed}
          showDragHandle={false}
          disableCollapseOnItemClick
          className={`group border rounded-lg mb-1 transition-all ${
            isSelected
              ? 'border-indigo-300 bg-indigo-50/50 shadow-sm'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
          }`}
          contentClassName="flex items-center gap-2 px-2 py-2 min-h-[44px]"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer" onClick={() => selectNode(String(item.id))}>
            <GripVertical className="w-4 h-4 text-slate-300 shrink-0 cursor-grab" />
            <span className="font-medium text-sm text-slate-700 truncate">{item.title || 'Untitled'}</span>
            <span className="text-xs text-slate-400 truncate hidden sm:inline">{item.path}</span>
            <StatusBadge status={item.status} />
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); addNode(String(item.id)); }}
              className="p-1 rounded hover:bg-indigo-100 text-slate-400 hover:text-indigo-600 transition-colors"
              title="Add child page"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
              className="p-1 rounded hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors"
              title="Delete page"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </SimpleTreeItemWrapper>
        <ConfirmDialog
          open={showConfirm}
          title="Delete Page"
          message={`Are you sure you want to delete "${item.title}"${item.children && item.children.length > 0 ? ' and all its children' : ''}?`}
          onConfirm={() => { deleteNode(String(item.id)); setShowConfirm(false); }}
          onCancel={() => setShowConfirm(false)}
        />
      </>
    );
  }
);

TreeItemRow.displayName = 'TreeItemRow';
