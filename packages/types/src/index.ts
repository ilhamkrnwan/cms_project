export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentItem {
  id: string;
  workspaceId: string;
  title: string;
  slug: string;
  content: string;
  featuredImage?: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  publishDate?: string;
  seoMetadata?: {
    seoTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdapterConfig {
  id: string;
  name: string;
  type: 'wordpress' | 'astro' | 'next' | 'meta' | string;
  status: 'active' | 'inactive';
  config: Record<string, unknown>;
}
