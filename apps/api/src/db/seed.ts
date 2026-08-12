import { db } from './index';
import { user, workspace, category, tag, content, media, role, permission, rolePermission, organization, organizationMember } from './schema';
import { eq } from 'drizzle-orm';

export async function runSeeder() {
  console.log('🌱 Starting Wontent Database Seeder...');

  // 1. Seed Default Roles
  const rolesList = [
    {
      id: 'role_admin',
      name: 'Administrator',
      slug: 'admin',
      description: 'Full system administration & workspace management permissions.',
      type: 'system' as const,
    },
    {
      id: 'role_editor',
      name: 'Content Editor',
      slug: 'editor',
      description: 'Can create, edit, optimize, and publish articles across connected adapters.',
      type: 'system' as const,
    },
    {
      id: 'role_viewer',
      name: 'Viewer / Reviewer',
      slug: 'viewer',
      description: 'Read-only access to articles, media assets, and SEO reports.',
      type: 'system' as const,
    },
    {
      id: 'role_social_mgr',
      name: 'Social Media Manager',
      slug: 'social_manager',
      description: 'Custom role for broadcasting content directly to connected social accounts.',
      type: 'custom' as const,
    },
  ];

  for (const r of rolesList) {
    await db.insert(role).values(r).onConflictDoNothing();
  }

  // 2. Seed Default Permissions
  const permissionsList = [
    { id: 'p_cnt_create', name: 'Create Content', slug: 'content:create', module: 'Content', description: 'Create draft articles' },
    { id: 'p_cnt_edit', name: 'Edit Content', slug: 'content:edit', module: 'Content', description: 'Edit existing articles' },
    { id: 'p_cnt_delete', name: 'Delete Content', slug: 'content:delete', module: 'Content', description: 'Delete articles' },
    { id: 'p_cnt_publish', name: 'Publish Content', slug: 'content:publish', module: 'Content', description: 'Publish articles to adapters' },
    { id: 'p_med_upload', name: 'Upload Media', slug: 'media:upload', module: 'Media', description: 'Upload media assets' },
    { id: 'p_med_delete', name: 'Delete Media', slug: 'media:delete', module: 'Media', description: 'Remove media assets' },
    { id: 'p_stg_manage', name: 'Manage Settings', slug: 'settings:manage', module: 'Settings', description: 'Configure workspace settings' },
    { id: 'p_usr_manage', name: 'Manage Users', slug: 'users:manage', module: 'Users', description: 'Manage users, roles and access' },
    { id: 'p_soc_publish', name: 'Publish Social', slug: 'social:publish', module: 'Social', description: 'Broadcast to social channels' },
  ];

  for (const p of permissionsList) {
    await db.insert(permission).values(p).onConflictDoNothing();
  }

  // 3. Seed Organization
  await db
    .insert(organization)
    .values({
      id: 'org_1',
      name: 'Wontent Enterprise',
      slug: 'wontent-enterprise',
      plan: 'pro'
    })
    .onConflictDoNothing();

  // 4. Seed Default Admin User
  await db
    .insert(user)
    .values({
      id: 'usr_admin',
      name: 'Admin Apex',
      email: 'admin@wontent.com',
      role: 'admin',
      emailVerified: true
    })
    .onConflictDoNothing();

  await db
    .insert(user)
    .values({
      id: 'usr_editor',
      name: 'Editor User',
      email: 'editor@wontent.com',
      role: 'editor',
      emailVerified: true
    })
    .onConflictDoNothing();

  await db
    .insert(organizationMember)
    .values({
      id: 'om_1',
      organizationId: 'org_1',
      userId: 'usr_admin',
      role: 'admin'
    })
    .onConflictDoNothing();

  await db
    .insert(organizationMember)
    .values({
      id: 'om_2',
      organizationId: 'org_1',
      userId: 'usr_editor',
      role: 'editor'
    })
    .onConflictDoNothing();

  // 5. Seed Default Workspace
  await db
    .insert(workspace)
    .values({
      id: 'ws_default',
      name: 'Apex Digital Enterprise',
      slug: 'apex-digital-enterprise',
      ownerId: 'usr_admin'
    })
    .onConflictDoNothing();

  const workspaceId = 'ws_default';

  // 6. Seed Categories
  const categoriesList = [
    { id: 'cat_tech', name: 'Technology & Cloud', slug: 'technology-cloud', description: 'Cloud infrastructure & modern stack insights', workspaceId },
    { id: 'cat_ai', name: 'AI & Generative Search', slug: 'ai-generative-search', description: 'GEO & LLM optimization strategies', workspaceId },
    { id: 'cat_pub', name: 'Omnichannel Publishing', slug: 'omnichannel-publishing', description: 'Multi-platform content distribution', workspaceId }
  ];

  for (const cat of categoriesList) {
    await db.insert(category).values(cat).onConflictDoNothing();
  }

  // 7. Seed Tags
  const tagsList = [
    { id: 'tag_astro', name: 'Astro 5', slug: 'astro-5', workspaceId },
    { id: 'tag_bun', name: 'Bun & Elysia', slug: 'bun-elysia', workspaceId },
    { id: 'tag_geo', name: 'GEO Search', slug: 'geo-search', workspaceId },
    { id: 'tag_ts', name: 'TypeScript', slug: 'typescript', workspaceId }
  ];

  for (const tg of tagsList) {
    await db.insert(tag).values(tg).onConflictDoNothing();
  }

  // 8. Seed Content Articles
  const articlesList = [
    {
      id: 'cnt_1',
      workspaceId,
      categoryId: 'cat_tech',
      title: 'Building Modern Content Ecosystems with Bun, Elysia, and Astro',
      slug: 'building-modern-content-ecosystems',
      body: `In today's digital landscape, enterprise brands need to distribute content seamlessly across multiple frontend platforms — from WordPress sites to Astro static applications and Next.js portals. Wontent Content Hub provides an end-to-end multi-tenant platform built on Bun, Elysia.js, and Drizzle ORM to manage, analyze, and publish content once, everywhere.`,
      status: 'published' as const,
      publishDate: new Date(),
      seoMetadata: {
        score: 96,
        keywords: ['Bun', 'Elysia', 'Astro', 'Content Hub'],
        readability: 88
      }
    },
    {
      id: 'cnt_2',
      workspaceId,
      categoryId: 'cat_ai',
      title: 'GEO vs SEO: Optimizing Your Enterprise for AI Search Engines',
      slug: 'geo-vs-seo-optimizing-for-ai-search',
      body: `Generative Engine Optimization (GEO) focuses on structuring content so AI engines like ChatGPT, Claude, and Perplexity synthesize your brand facts accurately. Wontent Content Hub provides built-in GEO analysis with automated JSON-LD schemas, entity detection, and Flesch AI readability scoring.`,
      status: 'published' as const,
      publishDate: new Date(),
      seoMetadata: {
        score: 98,
        keywords: ['GEO', 'SEO', 'AI Search', 'Perplexity'],
        readability: 92
      }
    },
    {
      id: 'cnt_3',
      workspaceId,
      categoryId: 'cat_pub',
      title: 'Omnichannel Publishing Architecture: WordPress, Astro, and Social Channels',
      slug: 'omnichannel-publishing-architecture',
      body: `Adapters bridge the gap between headless CMS backends and target publishing destinations. With Wontent Adapter Framework, teams can publish articles to WordPress REST API, dispatch webhooks to Astro static builders, and push updates to Facebook and LinkedIn simultaneously.`,
      status: 'published' as const,
      publishDate: new Date(),
      seoMetadata: {
        score: 94,
        keywords: ['Omnichannel', 'WordPress Adapter', 'Astro Adapter'],
        readability: 85
      }
    }
  ];

  for (const art of articlesList) {
    const existing = await db.select().from(content).where(eq(content.id, art.id));
    if (existing.length === 0) {
      await db.insert(content).values(art);
    }
  }

  console.log('✅ Seeder executed successfully! Roles, permissions, organization, users, workspace, and content created.');
  return { success: true, message: 'Database seeded successfully with Wontent RBAC & User data.' };
}

if (import.meta.main) {
  runSeeder()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Seeder Error:', err);
      process.exit(1);
    });
}
