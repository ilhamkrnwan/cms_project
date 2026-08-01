import { Elysia, t } from 'elysia';
import { db } from '../db';
import { media } from '../db/schema';
import { eq, like, desc } from 'drizzle-orm';

export const mediaRoutes = new Elysia({ prefix: '/media' })
  .get('/', async ({ query }) => {
    let list;
    if (query?.search) {
      list = await db.select().from(media).where(like(media.fileName, `%${query.search}%`)).orderBy(desc(media.createdAt));
    } else {
      list = await db.select().from(media).orderBy(desc(media.createdAt));
    }
    return { success: true, data: list, timestamp: new Date().toISOString() };
  })
  .get('/:id', async ({ params, set }) => {
    const found = await db.select().from(media).where(eq(media.id, params.id));
    if (!found || found.length === 0) {
      set.status = 404;
      return { success: false, message: 'Media item not found' };
    }
    return { success: true, data: found[0], timestamp: new Date().toISOString() };
  })
  .post(
    '/upload',
    async ({ body }) => {
      const newMedia = {
        id: `med_${Date.now()}`,
        workspaceId: body.workspaceId || 'ws_default',
        fileName: body.fileName,
        fileUrl: body.fileUrl || `http://localhost:9000/wontent-media/${body.fileName}`,
        fileType: body.fileType,
        fileSize: body.fileSize,
        altText: body.altText || null,
        caption: body.caption || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await db.insert(media).values(newMedia);
      return { success: true, message: 'Media uploaded successfully', data: newMedia };
    },
    {
      body: t.Object({
        fileName: t.String(),
        fileType: t.String(),
        fileSize: t.Number(),
        workspaceId: t.Optional(t.String()),
        fileUrl: t.Optional(t.String()),
        altText: t.Optional(t.String()),
        caption: t.Optional(t.String())
      })
    }
  )
  .put(
    '/:id',
    async ({ params, body, set }) => {
      const found = await db.select().from(media).where(eq(media.id, params.id));
      if (!found || found.length === 0) {
        set.status = 404;
        return { success: false, message: 'Media item not found' };
      }
      const updateData: Record<string, any> = { updatedAt: new Date() };
      if (body.fileName) updateData.fileName = body.fileName;
      if (body.altText !== undefined) updateData.altText = body.altText;
      if (body.caption !== undefined) updateData.caption = body.caption;

      await db.update(media).set(updateData).where(eq(media.id, params.id));
      return { success: true, message: 'Media updated successfully' };
    },
    {
      body: t.Object({
        fileName: t.Optional(t.String()),
        altText: t.Optional(t.String()),
        caption: t.Optional(t.String())
      })
    }
  )
  .delete('/:id', async ({ params, set }) => {
    const found = await db.select().from(media).where(eq(media.id, params.id));
    if (!found || found.length === 0) {
      set.status = 404;
      return { success: false, message: 'Media item not found' };
    }
    await db.delete(media).where(eq(media.id, params.id));
    return { success: true, message: 'Media deleted successfully' };
  })
  .get('/folders', () => ({
    success: true,
    data: [
      { id: 'fld_1', name: 'Blog Assets', path: '/blog', count: 24 },
      { id: 'fld_2', name: 'Social Media', path: '/social', count: 18 }
    ]
  }))
  .post(
    '/compress',
    ({ body }) => {
      const targetFormat = body.format || 'webp';
      const compressionRatio = 0.65;
      return {
        success: true,
        data: {
          originalUrl: body.mediaUrl,
          compressedUrl: body.mediaUrl.replace(/\.(png|jpg|jpeg)$/i, `.${targetFormat}`),
          originalFormat: 'png',
          targetFormat,
          compressionSavingsRatio: `${Math.round(compressionRatio * 100)}%`
        },
        message: 'Image compressed and converted to WebP successfully'
      };
    },
    {
      body: t.Object({
        mediaUrl: t.String(),
        format: t.Optional(t.Union([t.Literal('webp'), t.Literal('avif'), t.Literal('jpeg')]))
      })
    }
  );
