import { Map } from 'lucide-react';
import { useSitemapStore } from '../../store/useSitemapStore';

export function EmptyState() {
  const addNode = useSitemapStore((s) => s.addNode);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-20">
      <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
        <Map className="w-8 h-8 text-indigo-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-1">No pages yet</h3>
      <p className="text-sm text-slate-400 mb-6 max-w-xs">
        Start building your sitemap by adding your first page.
      </p>
      <button
        onClick={() => addNode(null)}
        className="px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors"
      >
        Add First Page
      </button>
    </div>
  );
}
