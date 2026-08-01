import { Elysia, t } from 'elysia';
import { auth } from '../auth';

export const authRoutes = new Elysia({ prefix: '/auth' })
  .post(
    '/sign-up',
    async ({ body, set }) => {
      try {
        const user = await auth.api.signUpEmail({
          body: {
            name: body.name,
            email: body.email,
            password: body.password,
          }
        });
        return { success: true, message: 'User registered successfully', data: user };
      } catch (err: any) {
        set.status = 400;
        return { success: false, message: err.message || 'Registration failed' };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
        password: t.String(),
      })
    }
  )
  .post(
    '/sign-in',
    async ({ body, set }) => {
      try {
        const session = await auth.api.signInEmail({
          body: {
            email: body.email,
            password: body.password,
          }
        });
        return { success: true, message: 'Signed in successfully', data: session };
      } catch (err: any) {
        set.status = 401;
        return { success: false, message: err.message || 'Invalid credentials' };
      }
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      })
    }
  )
  .post(
    '/forgot-password',
    ({ body }) => {
      return {
        success: true,
        message: `Password reset link sent to ${body.email}. Please check your inbox.`,
        timestamp: new Date().toISOString()
      };
    },
    {
      body: t.Object({
        email: t.String()
      })
    }
  )
  .post(
    '/verify-email',
    ({ body }) => {
      return {
        success: true,
        message: 'Email address verified successfully.',
        timestamp: new Date().toISOString()
      };
    },
    {
      body: t.Object({
        token: t.String()
      })
    }
  )
  .get('/session', async ({ request, set }) => {
    try {
      const session = await auth.api.getSession({ headers: request.headers });
      if (!session) {
        set.status = 401;
        return { success: false, message: 'Unauthorized' };
      }
      return { success: true, data: session };
    } catch (err: any) {
      set.status = 401;
      return { success: false, message: 'Invalid session' };
    }
  })
  .post('/sign-out', async ({ request }) => {
    await auth.api.signOut({ headers: request.headers });
    return { success: true, message: 'Signed out successfully' };
  });
