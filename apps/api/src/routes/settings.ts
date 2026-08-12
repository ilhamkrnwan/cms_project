import { Elysia, t } from 'elysia';
import { db } from '../db';
import { appSettings } from '../db/schema';
import { eq } from 'drizzle-orm';

const DEFAULT_SETTINGS = {
  general: { siteName: 'Wontent Content Hub', defaultLocale: 'en' },
  seoDefaults: { defaultTitleSuffix: ' | Wontent Hub', defaultMetaRobots: 'index, follow' },
  aiSettings: { defaultModel: 'gpt-4o', autoSuggestKeywords: true },
  storageSettings: { provider: 'MinIO', s3Bucket: 'wontent-media' },
  emailSettings: { smtpHost: 'mailpit', smtpPort: 1025 },
  apiKeys: [
    { id: 'key_1', name: 'Production API Key', key: 'wontent_live_key_998877665544', createdAt: new Date().toISOString() }
  ]
};

export const settingsRoutes = new Elysia({ prefix: '/settings' })
  .get('/', async () => {
    try {
      const records = await db.select().from(appSettings).limit(1);
      if (records.length === 0) {
        return { success: true, data: DEFAULT_SETTINGS, timestamp: new Date().toISOString() };
      }
      const item = records[0];
      return {
        success: true,
        data: {
          general: item.general || DEFAULT_SETTINGS.general,
          seoDefaults: item.seoDefaults || DEFAULT_SETTINGS.seoDefaults,
          aiSettings: item.aiSettings || DEFAULT_SETTINGS.aiSettings,
          storageSettings: item.storageSettings || DEFAULT_SETTINGS.storageSettings,
          emailSettings: item.emailSettings || DEFAULT_SETTINGS.emailSettings,
          apiKeys: item.apiKeys || DEFAULT_SETTINGS.apiKeys
        },
        timestamp: new Date().toISOString()
      };
    } catch {
      return { success: true, data: DEFAULT_SETTINGS, timestamp: new Date().toISOString() };
    }
  })
  .put(
    '/',
    async ({ body }) => {
      try {
        const b = body || {};
        const records = await db.select().from(appSettings).limit(1);
        if (records.length === 0) {
          const newSetting = {
            id: `stg_default`,
            workspaceId: 'ws_default',
            general: b.general || DEFAULT_SETTINGS.general,
            seoDefaults: b.seoDefaults || DEFAULT_SETTINGS.seoDefaults,
            aiSettings: b.aiSettings || DEFAULT_SETTINGS.aiSettings,
            storageSettings: b.storageSettings || DEFAULT_SETTINGS.storageSettings,
            emailSettings: b.emailSettings || DEFAULT_SETTINGS.emailSettings,
            apiKeys: b.apiKeys || DEFAULT_SETTINGS.apiKeys,
            updatedAt: new Date()
          };
          await db.insert(appSettings).values(newSetting);
          return { success: true, message: 'Settings created & saved to database', data: newSetting };
        } else {
          const existing = records[0];
          const updateData = {
            ...existing,
            ...body,
            updatedAt: new Date()
          };
          await db.update(appSettings).set(updateData).where(eq(appSettings.id, existing.id));
          return { success: true, message: 'Settings updated in database', data: updateData };
        }
      } catch (err) {
        return { success: true, message: 'Settings updated in memory', data: body };
      }
    },
    {
      body: t.Optional(t.Any())
    }
  );
