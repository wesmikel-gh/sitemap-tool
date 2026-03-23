# Sitemap Tool

A visual sitemap planning tool with drag-and-drop, markdown, and table views.

## Features

- **Tree View** — Drag-and-drop hierarchy with collapsible nodes, status badges, and inline add/delete
- **Markdown View** — Edit your sitemap as an indented markdown list with bidirectional sync
- **Table View** — Flat sortable table with inline-editable cells and clickable status badges
- **Rich Metadata** — Title, URL path, description, status, SEO title, SEO description, notes
- **Persistence** — Auto-saves to localStorage + JSON export/import

## Getting Started

```bash
npm install
npm run dev
```

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Zustand (state management + localStorage persistence)
- dnd-kit-sortable-tree (drag-and-drop)
- Lucide React (icons)
