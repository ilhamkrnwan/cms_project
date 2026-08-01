import { Elysia } from 'elysia';

export const healthRoutes = new Elysia({ prefix: '/health' })
  .get('/', () => ({
    status: 'ok',
    service: 'Wontent Content Hub API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  }));
