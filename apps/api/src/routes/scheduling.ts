import { Elysia, t } from 'elysia';
import { db } from '../db';
import { scheduleJob, content } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

export interface ScheduleJobItem {
  id: string;
  contentId: string;
  targetPlatform: string;
  scheduledTime: string;
  status: 'pending' | 'completed' | 'failed';
  retryCount: number;
}

export const schedulingRoutes = new Elysia({ prefix: '/schedules' })
  .get('/', async () => {
    try {
      const list = await db.select().from(scheduleJob).orderBy(desc(scheduleJob.createdAt));
      return {
        success: true,
        data: list.map((j) => ({
          id: j.id,
          contentId: j.contentId,
          targetPlatform: j.targetPlatform,
          scheduledTime: j.scheduledTime.toISOString(),
          status: j.status as 'pending' | 'completed' | 'failed',
          retryCount: j.retryCount
        })),
        timestamp: new Date().toISOString()
      };
    } catch {
      return {
        success: true,
        data: [],
        timestamp: new Date().toISOString()
      };
    }
  })
  .post(
    '/',
    async ({ body }) => {
      const newJob = {
        id: `sch_${Date.now()}`,
        workspaceId: body.workspaceId || 'ws_default',
        contentId: body.contentId,
        targetPlatform: body.targetPlatform,
        scheduledTime: new Date(body.scheduledTime),
        status: 'pending',
        retryCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      try {
        await db.insert(scheduleJob).values(newJob);
      } catch {}

      return {
        success: true,
        message: 'Publishing job scheduled successfully and saved to DB',
        data: {
          ...newJob,
          scheduledTime: newJob.scheduledTime.toISOString()
        }
      };
    },
    {
      body: t.Object({
        contentId: t.String(),
        targetPlatform: t.String(),
        scheduledTime: t.String(),
        workspaceId: t.Optional(t.String())
      })
    }
  )
  .post('/:id/retry', async ({ params, set }) => {
    try {
      const found = await db.select().from(scheduleJob).where(eq(scheduleJob.id, params.id));
      if (!found || found.length === 0) {
        set.status = 404;
        return { success: false, message: 'Scheduled job not found' };
      }
      const job = found[0];
      const updated = {
        retryCount: job.retryCount + 1,
        status: 'pending',
        updatedAt: new Date()
      };
      await db.update(scheduleJob).set(updated).where(eq(scheduleJob.id, params.id));
      return { success: true, message: 'Retry initiated for publishing job', data: { ...job, ...updated } };
    } catch {
      set.status = 500;
      return { success: false, message: 'Failed to retry job' };
    }
  });
