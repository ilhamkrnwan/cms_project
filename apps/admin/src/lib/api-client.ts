import type { ApiResponse, ContentItem, Workspace, AdapterConfig } from '@wontent/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Core fetch wrapper with error handling and auth support.
 */
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  try {
    const response = await fetch(url, { ...options, headers, credentials: 'include' });
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `HTTP ${response.status}: ${response.statusText}`,
        error: data.error || response.statusText,
        timestamp: new Date().toISOString(),
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
      error: 'NETWORK_ERROR',
      timestamp: new Date().toISOString(),
    };
  }
}

// ──────────────────────────────────────────────
// Content API
// ──────────────────────────────────────────────

export const contentApi = {
  list: (params?: { status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    const qs = query.toString();
    return fetchApi<ContentItem[]>(`/api/v1/contents${qs ? `?${qs}` : ''}`);
  },

  get: (id: string) =>
    fetchApi<ContentItem>(`/api/v1/contents/${id}`),

  create: (payload: {
    title: string;
    content: string;
    workspaceId?: string;
    categoryId?: string;
    slug?: string;
    featuredImage?: string;
    status?: 'draft' | 'published' | 'scheduled' | 'archived';
    publishDate?: string;
    seoMetadata?: Record<string, unknown>;
  }) =>
    fetchApi<ContentItem>('/api/v1/contents', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: {
    title?: string;
    content?: string;
    slug?: string;
    featuredImage?: string;
    status?: 'draft' | 'published' | 'scheduled' | 'archived';
    seoMetadata?: Record<string, unknown>;
  }) =>
    fetchApi<ContentItem>(`/api/v1/contents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  delete: (id: string) =>
    fetchApi<void>(`/api/v1/contents/${id}`, { method: 'DELETE' }),

  publish: (id: string) =>
    fetchApi<void>(`/api/v1/contents/${id}/publish`, { method: 'POST' }),

  archive: (id: string) =>
    fetchApi<void>(`/api/v1/contents/${id}/archive`, { method: 'POST' }),

  getRevisions: (id: string) =>
    fetchApi<any[]>(`/api/v1/contents/${id}/revisions`),

  restoreRevision: (id: string, versionId: string) =>
    fetchApi<void>(`/api/v1/contents/${id}/revisions/${versionId}/restore`, { method: 'POST' }),
};

// ──────────────────────────────────────────────
// Categories & Tags API
// ──────────────────────────────────────────────

export const categoryApi = {
  list: () => fetchApi<any[]>('/api/v1/categories'),
  create: (payload: { name: string; workspaceId?: string; description?: string }) =>
    fetchApi<any>('/api/v1/categories', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id: string, payload: { name?: string; description?: string }) =>
    fetchApi<any>(`/api/v1/categories/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  delete: (id: string) =>
    fetchApi<void>(`/api/v1/categories/${id}`, { method: 'DELETE' }),
};

export const tagApi = {
  list: () => fetchApi<any[]>('/api/v1/tags'),
  create: (payload: { name: string; workspaceId?: string }) =>
    fetchApi<any>('/api/v1/tags', { method: 'POST', body: JSON.stringify(payload) }),
  delete: (id: string) =>
    fetchApi<void>(`/api/v1/tags/${id}`, { method: 'DELETE' }),
};

// ──────────────────────────────────────────────
// Media API
// ──────────────────────────────────────────────

export const mediaApi = {
  list: (search?: string) => {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    return fetchApi<any[]>(`/api/v1/media${qs}`);
  },
  get: (id: string) => fetchApi<any>(`/api/v1/media/${id}`),
  upload: (payload: {
    fileName: string;
    fileType: string;
    fileSize: number;
    workspaceId?: string;
    fileUrl?: string;
    altText?: string;
    caption?: string;
  }) =>
    fetchApi<any>('/api/v1/media/upload', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id: string, payload: { fileName?: string; altText?: string; caption?: string }) =>
    fetchApi<any>(`/api/v1/media/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  delete: (id: string) =>
    fetchApi<void>(`/api/v1/media/${id}`, { method: 'DELETE' }),
  getFolders: () => fetchApi<any[]>('/api/v1/media/folders'),
  compress: (mediaUrl: string, format?: 'webp' | 'avif' | 'jpeg') =>
    fetchApi<any>('/api/v1/media/compress', { method: 'POST', body: JSON.stringify({ mediaUrl, format }) }),
};

// ──────────────────────────────────────────────
// Analytics API
// ──────────────────────────────────────────────

export interface AnalyticsOverview {
  totalContents: number;
  publishedContents: number;
  scheduledContents: number;
  draftContents: number;
  averageSeoScore: number;
  averageGeoScore: number;
  totalMediaAssets: number;
  adapterUsage: { name: string; count: number; percentage: number }[];
  socialEngagement: { totalViews: number; totalShares: number; totalComments: number };
}

export const analyticsApi = {
  overview: () => fetchApi<AnalyticsOverview>('/api/v1/analytics/overview'),
};

// ──────────────────────────────────────────────
// Workspace API
// ──────────────────────────────────────────────

export const workspaceApi = {
  list: () => fetchApi<Workspace[]>('/api/v1/workspaces'),
  create: (payload: { name: string }) =>
    fetchApi<Workspace>('/api/v1/workspaces', { method: 'POST', body: JSON.stringify(payload) }),
};

// ──────────────────────────────────────────────
// SEO & GEO API
// ──────────────────────────────────────────────

export const seoApi = {
  analyze: (payload: { title: string; content: string; url?: string }) =>
    fetchApi<any>('/api/v1/seo/analyze', { method: 'POST', body: JSON.stringify(payload) }),
};

export const geoApi = {
  analyze: (payload: { title: string; content: string }) =>
    fetchApi<any>('/api/v1/geo/analyze', { method: 'POST', body: JSON.stringify(payload) }),
};

// ──────────────────────────────────────────────
// AI API
// ──────────────────────────────────────────────

export type AIAction = 'title' | 'summary' | 'rewrite' | 'grammar' | 'translation' | 'faq' | 'meta_description' | 'hashtags' | 'cta';

export const aiApi = {
  generate: (action: AIAction, text: string) =>
    fetchApi<{ action: string; generatedContent: string }>('/api/v1/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ action, text }),
    }),
};

// ──────────────────────────────────────────────
// Adapters API
// ──────────────────────────────────────────────

export const adapterApi = {
  list: () => fetchApi<any[]>('/api/v1/adapters'),
  publish: (payload: {
    targetAdapter: 'wordpress' | 'astro' | 'next';
    title: string;
    content: string;
    slug?: string;
    featuredImage?: string;
    config?: Record<string, unknown>;
  }) =>
    fetchApi<any>('/api/v1/adapters/publish', { method: 'POST', body: JSON.stringify(payload) }),
};

// ──────────────────────────────────────────────
// Social API
// ──────────────────────────────────────────────

export const socialApi = {
  accounts: () => fetchApi<any[]>('/api/v1/social/accounts'),
  publish: (payload: { platform: string; text: string; mediaUrl?: string }) =>
    fetchApi<any>('/api/v1/social/publish', { method: 'POST', body: JSON.stringify(payload) }),
};

// ──────────────────────────────────────────────
// Scheduling API
// ──────────────────────────────────────────────

export const schedulingApi = {
  list: () => fetchApi<any[]>('/api/v1/schedules'),
  create: (payload: { contentId: string; targetPlatform: string; scheduledTime: string }) =>
    fetchApi<any>('/api/v1/schedules', { method: 'POST', body: JSON.stringify(payload) }),
  retry: (id: string) =>
    fetchApi<any>(`/api/v1/schedules/${id}/retry`, { method: 'POST' }),
};

// ──────────────────────────────────────────────
// Notifications API
// ──────────────────────────────────────────────

export const notificationApi = {
  list: () => fetchApi<any[]>('/api/v1/notifications'),
  sendWebhook: (payload: { provider: 'discord' | 'slack'; webhookUrl: string; message: string }) =>
    fetchApi<any>('/api/v1/notifications/webhook', { method: 'POST', body: JSON.stringify(payload) }),
};

// ──────────────────────────────────────────────
// Settings API
// ──────────────────────────────────────────────

export const settingsApi = {
  get: () => fetchApi<any>('/api/v1/settings'),
  update: (payload: Record<string, unknown>) =>
    fetchApi<any>('/api/v1/settings', { method: 'PUT', body: JSON.stringify(payload) }),
};

// ──────────────────────────────────────────────
// Users API
// ──────────────────────────────────────────────

export const usersApi = {
  list: () => fetchApi<any[]>('/api/v1/users'),
  invite: (payload: { name?: string; email: string; role: string; organization?: string }) =>
    fetchApi<any>('/api/v1/users/invite', { method: 'POST', body: JSON.stringify(payload) }),
  updateRole: (id: string, role: string) =>
    fetchApi<any>(`/api/v1/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
  deleteUser: (id: string) =>
    fetchApi<any>(`/api/v1/users/${id}`, { method: 'DELETE' }),

  roles: () => fetchApi<any[]>('/api/v1/users/roles'),
  createRole: (payload: { name: string; description?: string; permissions?: string[] }) =>
    fetchApi<any>('/api/v1/users/roles', { method: 'POST', body: JSON.stringify(payload) }),
  deleteRole: (id: string) =>
    fetchApi<any>(`/api/v1/users/roles/${id}`, { method: 'DELETE' }),

  permissions: () => fetchApi<any[]>('/api/v1/users/permissions'),
  organizations: () => fetchApi<any[]>('/api/v1/users/organizations'),
};

// ──────────────────────────────────────────────
// Auth API
// ──────────────────────────────────────────────

export const authApi = {
  signIn: (payload: { email: string; password: string }) =>
    fetchApi<any>('/api/v1/auth/sign-in', { method: 'POST', body: JSON.stringify(payload) }),
  signUp: (payload: { name: string; email: string; password: string }) =>
    fetchApi<any>('/api/v1/auth/sign-up', { method: 'POST', body: JSON.stringify(payload) }),
  signOut: () =>
    fetchApi<any>('/api/v1/auth/sign-out', { method: 'POST' }),
  getSession: () =>
    fetchApi<any>('/api/v1/auth/session'),
  forgotPassword: (payload: { email: string }) =>
    fetchApi<any>('/api/v1/auth/forgot-password', { method: 'POST', body: JSON.stringify(payload) }),
  resetPassword: (payload: { email: string; token: string; newPassword: string }) =>
    fetchApi<any>('/api/v1/auth/reset-password', { method: 'POST', body: JSON.stringify(payload) }),
  verifyEmail: (payload: { token: string }) =>
    fetchApi<any>('/api/v1/auth/verify-email', { method: 'POST', body: JSON.stringify(payload) }),
};


// ──────────────────────────────────────────────
// Health API
// ──────────────────────────────────────────────

export const healthApi = {
  check: () => fetchApi<{ status: string }>('/health'),
};

// ──────────────────────────────────────────────
// Backwards-compatible `api` export
// ──────────────────────────────────────────────

export const api = {
  health: healthApi.check,
  getContents: () => contentApi.list(),
  getContent: (id: string) => contentApi.get(id),
  createContent: (payload: { title: string; content: string; status?: string }) =>
    contentApi.create(payload as Parameters<typeof contentApi.create>[0]),
  getWorkspaces: workspaceApi.list,
  createWorkspace: workspaceApi.create,
};
