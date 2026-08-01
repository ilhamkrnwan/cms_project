import { Elysia, t } from 'elysia';

export const socialRoutes = new Elysia({ prefix: '/social' })
  .get('/accounts', () => ({
    success: true,
    data: [
      { id: 'acc_fb', platform: 'facebook', name: 'Wontent Official Facebook Page', status: 'connected' },
      { id: 'acc_ig', platform: 'instagram', name: '@wontenthub Business', status: 'connected' },
      { id: 'acc_li', platform: 'linkedin', name: 'Wontent Inc Company Page', status: 'connected' },
      { id: 'acc_tg', platform: 'telegram', name: '@wontent_announcements Bot', status: 'connected' }
    ],
    timestamp: new Date().toISOString()
  }))
  .post(
    '/publish',
    async ({ body, set }) => {
      const { platform, text, mediaUrl } = body;
      const validPlatforms = ['facebook', 'instagram', 'linkedin', 'threads', 'telegram', 'whatsapp'];

      if (!validPlatforms.includes(platform)) {
        set.status = 400;
        return { success: false, message: `Unsupported social platform: ${platform}` };
      }

      return {
        success: true,
        data: {
          platform,
          postId: `social_${platform}_${Date.now()}`,
          status: 'published',
          publishedAt: new Date().toISOString(),
          details: `Post published to ${platform}. Media attached: ${mediaUrl ? 'Yes' : 'No'}`
        }
      };
    },
    {
      body: t.Object({
        platform: t.String(),
        text: t.String(),
        mediaUrl: t.Optional(t.String())
      })
    }
  );
