import type { ApiResponse, ContentItem, Workspace } from '@wontent/types';

export class WontentClient {
  private baseUrl: string;
  private apiKey?: string;

  constructor(options: { baseUrl?: string; apiKey?: string } = {}) {
    this.baseUrl = options.baseUrl || 'http://localhost:3000';
    this.apiKey = options.apiKey;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>)
    };
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const res = await fetch(`${this.baseUrl}${path}`, { ...options, headers });
    return res.json();
  }

  async getHealth() {
    return this.request<{ status: string }>('/health');
  }

  async getContents() {
    return this.request<ContentItem[]>('/api/v1/contents');
  }

  async getContent(id: string) {
    return this.request<ContentItem>(`/api/v1/contents/${id}`);
  }

  async createContent(data: Partial<ContentItem>) {
    return this.request<ContentItem>('/api/v1/contents', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async analyzeSeo(title: string, content: string) {
    return this.request<any>('/api/v1/seo/analyze', {
      method: 'POST',
      body: JSON.stringify({ title, content })
    });
  }

  async publishAdapter(targetAdapter: 'wordpress' | 'astro' | 'next', payload: { title: string; content: string; slug?: string }) {
    return this.request<any>('/api/v1/adapters/publish', {
      method: 'POST',
      body: JSON.stringify({ targetAdapter, ...payload })
    });
  }
}
