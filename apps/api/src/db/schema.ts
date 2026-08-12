import { pgTable, text, integer, timestamp, boolean, jsonb, primaryKey } from 'drizzle-orm/pg-core';

// Better Auth Schema
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  role: text('role').notNull().default('editor'), // admin | editor | viewer
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  idToken: text('id_token'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Domain Schemas: Workspace, Category, Tag, Content, Media
export const workspace = pgTable('workspace', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  ownerId: text('owner_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const category = pgTable('category', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspace.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const tag = pgTable('tag', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspace.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const content = pgTable('content', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspace.id, { onDelete: 'cascade' }),
  categoryId: text('category_id').references(() => category.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  body: text('body').notNull(),
  featuredImage: text('featured_image'),
  status: text('status').notNull().default('draft'), // draft | published | scheduled | archived
  publishDate: timestamp('publish_date'),
  seoMetadata: jsonb('seo_metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const contentRevision = pgTable('content_revision', {
  id: text('id').primaryKey(),
  contentId: text('content_id').notNull().references(() => content.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  body: text('body').notNull(),
  version: text('version').notNull(),
  authorId: text('author_id').references(() => user.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const contentTag = pgTable('content_tag', {
  contentId: text('content_id').notNull().references(() => content.id, { onDelete: 'cascade' }),
  tagId: text('tag_id').notNull().references(() => tag.id, { onDelete: 'cascade' }),
}, (t) => [
  primaryKey({ columns: [t.contentId, t.tagId] })
]);

export const mediaFolder = pgTable('media_folder', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspace.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  path: text('path').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const media = pgTable('media', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspace.id, { onDelete: 'cascade' }),
  folderId: text('folder_id').references(() => mediaFolder.id, { onDelete: 'set null' }),
  fileName: text('file_name').notNull(),
  fileUrl: text('file_url').notNull(),
  fileType: text('file_type').notNull(),
  fileSize: integer('file_size').notNull(),
  altText: text('alt_text'),
  caption: text('caption'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const adapterConnection = pgTable('adapter_connection', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspace.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  type: text('type').notNull(), // wordpress | astro | next
  status: text('status').notNull().default('active'),
  config: jsonb('config').notNull(), // siteUrl, apiKey, credentials
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const socialAccount = pgTable('social_account', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspace.id, { onDelete: 'cascade' }),
  platform: text('platform').notNull(), // facebook | instagram | linkedin | telegram
  name: text('name').notNull(),
  status: text('status').notNull().default('connected'),
  credentials: jsonb('credentials'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const scheduleJob = pgTable('schedule_job', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspace.id, { onDelete: 'cascade' }),
  contentId: text('content_id').notNull().references(() => content.id, { onDelete: 'cascade' }),
  targetPlatform: text('target_platform').notNull(),
  scheduledTime: timestamp('scheduled_time').notNull(),
  status: text('status').notNull().default('pending'), // pending | completed | failed
  retryCount: integer('retry_count').notNull().default(0),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const notification = pgTable('notification', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspace.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const appSettings = pgTable('app_settings', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspace.id, { onDelete: 'cascade' }),
  general: jsonb('general'),
  seoDefaults: jsonb('seo_defaults'),
  aiSettings: jsonb('ai_settings'),
  storageSettings: jsonb('storage_settings'),
  emailSettings: jsonb('email_settings'),
  apiKeys: jsonb('api_keys'),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// RBAC & Organization Schemas
export const role = pgTable('role', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  type: text('type').notNull().default('custom'), // system | custom
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const permission = pgTable('permission', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  module: text('module').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const rolePermission = pgTable('role_permission', {
  id: text('id').primaryKey(),
  roleId: text('role_id').notNull().references(() => role.id, { onDelete: 'cascade' }),
  permissionId: text('permission_id').notNull().references(() => permission.id, { onDelete: 'cascade' }),
});

export const organization = pgTable('organization', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  plan: text('plan').notNull().default('pro'),
  logo: text('logo'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const organizationMember = pgTable('organization_member', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('editor'),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

