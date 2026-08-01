import { db } from './index';
import { user, workspace, category, tag, content, media } from './schema';
import { eq } from 'drizzle-orm';

export async function runSeeder() {
  console.log('🌱 Starting Wontent Database Seeder...');

  // 1. Seed Default Admin User
  await db
    .insert(user)
    .values({
      id: 'usr_admin',
      name: 'Admin Apex',
      email: 'admin@apexdigital.lab',
      emailVerified: true
    })
    .onConflictDoNothing();

  // 2. Seed Default Workspace
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

  // 3. Seed Categories
  const categoriesList = [
    { id: 'cat_tech', name: 'Technology & Cloud', slug: 'technology-cloud', description: 'Cloud infrastructure & modern stack insights', workspaceId },
    { id: 'cat_ai', name: 'AI & Generative Search', slug: 'ai-generative-search', description: 'GEO & LLM optimization strategies', workspaceId },
    { id: 'cat_pub', name: 'Omnichannel Publishing', slug: 'omnichannel-publishing', description: 'Multi-platform content distribution', workspaceId }
  ];

  for (const cat of categoriesList) {
    await db.insert(category).values(cat).onConflictDoNothing();
  }

  // 4. Seed Tags
  const tagsList = [
    { id: 'tag_astro', name: 'Astro 5', slug: 'astro-5', workspaceId },
    { id: 'tag_bun', name: 'Bun & Elysia', slug: 'bun-elysia', workspaceId },
    { id: 'tag_geo', name: 'GEO Search', slug: 'geo-search', workspaceId },
    { id: 'tag_ts', name: 'TypeScript', slug: 'typescript', workspaceId }
  ];

  for (const tg of tagsList) {
    await db.insert(tag).values(tg).onConflictDoNothing();
  }

  // 5. Seed Content Articles for Compro
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

  // 6. Seed Media Assets
  const mediaList = [
    {
      id: 'med_1',
      workspaceId,
      fileName: 'hero-banner-cloud.png',
      fileUrl: 'http://localhost:9000/wontent-media/hero-banner-cloud.png',
      fileType: 'image/png',
      fileSize: 1048576,
      altText: 'Apex Cloud Architecture Banner',
      caption: 'Cloud Infrastructure Diagram'
    },
    {
      id: 'med_2',
      workspaceId,
      fileName: 'geo-analyzer-dashboard.png',
      fileUrl: 'http://localhost:9000/wontent-media/geo-analyzer-dashboard.png',
      fileType: 'image/png',
      fileSize: 856000,
      altText: 'GEO Engine Analytics Dashboard',
      caption: 'AI Search Readiness Score Card'
    }
  ];

  for (const med of mediaList) {
    const existing = await db.select().from(media).where(eq(media.id, med.id));
    if (existing.length === 0) {
      await db.insert(media).values(med);
    }
  }

  console.log('✅ Seeder executed successfully! Admin user, default workspace, categories, tags, articles, and media created.');
  return { success: true, message: 'Database seeded successfully with initial Wontent & Compro data.' };
}

if (import.meta.main) {
  runSeeder()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Seeder Error:', err);
      process.exit(1);
    });
}
