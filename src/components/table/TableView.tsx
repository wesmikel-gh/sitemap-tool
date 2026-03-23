import { useSitemapStore } from '../../store/useSitemapStore';
import { flattenTree } from '../../utils/tree';
import { StatusBadge } from '../shared/StatusBadge';
import { EmptyState } from '../shared/EmptyState';
import { ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { NodeStatus } from '../../types/sitemap';

type SortField = 'title' | 'path' | 'status';
type SortDir = 'asc' | 'desc';

export function TableView() {
  const nodes = useSitemapStore((s) => s.nodes);
  const selectNode = useSitemapStore((s) => s.selectNode);
  const updateNode = useSitemapStore((s) => s.updateNode);
  const selectedNodeId = useSitemapStore((s) => s.selectedNodeId);
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const flatNodes = useMemo(() => {
    const flat = flattenTree(nodes);
    return [...flat].sort((a, b) => {
      const aVal = a[sortField] ?? '';
      const bVal = b[sortField] ?? '';
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [nodes, sortField, sortDir]);

  if (nodes.length === 0) return <EmptyState />;

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 select-none"
      onClick={() => toggleSort(field)}
    >
      <span className="flex items-center gap-1">
        {label}
        {sortField === field && (
          <ChevronRight className={`w-3 h-3 transition-transform ${sortDir === 'asc' ? 'rotate-90' : '-rotate-90'}`} />
        )}
      </span>
    </th>
  );

  return (
    <div className="p-4 overflow-auto">
      <table className="w-full bg-white border border-slate-200 rounded-lg overflow-hidden">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <SortHeader field="title" label="Page" />
            <SortHeader field="path" label="Path" />
            <SortHeader field="status" label="Status" />
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">SEO Title</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {flatNodes.map((node) => (
            <tr
              key={node.id}
              onClick={() => selectNode(node.id)}
              className={`cursor-pointer transition-colors ${
                selectedNodeId === node.id
                  ? 'bg-indigo-50'
                  : 'hover:bg-slate-50'
              }`}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  {node.depth > 0 && (
                    <span className="text-slate-300 text-xs" style={{ marginLeft: node.depth * 16 }}>
                      {'└ '}
                    </span>
                  )}
                  <InlineEdit
                    value={node.title}
                    onChange={(v) => updateNode(node.id, { title: v })}
                    className="text-sm font-medium text-slate-700"
                  />
                </div>
              </td>
              <td className="px-4 py-3">
                <InlineEdit
                  value={node.path}
                  onChange={(v) => updateNode(node.id, { path: v })}
                  className="text-sm text-slate-500 font-mono"
                />
              </td>
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <div className="relative inline-flex items-center">
                  <StatusBadge status={node.status} />
                  <select
                    value={node.status}
                    onChange={(e) => updateNode(node.id, { status: e.target.value as NodeStatus })}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="planned">Planned</option>
                    <option value="in-review">In Review</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-slate-500 truncate block max-w-[200px]">
                  {node.description || '—'}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-slate-500 truncate block max-w-[200px]">
                  {node.seoTitle || '—'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InlineEdit({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (!editing) {
    return (
      <span
        className={`${className} cursor-text hover:bg-slate-100 px-1 rounded`}
        onDoubleClick={(e) => { e.stopPropagation(); setDraft(value); setEditing(true); }}
      >
        {value || '—'}
      </span>
    );
  }

  return (
    <input
      autoFocus
      value={draft}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => { onChange(draft); setEditing(false); }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') { onChange(draft); setEditing(false); }
        if (e.key === 'Escape') setEditing(false);
      }}
      className={`${className} bg-white border border-indigo-300 rounded px-1 outline-none`}
    />
  );
}
