import { useCallback } from 'react';
import type { SitemapNode, NodeStatus } from '../../types/sitemap';
import { useSitemapStore } from '../../store/useSitemapStore';

const statuses: { value: NodeStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'planned', label: 'Planned' },
  { value: 'in-review', label: 'In Review' },
  { value: 'archived', label: 'Archived' },
];

export function NodeForm({ node }: { node: SitemapNode }) {
  const updateNode = useSitemapStore((s) => s.updateNode);

  const update = useCallback(
    (field: keyof SitemapNode, value: string) => {
      updateNode(node.id, { [field]: value });
    },
    [node.id, updateNode]
  );

  return (
    <div className="space-y-4">
      <Field label="Title" value={node.title} onChange={(v) => update('title', v)} />
      <Field label="URL Path" value={node.path} onChange={(v) => update('path', v)} />
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
        <select
          value={node.status}
          onChange={(e) => update('status', e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
        >
          {statuses.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
      <Field label="Description" value={node.description} onChange={(v) => update('description', v)} multiline />
      <Field label="SEO Title" value={node.seoTitle} onChange={(v) => update('seoTitle', v)} />
      <Field label="SEO Description" value={node.seoDescription} onChange={(v) => update('seoDescription', v)} multiline />
      <Field label="Notes" value={node.notes} onChange={(v) => update('notes', v)} multiline />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const cls = "w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={`${cls} resize-y`} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </div>
  );
}
