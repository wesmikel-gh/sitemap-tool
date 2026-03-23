import { useState, useEffect, useCallback } from 'react';
import { useSitemapStore } from '../../store/useSitemapStore';
import { treeToMarkdown, markdownToTree } from '../../utils/markdown';
import { AlertCircle, Check } from 'lucide-react';

export function MarkdownView() {
  const nodes = useSitemapStore((s) => s.nodes);
  const setNodes = useSitemapStore((s) => s.setNodes);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [synced, setSynced] = useState(true);

  useEffect(() => {
    setText(treeToMarkdown(nodes));
  }, [nodes]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setSynced(false);
    setError(null);
  }, []);

  const applyChanges = useCallback(() => {
    try {
      const newNodes = markdownToTree(text, nodes);
      setNodes(newNodes);
      setSynced(true);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to parse markdown');
    }
  }, [text, nodes, setNodes]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">
            Edit the hierarchy using indented markdown list syntax
          </span>
          {error && (
            <span className="flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="w-3 h-3" /> {error}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {synced ? (
            <span className="flex items-center gap-1 text-xs text-emerald-500">
              <Check className="w-3 h-3" /> Synced
            </span>
          ) : (
            <button
              onClick={applyChanges}
              className="px-3 py-1 text-xs font-medium bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
            >
              Apply Changes
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 p-4">
        <textarea
          value={text}
          onChange={handleChange}
          onBlur={applyChanges}
          className="w-full h-full font-mono text-sm text-slate-700 bg-white border border-slate-200 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="- Home (/)\n  - About (/about)\n    - Team (/about/team)\n  - Products (/products)"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
