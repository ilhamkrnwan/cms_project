import { Elysia } from 'elysia';
import { auth } from '../auth';
import { db } from '../db';
import { user, role, permission, rolePermission } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export function requirePermission(requiredPermission: string) {
  return new Elysia({ name: `rbac-${requiredPermission}` })
    .onBeforeHandle(async ({ request, set }) => {
      try {
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session || !session.user) {
          set.status = 401;
          return { success: false, message: 'Authentication required.', error: 'UNAUTHORIZED' };
        }

        const userRoleSlug = (session.user as any).role || 'editor';

        // Admins always have full access
        if (userRoleSlug === 'admin') {
          return;
        }

        // Check if role has the requested permission in DB
        const roleRecords = await db.select().from(role).where(eq(role.slug, userRoleSlug));
        if (roleRecords.length === 0) {
          set.status = 403;
          return { success: false, message: 'Forbidden: Invalid role assignment.', error: 'FORBIDDEN' };
        }

        const targetRole = roleRecords[0];
        const permissionRecords = await db
          .select()
          .from(permission)
          .where(eq(permission.slug, requiredPermission));

        if (permissionRecords.length === 0) {
          return; // Allow if permission schema not defined
        }

        const targetPerm = permissionRecords[0];
        const hasPerm = await db
          .select()
          .from(rolePermission)
          .where(
            and(
              eq(rolePermission.roleId, targetRole.id),
              eq(rolePermission.permissionId, targetPerm.id)
            )
          );

        if (hasPerm.length === 0) {
          set.status = 403;
          return {
            success: false,
            message: `Forbidden: Missing required permission [${requiredPermission}].`,
            error: 'FORBIDDEN'
          };
        }
      } catch (err) {
        set.status = 500;
        return { success: false, message: 'Internal server error in RBAC check.' };
      }
    });
}
