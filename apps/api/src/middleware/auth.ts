import { Elysia } from 'elysia';
import { auth } from '../auth';

export const requireAuth = new Elysia({ name: 'require-auth' })
  .onBeforeHandle(async ({ request, set }) => {
    try {
      const session = await auth.api.getSession({ headers: request.headers });
      if (!session) {
        set.status = 401;
        return {
          success: false,
          message: 'Unauthorized access. Valid authentication session required.',
          error: 'UNAUTHORIZED'
        };
      }
    } catch {
      set.status = 401;
      return {
        success: false,
        message: 'Unauthorized access. Valid authentication session required.',
        error: 'UNAUTHORIZED'
      };
    }
  });
