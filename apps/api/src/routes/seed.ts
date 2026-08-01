import { Elysia } from 'elysia';
import { runSeeder } from '../db/seed';

export const seedRoutes = new Elysia({ prefix: '/seed' })
  .post('/', async ({ set }) => {
    try {
      const result = await runSeeder();
      return result;
    } catch (err: any) {
      set.status = 500;
      return { success: false, message: err.message || 'Seeding failed' };
    }
  });
