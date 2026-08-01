import { Elysia, t } from 'elysia';

export const notificationRoutes = new Elysia({ prefix: '/notifications' })
  .get('/', () => ({
    success: true,
    data: [
      { id: 'notif_1', type: 'publish_success', title: 'Content Published', message: 'Article successfully published to WordPress.', read: false, createdAt: new Date().toISOString() },
      { id: 'notif_2', type: 'ai_complete', title: 'AI Rewrite Finished', message: 'AI Content Assistant generated 3 title variations.', read: true, createdAt: new Date().toISOString() }
    ],
    timestamp: new Date().toISOString()
  }))
  .post(
    '/webhook',
    ({ body }) => {
      const { provider, webhookUrl, message } = body;
      return {
        success: true,
        data: {
          provider,
          webhookUrl,
          sentMessage: message,
          status: 'delivered',
          timestamp: new Date().toISOString()
        }
      };
    },
    {
      body: t.Object({
        provider: t.Union([t.Literal('discord'), t.Literal('slack')]),
        webhookUrl: t.String(),
        message: t.String()
      })
    }
  );
