import { Elysia, t } from 'elysia';

export interface ScheduleJob {
  id: string;
  contentId: string;
  targetPlatform: string;
  scheduledTime: string;
  status: 'pending' | 'completed' | 'failed';
  retryCount: number;
}

const mockScheduleQueue: ScheduleJob[] = [
  {
    id: 'sch_1',
    contentId: 'cnt_1',
    targetPlatform: 'wordpress',
    scheduledTime: new Date(Date.now() + 3600000).toISOString(),
    status: 'pending',
    retryCount: 0
  }
];

export const schedulingRoutes = new Elysia({ prefix: '/schedules' })
  .get('/', () => ({
    success: true,
    data: mockScheduleQueue,
    timestamp: new Date().toISOString()
  }))
  .post(
    '/',
    ({ body }) => {
      const newJob: ScheduleJob = {
        id: `sch_${Date.now()}`,
        contentId: body.contentId,
        targetPlatform: body.targetPlatform,
        scheduledTime: body.scheduledTime,
        status: 'pending',
        retryCount: 0
      };
      mockScheduleQueue.push(newJob);
      return { success: true, message: 'Publishing job scheduled successfully', data: newJob };
    },
    {
      body: t.Object({
        contentId: t.String(),
        targetPlatform: t.String(),
        scheduledTime: t.String()
      })
    }
  )
  .post('/:id/retry', ({ params, set }) => {
    const job = mockScheduleQueue.find((j) => j.id === params.id);
    if (!job) {
      set.status = 404;
      return { success: false, message: 'Scheduled job not found' };
    }
    job.retryCount += 1;
    job.status = 'pending';
    return { success: true, message: 'Retry initiated for publishing job', data: job };
  });
