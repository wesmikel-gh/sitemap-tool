import type { NodeStatus } from '../../types/sitemap';

const statusConfig: Record<NodeStatus, { label: string; classes: string }> = {
  draft: { label: 'Draft', classes: 'bg-amber-100 text-amber-800' },
  published: { label: 'Published', classes: 'bg-emerald-100 text-emerald-800' },
  planned: { label: 'Planned', classes: 'bg-indigo-100 text-indigo-800' },
  'in-review': { label: 'In Review', classes: 'bg-orange-100 text-orange-800' },
  archived: { label: 'Archived', classes: 'bg-slate-100 text-slate-600' },
};

export function StatusBadge({ status }: { status: NodeStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.classes}`}>
      {config.label}
    </span>
  );
}
