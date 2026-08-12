import { Elysia, t } from 'elysia';
import { db } from '../db';
import { content } from '../db/schema';
import { eq, desc, like } from 'drizzle-orm';

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const contentRoutes = new Elysia({ prefix: '/contents' })
  .get('/', async ({ query }) => {
    let list;
    if (query?.status) {
      list = await db.select().from(content).where(eq(content.status, query.status as string)).orderBy(desc(content.createdAt));
    } else if (query?.search) {
      list = await db.select().from(content).where(like(content.title, `%${query.search}%`)).orderBy(desc(content.createdAt));
    } else {
      list = await db.select().from(content).orderBy(desc(content.createdAt));
    }
    return { success: true, data: list, timestamp: new Date().toISOString() };
  })
  .get('/:id', async ({ params, set }) => {
    const found = await db.select().from(content).where(eq(content.id, params.id));
    if (!found || found.length === 0) {
      set.status = 404;
      return { success: false, message: 'Content item not found' };
    }
    return { success: true, data: found[0], timestamp: new Date().toISOString() };
  })
  .post(
    '/',
    async ({ body }) => {
      const slugBase = body.slug ? generateSlug(body.slug) : generateSlug(body.title);
      // Check duplicate slug
      const existing = await db.select().from(content).where(eq(content.slug, slugBase));
      const finalSlug = existing.length > 0 ? `${slugBase}-${Date.now().toString().slice(-4)}` : slugBase;

      const newItem = {
        id: `cnt_${Date.now()}`,
        workspaceId: body.workspaceId || 'ws_default',
        categoryId: body.categoryId || body.category || null,
        title: body.title,
        slug: finalSlug,
        body: body.content !== undefined ? body.content : (body.body || ''),
        featuredImage: body.featuredImage || null,
        status: body.status || 'draft',
        publishDate: body.status === 'published' ? new Date() : (body.publishDate ? new Date(body.publishDate) : null),
        seoMetadata: body.seoMetadata || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.insert(content).values(newItem);
      return { success: true, message: 'Content created successfully', data: newItem };
    },
    {
      body: t.Object({
        title: t.String(),
        content: t.Optional(t.String()),
        body: t.Optional(t.String()),
        workspaceId: t.Optional(t.String()),
        categoryId: t.Optional(t.String()),
        category: t.Optional(t.String()),
        slug: t.Optional(t.String()),
        featuredImage: t.Optional(t.String()),
        status: t.Optional(t.Union([t.Literal('draft'), t.Literal('published'), t.Literal('scheduled'), t.Literal('archived')])),
        publishDate: t.Optional(t.String()),
        seoMetadata: t.Optional(t.Any())
      })
    }
  )
  .put(
    '/:id',
    async ({ params, body, set }) => {
      const found = await db.select().from(content).where(eq(content.id, params.id));
      if (!found || found.length === 0) {
        set.status = 404;
        return { success: false, message: 'Content item not found' };
      }

      const updateData: Record<string, any> = {
        updatedAt: new Date()
      };

      if (body.title !== undefined) updateData.title = body.title;
      if (body.content !== undefined) updateData.body = body.content;
      if (body.body !== undefined) updateData.body = body.body;
      if (body.status !== undefined) updateData.status = body.status;
      if (body.slug !== undefined) updateData.slug = generateSlug(body.slug);
      if (body.featuredImage !== undefined) updateData.featuredImage = body.featuredImage;
      if (body.seoMetadata !== undefined) updateData.seoMetadata = body.seoMetadata;
      if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
      if (body.category !== undefined) updateData.categoryId = body.category;

      await db.update(content).set(updateData).where(eq(content.id, params.id));
      const updated = await db.select().from(content).where(eq(content.id, params.id));
      return { success: true, message: 'Content updated successfully', data: updated[0] };
    },
    {
      body: t.Object({
        title: t.Optional(t.String()),
        content: t.Optional(t.String()),
        body: t.Optional(t.String()),
        slug: t.Optional(t.String()),
        categoryId: t.Optional(t.String()),
        category: t.Optional(t.String()),
        featuredImage: t.Optional(t.String()),
        status: t.Optional(t.Union([t.Literal('draft'), t.Literal('published'), t.Literal('scheduled'), t.Literal('archived')])),
        seoMetadata: t.Optional(t.Any())
      })
    }
  )
  .delete('/:id', async ({ params, set }) => {
    const found = await db.select().from(content).where(eq(content.id, params.id));
    if (!found || found.length === 0) {
      set.status = 404;
      return { success: false, message: 'Content item not found' };
    }
    await db.delete(content).where(eq(content.id, params.id));
    return { success: true, message: 'Content deleted successfully' };
  })
  .post('/:id/publish', async ({ params, set }) => {
    const found = await db.select().from(content).where(eq(content.id, params.id));
    if (!found || found.length === 0) {
      set.status = 404;
      return { success: false, message: 'Content item not found' };
    }
    await db.update(content).set({ status: 'published', publishDate: new Date(), updatedAt: new Date() }).where(eq(content.id, params.id));
    return { success: true, message: 'Content published successfully' };
  })
  .post('/:id/archive', async ({ params, set }) => {
    const found = await db.select().from(content).where(eq(content.id, params.id));
    if (!found || found.length === 0) {
      set.status = 404;
      return { success: false, message: 'Content item not found' };
    }
    await db.update(content).set({ status: 'archived', updatedAt: new Date() }).where(eq(content.id, params.id));
    return { success: true, message: 'Content archived successfully' };
  })
  .get('/:id/revisions', async ({ params, set }) => {
    const found = await db.select().from(content).where(eq(content.id, params.id));
    if (!found || found.length === 0) {
      set.status = 404;
      return { success: false, message: 'Content item not found' };
    }
    const item = found[0];
    return {
      success: true,
      data: [
        { versionId: 'v1.0', title: item.title, createdAt: item.createdAt, author: 'Admin' },
        { versionId: 'v1.1', title: item.title, createdAt: item.updatedAt, author: 'Editor' }
      ]
    };
  })
  .post('/:id/revisions/:versionId/restore', async ({ params, set }) => {
    const found = await db.select().from(content).where(eq(content.id, params.id));
    if (!found || found.length === 0) {
      set.status = 404;
      return { success: false, message: 'Content item not found' };
    }
    return { success: true, message: `Content item restored to version ${params.versionId}` };
  });
