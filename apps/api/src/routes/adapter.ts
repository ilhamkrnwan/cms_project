import { Elysia, t } from 'elysia';

export interface PublishPayload {
  title: string;
  content: string;
  slug?: string;
  featuredImage?: string;
}

export interface AdapterResponse {
  success: boolean;
  adapter: string;
  externalId?: string;
  publishedUrl?: string;
  message: string;
}

export abstract class BaseAdapter {
  abstract name: string;
  abstract publish(payload: PublishPayload, config: Record<string, any>): Promise<AdapterResponse>;
}

export class WordPressAdapter extends BaseAdapter {
  name = 'wordpress';
  async publish(payload: PublishPayload, config: Record<string, any>): Promise<AdapterResponse> {
    const siteUrl = config.siteUrl || 'https://example-wordpress.com';
    return {
      success: true,
      adapter: 'wordpress',
      externalId: `wp_post_${Date.now()}`,
      publishedUrl: `${siteUrl}/${payload.slug || 'post'}`,
      message: `Content published successfully to WordPress site at ${siteUrl}`
    };
  }
}

export class AstroAdapter extends BaseAdapter {
  name = 'astro';
  async publish(payload: PublishPayload, config: Record<string, any>): Promise<AdapterResponse> {
    const endpoint = config.apiUrl || 'https://astro-site.com/api/webhooks/content';
    return {
      success: true,
      adapter: 'astro',
      externalId: `astro_doc_${Date.now()}`,
      publishedUrl: `${config.siteUrl || 'https://astro-site.com'}/blog/${payload.slug || 'post'}`,
      message: `Content dispatched to Astro API webhook at ${endpoint}`
    };
  }
}

export class NextAdapter extends BaseAdapter {
  name = 'next';
  async publish(payload: PublishPayload, config: Record<string, any>): Promise<AdapterResponse> {
    return {
      success: true,
      adapter: 'next',
      externalId: `next_page_${Date.now()}`,
      publishedUrl: `${config.siteUrl || 'https://next-site.com'}/posts/${payload.slug || 'post'}`,
      message: 'Content published to Next.js Application endpoint'
    };
  }
}

const adapters: Record<string, BaseAdapter> = {
  wordpress: new WordPressAdapter(),
  astro: new AstroAdapter(),
  next: new NextAdapter()
};

export const adapterRoutes = new Elysia({ prefix: '/adapters' })
  .get('/', () => ({
    success: true,
    data: [
      { id: 'wordpress', name: 'WordPress Adapter', type: 'cms', status: 'available' },
      { id: 'astro', name: 'Astro Adapter', type: 'static_site', status: 'available' },
      { id: 'next', name: 'Next.js Adapter', type: 'framework', status: 'available' }
    ],
    timestamp: new Date().toISOString()
  }))
  .post(
    '/publish',
    async ({ body, set }) => {
      const adapterInstance = adapters[body.targetAdapter];
      if (!adapterInstance) {
        set.status = 400;
        return { success: false, message: `Unsupported adapter: ${body.targetAdapter}` };
      }

      const result = await adapterInstance.publish(
        {
          title: body.title,
          content: body.content,
          slug: body.slug,
          featuredImage: body.featuredImage
        },
        body.config || {}
      );

      return { success: true, data: result };
    },
    {
      body: t.Object({
        targetAdapter: t.Union([t.Literal('wordpress'), t.Literal('astro'), t.Literal('next')]),
        title: t.String(),
        content: t.String(),
        slug: t.Optional(t.String()),
        featuredImage: t.Optional(t.String()),
        config: t.Optional(t.Any())
      })
    }
  );
