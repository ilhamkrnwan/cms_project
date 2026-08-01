import { Elysia, t } from 'elysia';

export const aiRoutes = new Elysia({ prefix: '/ai' })
  .post(
    '/generate',
    ({ body }) => {
      const action = body.action;
      const text = body.text || '';
      let result = '';

      switch (action) {
        case 'title':
          result = `10 Ultimate Insights on: ${text.slice(0, 40)}`;
          break;
        case 'summary':
          result = `Summary: ${text.slice(0, 120)}... Key take-aways included.`;
          break;
        case 'rewrite':
          result = `Enhanced: ${text.replace(/\b(good|bad|big)\b/gi, 'exceptional')}`;
          break;
        case 'grammar':
          result = text.trim();
          break;
        case 'faq':
          result = JSON.stringify([
            { q: `What are the key points of ${text.slice(0, 20)}?`, a: text.slice(0, 100) }
          ]);
          break;
        case 'meta_description':
          result = `Discover how ${text.slice(0, 80)} enhances productivity. Learn more today!`;
          break;
        case 'hashtags':
          result = '#Wontent #ContentMarketing #SEO #AI #DigitalMarketing';
          break;
        case 'cta':
          result = 'Ready to publish everywhere? Get started with Wontent Content Hub today!';
          break;
        default:
          result = text;
      }

      return {
        success: true,
        data: {
          action,
          generatedContent: result
        },
        timestamp: new Date().toISOString()
      };
    },
    {
      body: t.Object({
        action: t.Union([
          t.Literal('title'),
          t.Literal('summary'),
          t.Literal('rewrite'),
          t.Literal('grammar'),
          t.Literal('translation'),
          t.Literal('faq'),
          t.Literal('meta_description'),
          t.Literal('hashtags'),
          t.Literal('cta')
        ]),
        text: t.String()
      })
    }
  );
