import { Elysia, t } from 'elysia';

let globalSettings = {
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
  .get('/', () => ({
    success: true,
    data: globalSettings,
    timestamp: new Date().toISOString()
  }))
  .put(
    '/',
    ({ body }) => {
      globalSettings = { ...globalSettings, ...body };
      return { success: true, message: 'Settings updated successfully', data: globalSettings };
    },
    {
      body: t.Optional(t.Any())
    }
  );
