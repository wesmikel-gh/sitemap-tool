import { useRef } from 'react';
import { Map, TreePine, FileText, Table, Plus, Download, Upload } from 'lucide-react';
import { useSitemapStore } from '../../store/useSitemapStore';
import { downloadJSON, readJSONFile } from '../../utils/export';
import { countNodes } from '../../utils/tree';
import type { ViewMode } from '../../types/sitemap';

const views: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
  { id: 'tree', label: 'Tree', icon: <TreePine className="w-4 h-4" /> },
  { id: 'markdown', label: 'Markdown', icon: <FileText className="w-4 h-4" /> },
  { id: 'table', label: 'Table', icon: <Table className="w-4 h-4" /> },
];

export function Header() {
  const activeView = useSitemapStore((s) => s.activeView);
  const setActiveView = useSitemapStore((s) => s.setActiveView);
  const nodes = useSitemapStore((s) => s.nodes);
  const addNode = useSitemapStore((s) => s.addNode);
  const importFromJSON = useSitemapStore((s) => s.importFromJSON);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nodeCount = countNodes(nodes);

  const handleExport = () => {
    downloadJSON(nodes);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await readJSONFile(file);
      importFromJSON(JSON.stringify(data));
    } catch (err) {
      alert('Failed to import: ' + (err instanceof Error ? err.message : 'Invalid file'));
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <Map className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 leading-none">Sitemap Tool</h1>
            <span className="text-xs text-slate-400">{nodeCount} page{nodeCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeView === view.id
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {view.icon}
            {view.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => addNode(null)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Page
        </button>
        <button
          onClick={handleExport}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title="Export JSON"
        >
          <Download className="w-4 h-4" />
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title="Import JSON"
        >
          <Upload className="w-4 h-4" />
        </button>
        <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
      </div>
    </header>
  );
}
