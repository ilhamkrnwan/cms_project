import { Elysia, t } from 'elysia';
import { db } from '../db';
import { category, tag } from '../db/schema';
import { eq } from 'drizzle-orm';

export const categoryRoutes = new Elysia({ prefix: '/categories' })
  .get('/', async () => {
    const list = await db.select().from(category);
    return { success: true, data: list, timestamp: new Date().toISOString() };
  })
  .post(
    '/',
    async ({ body }) => {
      const newCat = {
        id: `cat_${Date.now()}`,
        workspaceId: body.workspaceId || 'ws_default',
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
        description: body.description,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await db.insert(category).values(newCat);
      return { success: true, message: 'Category created successfully', data: newCat };
    },
    {
      body: t.Object({
        name: t.String(),
        workspaceId: t.Optional(t.String()),
        slug: t.Optional(t.String()),
        description: t.Optional(t.String())
      })
    }
  );

export const tagRoutes = new Elysia({ prefix: '/tags' })
  .get('/', async () => {
    const list = await db.select().from(tag);
    return { success: true, data: list, timestamp: new Date().toISOString() };
  })
  .post(
    '/',
    async ({ body }) => {
      const newTag = {
        id: `tag_${Date.now()}`,
        workspaceId: body.workspaceId || 'ws_default',
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await db.insert(tag).values(newTag);
      return { success: true, message: 'Tag created successfully', data: newTag };
    },
    {
      body: t.Object({
        name: t.String(),
        workspaceId: t.Optional(t.String()),
        slug: t.Optional(t.String())
      })
    }
  );
