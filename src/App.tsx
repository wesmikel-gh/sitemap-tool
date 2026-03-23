import { useSitemapStore } from './store/useSitemapStore';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { TreeView } from './components/tree/TreeView';
import { MarkdownView } from './components/markdown/MarkdownView';
import { TableView } from './components/table/TableView';

function App() {
  const activeView = useSitemapStore((s) => s.activeView);

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto">
          {activeView === 'tree' && <TreeView />}
          {activeView === 'markdown' && <MarkdownView />}
          {activeView === 'table' && <TableView />}
        </main>
        <Sidebar />
      </div>
    </div>
  );
}

export default App;
