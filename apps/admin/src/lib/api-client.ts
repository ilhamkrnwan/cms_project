import type { ApiResponse, ContentItem, Workspace } from '@wontent/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();
  return data;
}

export const api = {
  health: () => fetchApi<{ status: string }>('/health'),
  getContents: () => fetchApi<ContentItem[]>('/api/v1/contents'),
  getContent: (id: string) => fetchApi<ContentItem>(`/api/v1/contents/${id}`),
  createContent: (payload: { title: string; content: string; status?: string }) =>
    fetchApi<ContentItem>('/api/v1/contents', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getWorkspaces: () => fetchApi<Workspace[]>('/api/v1/workspaces'),
  createWorkspace: (payload: { name: string }) =>
    fetchApi<Workspace>('/api/v1/workspaces', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
