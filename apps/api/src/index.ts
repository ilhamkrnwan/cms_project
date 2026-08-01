import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { healthRoutes } from './routes/health';
import { contentRoutes } from './routes/content';
import { authRoutes } from './routes/auth';
import { workspaceRoutes } from './routes/workspace';
import { categoryRoutes, tagRoutes } from './routes/category';
import { mediaRoutes } from './routes/media';
import { seoRoutes } from './routes/seo';
import { geoRoutes } from './routes/geo';
import { aiRoutes } from './routes/ai';
import { adapterRoutes } from './routes/adapter';
import { socialRoutes } from './routes/social';
import { schedulingRoutes } from './routes/scheduling';
import { analyticsRoutes } from './routes/analytics';
import { notificationRoutes } from './routes/notifications';
import { settingsRoutes } from './routes/settings';
import { usersRoutes } from './routes/users';
import { seedRoutes } from './routes/seed';
import { auth } from './auth';

const port = process.env.PORT || 3000;

const app = new Elysia()
  .use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }))
  .use(swagger({
    documentation: {
      info: {
        title: 'Wontent Content Hub API',
        version: '1.0.0',
        description: 'Bun + Elysia API service for Wontent Content Hub'
      }
    }
  }))
  // Better Auth handler
  .all('/api/auth/*', ({ request }) => auth.handler(request))
  .use(healthRoutes)
  .group('/api/v1', (app) =>
    app
      .use(authRoutes)
      .use(workspaceRoutes)
      .use(usersRoutes)
      .use(categoryRoutes)
      .use(tagRoutes)
      .use(contentRoutes)
      .use(mediaRoutes)
      .use(seoRoutes)
      .use(geoRoutes)
      .use(aiRoutes)
      .use(adapterRoutes)
      .use(socialRoutes)
      .use(schedulingRoutes)
      .use(analyticsRoutes)
      .use(notificationRoutes)
      .use(settingsRoutes)
      .use(seedRoutes)
  )
  .listen(port);

console.log(`🚀 Wontent API server running at http://${app.server?.hostname}:${app.server?.port}`);
console.log(`📖 OpenAPI Docs available at http://${app.server?.hostname}:${app.server?.port}/swagger`);

export type App = typeof app;
