import { X } from 'lucide-react';
import { useSitemapStore } from '../../store/useSitemapStore';
import { findNodeById } from '../../utils/tree';
import { NodeForm } from '../shared/NodeForm';

export function Sidebar() {
  const selectedNodeId = useSitemapStore((s) => s.selectedNodeId);
  const nodes = useSitemapStore((s) => s.nodes);
  const selectNode = useSitemapStore((s) => s.selectNode);

  if (!selectedNodeId) return null;

  const node = findNodeById(nodes, selectedNodeId);
  if (!node) return null;

  return (
    <div className="w-80 border-l border-slate-200 bg-white flex flex-col shrink-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700">Edit Page</h3>
        <button
          onClick={() => selectNode(null)}
          className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <NodeForm key={selectedNodeId} node={node} />
      </div>
    </div>
  );
}
