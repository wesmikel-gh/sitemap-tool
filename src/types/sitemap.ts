export type NodeStatus = 'draft' | 'published' | 'planned' | 'in-review' | 'archived';

export interface SitemapNode {
  id: string;
  title: string;
  path: string;
  description: string;
  status: NodeStatus;
  seoTitle: string;
  seoDescription: string;
  notes: string;
  children: SitemapNode[];
}

export type ViewMode = 'tree' | 'markdown' | 'table';

export interface SitemapState {
  nodes: SitemapNode[];
  selectedNodeId: string | null;
  activeView: ViewMode;

  setNodes: (nodes: SitemapNode[]) => void;
  addNode: (parentId: string | null) => void;
  updateNode: (id: string, updates: Partial<SitemapNode>) => void;
  deleteNode: (id: string) => void;
  selectNode: (id: string | null) => void;
  setActiveView: (view: ViewMode) => void;
  exportToJSON: () => string;
  importFromJSON: (json: string) => void;
}
