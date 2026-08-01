import { Elysia, t } from 'elysia';

export const usersRoutes = new Elysia({ prefix: '/users' })
  .get('/', () => ({
    success: true,
    data: [
      { id: 'usr_1', name: 'Admin User', email: 'admin@wontent.com', role: 'admin', organization: 'Wontent Org', createdAt: new Date().toISOString() },
      { id: 'usr_2', name: 'Editor User', email: 'editor@wontent.com', role: 'editor', organization: 'Wontent Org', createdAt: new Date().toISOString() }
    ],
    timestamp: new Date().toISOString()
  }))
  .get('/roles', () => ({
    success: true,
    data: [
      { id: 'role_admin', name: 'Admin', permissions: ['*'] },
      { id: 'role_editor', name: 'Editor', permissions: ['content:create', 'content:edit', 'content:publish', 'media:upload'] },
      { id: 'role_viewer', name: 'Viewer', permissions: ['content:view'] }
    ]
  }))
  .get('/permissions', () => ({
    success: true,
    data: [
      'content:create', 'content:edit', 'content:delete', 'content:publish',
      'media:upload', 'media:delete',
      'settings:manage', 'users:manage'
    ]
  }))
  .get('/organizations', () => ({
    success: true,
    data: [
      { id: 'org_1', name: 'Wontent Enterprise', plan: 'pro', membersCount: 12, createdAt: new Date().toISOString() }
    ]
  }));
