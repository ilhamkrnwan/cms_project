import { Elysia, t } from 'elysia';

export const seoRoutes = new Elysia({ prefix: '/seo' })
  .post(
    '/analyze',
    ({ body }) => {
      const title = body.title || '';
      const content = body.content || '';
      const metaDescription = body.metaDescription || '';
      const focusKeyword = body.focusKeyword?.toLowerCase() || '';

      const checks: Array<{ name: string; status: 'pass' | 'warning' | 'fail'; message: string }> = [];
      let score = 100;

      // 1. Title Length Check (Optimal: 40 - 60 chars)
      if (title.length >= 40 && title.length <= 60) {
        checks.push({ name: 'Title Length', status: 'pass', message: `Title length is optimal (${title.length} chars).` });
      } else if (title.length > 0 && title.length < 40) {
        checks.push({ name: 'Title Length', status: 'warning', message: `Title is a bit short (${title.length} chars, recommended: 40-60).` });
        score -= 10;
      } else {
        checks.push({ name: 'Title Length', status: 'fail', message: 'Title is missing or too long.' });
        score -= 20;
      }

      // 2. Meta Description Check (Optimal: 120 - 160 chars)
      if (metaDescription.length >= 120 && metaDescription.length <= 160) {
        checks.push({ name: 'Meta Description', status: 'pass', message: `Meta description length is optimal (${metaDescription.length} chars).` });
      } else if (metaDescription.length > 0) {
        checks.push({ name: 'Meta Description', status: 'warning', message: `Meta description length is ${metaDescription.length} chars (recommended: 120-160).` });
        score -= 10;
      } else {
        checks.push({ name: 'Meta Description', status: 'fail', message: 'Meta description is missing.' });
        score -= 20;
      }

      // 3. Keyword Density Check
      if (focusKeyword) {
        const text = `${title} ${content}`.toLowerCase();
        const matches = (text.match(new RegExp(focusKeyword, 'g')) || []).length;
        const totalWords = text.split(/\s+/).length || 1;
        const density = Number(((matches / totalWords) * 100).toFixed(2));

        if (density >= 1 && density <= 3) {
          checks.push({ name: 'Keyword Density', status: 'pass', message: `Keyword "${focusKeyword}" density is ${density}% (optimal).` });
        } else {
          checks.push({ name: 'Keyword Density', status: 'warning', message: `Keyword density is ${density}% (recommended: 1-3%).` });
          score -= 10;
        }
      }

      // 4. Heading Structure Check
      const hasH1 = /<h1[^>]*>.*?<\/h1>/i.test(content) || title.length > 0;
      const hasH2 = /<h2[^>]*>.*?<\/h2>/i.test(content) || /##\s+/.test(content);
      if (hasH1 && hasH2) {
        checks.push({ name: 'Heading Hierarchy', status: 'pass', message: 'Content contains structured subheadings (H1, H2).' });
      } else {
        checks.push({ name: 'Heading Hierarchy', status: 'warning', message: 'Add H2 subheadings to improve readability.' });
        score -= 10;
      }

      return {
        success: true,
        data: {
          seoScore: Math.max(0, score),
          checks,
          openGraphPreview: {
            title: title || 'Title Preview',
            description: metaDescription || 'Description preview...',
            url: body.canonicalUrl || 'https://example.com/page',
            type: 'article'
          },
          twitterCardPreview: {
            card: 'summary_large_image',
            title: title || 'Title Preview',
            description: metaDescription || 'Description preview...'
          }
        },
        timestamp: new Date().toISOString()
      };
    },
    {
      body: t.Object({
        title: t.String(),
        content: t.String(),
        metaDescription: t.Optional(t.String()),
        focusKeyword: t.Optional(t.String()),
        canonicalUrl: t.Optional(t.String())
      })
    }
  )
  .get('/sitemap', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>http://localhost:3000/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
  })
  .get('/robots.txt', () => {
    const txt = `User-agent: *
Allow: /
Sitemap: http://localhost:3000/seo/sitemap`;
    return new Response(txt, { headers: { 'Content-Type': 'text/plain' } });
  });
