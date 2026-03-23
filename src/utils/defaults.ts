import { nanoid } from 'nanoid';
import type { SitemapNode } from '../types/sitemap';

export function createDefaultNode(title = 'New Page'): SitemapNode {
  return {
    id: nanoid(),
    title,
    path: '/' + title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    description: '',
    status: 'draft',
    seoTitle: '',
    seoDescription: '',
    notes: '',
    children: [],
  };
}

export function createSeedData(): SitemapNode[] {
  const home: SitemapNode = {
    ...createDefaultNode('Home'),
    path: '/',
    status: 'published',
    description: 'Main landing page',
  };
  const about: SitemapNode = {
    ...createDefaultNode('About'),
    path: '/about',
    status: 'published',
    children: [
      { ...createDefaultNode('Team'), path: '/about/team', status: 'published', children: [] },
      { ...createDefaultNode('Careers'), path: '/about/careers', status: 'planned', children: [] },
    ],
  };
  const products: SitemapNode = {
    ...createDefaultNode('Products'),
    path: '/products',
    status: 'published',
    children: [
      { ...createDefaultNode('Pricing'), path: '/products/pricing', status: 'published', children: [] },
      { ...createDefaultNode('Features'), path: '/products/features', status: 'draft', children: [] },
    ],
  };
  const blog: SitemapNode = {
    ...createDefaultNode('Blog'),
    path: '/blog',
    status: 'published',
    children: [],
  };
  const contact: SitemapNode = {
    ...createDefaultNode('Contact'),
    path: '/contact',
    status: 'in-review',
    children: [],
  };
  return [home, about, products, blog, contact];
}
