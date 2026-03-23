import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SitemapState, ViewMode, SitemapNode } from '../types/sitemap';
import { createDefaultNode, createSeedData } from '../utils/defaults';
import { updateNodeInTree, removeNodeFromTree, addChildToNode } from '../utils/tree';

export const useSitemapStore = create<SitemapState>()(
  persist(
    (set, get) => ({
      nodes: createSeedData(),
      selectedNodeId: null,
      activeView: 'tree' as ViewMode,

      setNodes: (nodes: SitemapNode[]) => set({ nodes }),

      addNode: (parentId: string | null) => {
        const newNode = createDefaultNode();
        set({ nodes: addChildToNode(get().nodes, parentId, newNode), selectedNodeId: newNode.id });
      },

      updateNode: (id: string, updates: Partial<SitemapNode>) => {
        set({ nodes: updateNodeInTree(get().nodes, id, updates) });
      },

      deleteNode: (id: string) => {
        const state = get();
        set({
          nodes: removeNodeFromTree(state.nodes, id),
          selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
        });
      },

      selectNode: (id: string | null) => set({ selectedNodeId: id }),

      setActiveView: (view: ViewMode) => set({ activeView: view }),

      exportToJSON: () => JSON.stringify(get().nodes, null, 2),

      importFromJSON: (json: string) => {
        try {
          const data = JSON.parse(json);
          if (Array.isArray(data)) {
            set({ nodes: data, selectedNodeId: null });
          }
        } catch {
          console.error('Failed to parse imported JSON');
        }
      },
    }),
    {
      name: 'sitemap-tool',
      partialize: (state) => ({ nodes: state.nodes }),
    }
  )
);
