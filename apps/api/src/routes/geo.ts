import { Elysia, t } from 'elysia';

export const geoRoutes = new Elysia({ prefix: '/geo' })
  .post(
    '/analyze',
    ({ body }) => {
      const content = body.content || '';
      const title = body.title || '';

      // 1. Entity Detection (heuristic extraction of capitalized words/phrases & key terms)
      const words = content.split(/\s+/);
      const entityMatches = content.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g) || [];
      const uniqueEntities = Array.from(new Set(entityMatches)).filter((e) => e.length > 3).slice(0, 10);

      // 2. AI Readability Score (flesch-kincaid estimate)
      const sentences = content.split(/[.!?]+/).filter(Boolean).length || 1;
      const totalWords = words.length || 1;
      const avgSentenceLength = totalWords / sentences;
      const readabilityScore = Math.max(0, Math.min(100, Math.round(206.835 - 1.015 * avgSentenceLength)));

      // 3. FAQ Suggestions
      const faqSuggestions = [
        { question: `What is ${title || 'this article'} about?`, answer: content.slice(0, 150) + '...' },
        { question: 'Who is the target audience?', answer: 'Content writers, marketers, and digital teams.' }
      ];

      // 4. Citation Suggestions
      const citations = uniqueEntities.slice(0, 3).map((ent) => ({
        term: ent,
        recommendation: `Add credible link or source data for "${ent}".`
      }));

      // 5. JSON-LD Schema Suggestion
      const jsonLdSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: content.slice(0, 160),
        author: { '@type': 'Organization', name: 'Wontent Content Hub' }
      };

      // Calculate overall GEO Score
      let geoScore = 80;
      if (uniqueEntities.length >= 3) geoScore += 10;
      if (readabilityScore > 60) geoScore += 10;

      return {
        success: true,
        data: {
          geoScore: Math.min(100, geoScore),
          llmReadiness: geoScore >= 80 ? 'High' : 'Medium',
          readabilityScore,
          detectedEntities: uniqueEntities,
          faqSuggestions,
          citationSuggestions: citations,
          structuredSchema: jsonLdSchema
        },
        timestamp: new Date().toISOString()
      };
    },
    {
      body: t.Object({
        title: t.String(),
        content: t.String()
      })
    }
  );
