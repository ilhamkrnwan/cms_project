import { Elysia, t } from 'elysia';
import { db } from '../db';
import { workspace } from '../db/schema';
import { eq } from 'drizzle-orm';

export const workspaceRoutes = new Elysia({ prefix: '/workspaces' })
  .get('/', async () => {
    const list = await db.select().from(workspace);
    return { success: true, data: list, timestamp: new Date().toISOString() };
  })
  .get('/:id', async ({ params, set }) => {
    const found = await db.select().from(workspace).where(eq(workspace.id, params.id));
    if (!found || found.length === 0) {
      set.status = 404;
      return { success: false, message: 'Workspace not found' };
    }
    return { success: true, data: found[0], timestamp: new Date().toISOString() };
  })
  .post(
    '/',
    async ({ body }) => {
      const newWs = {
        id: `ws_${Date.now()}`,
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
        ownerId: body.ownerId || 'usr_default',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await db.insert(workspace).values(newWs);
      return { success: true, message: 'Workspace created successfully', data: newWs };
    },
    {
      body: t.Object({
        name: t.String(),
        ownerId: t.Optional(t.String()),
        slug: t.Optional(t.String()),
      })
    }
  );
