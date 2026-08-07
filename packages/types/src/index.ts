// ──────────────────────────────────────────────
// Core API Response
// ──────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

// ──────────────────────────────────────────────
// User & Auth
// ──────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role?: string;
  organization?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

// ──────────────────────────────────────────────
// Workspace
// ──────────────────────────────────────────────

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
}

// ──────────────────────────────────────────────
// Content
// ──────────────────────────────────────────────

export interface ContentItem {
  id: string;
  workspaceId: string;
  categoryId?: string;
  title: string;
  slug: string;
  content: string;
  body?: string; // alias for content in some contexts
  featuredImage?: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  publishDate?: string;
  seoMetadata?: SEOMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface SEOMetadata {
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  keywords?: string[];
  robots?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
  };
  twitterCard?: {
    title?: string;
    description?: string;
    image?: string;
  };
}

// ──────────────────────────────────────────────
// Categories & Tags
// ──────────────────────────────────────────────

export interface Category {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// ──────────────────────────────────────────────
// Media
// ──────────────────────────────────────────────

export interface MediaItem {
  id: string;
  workspaceId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  altText?: string;
  caption?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaFolder {
  id: string;
  name: string;
  path: string;
  count: number;
}

// ──────────────────────────────────────────────
// Adapters
// ──────────────────────────────────────────────

export interface AdapterConfig {
  id: string;
  name: string;
  type: 'wordpress' | 'astro' | 'next' | 'meta' | string;
  status: 'active' | 'inactive' | 'available';
  config: Record<string, unknown>;
}

export interface AdapterPublishResult {
  success: boolean;
  adapter: string;
  externalId?: string;
  publishedUrl?: string;
  message: string;
}

// ──────────────────────────────────────────────
// Social
// ──────────────────────────────────────────────

export interface SocialAccount {
  id: string;
  platform: string;
  name: string;
  status: 'connected' | 'disconnected';
}

// ──────────────────────────────────────────────
// Scheduling
// ──────────────────────────────────────────────

export interface ScheduleJob {
  id: string;
  contentId: string;
  targetPlatform: string;
  scheduledTime: string;
  status: 'pending' | 'completed' | 'failed';
  retryCount: number;
}

// ──────────────────────────────────────────────
// Analytics
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
  socialEngagement: {
    totalViews: number;
    totalShares: number;
    totalComments: number;
  };
}

// ──────────────────────────────────────────────
// Notifications
// ──────────────────────────────────────────────

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// ──────────────────────────────────────────────
// AI
// ──────────────────────────────────────────────

export type AIAction = 'title' | 'summary' | 'rewrite' | 'grammar' | 'translation' | 'faq' | 'meta_description' | 'hashtags' | 'cta';

export interface AIGenerateRequest {
  action: AIAction;
  text: string;
}

export interface AIGenerateResponse {
  action: string;
  generatedContent: string;
}

// ──────────────────────────────────────────────
// Settings
// ──────────────────────────────────────────────

export interface AppSettings {
  general: { siteName: string; defaultLocale: string };
  seoDefaults: { defaultTitleSuffix: string; defaultMetaRobots: string };
  aiSettings: { defaultModel: string; autoSuggestKeywords: boolean };
  storageSettings: { provider: string; s3Bucket: string };
  emailSettings: { smtpHost: string; smtpPort: number };
  apiKeys: { id: string; name: string; key: string; createdAt: string }[];
}
