import { Elysia } from 'elysia';

export const analyticsRoutes = new Elysia({ prefix: '/analytics' })
  .get('/overview', () => ({
    success: true,
    data: {
      totalContents: 42,
      publishedContents: 28,
      scheduledContents: 8,
      draftContents: 6,
      averageSeoScore: 92,
      averageGeoScore: 88,
      totalMediaAssets: 115,
      adapterUsage: [
        { name: 'WordPress', count: 18, percentage: 42.8 },
        { name: 'Facebook', count: 12, percentage: 28.5 },
        { name: 'Astro', count: 7, percentage: 16.6 },
        { name: 'Next.js', count: 5, percentage: 11.9 }
      ],
      socialEngagement: {
        totalViews: 14250,
        totalShares: 1840,
        totalComments: 620
      }
    },
    timestamp: new Date().toISOString()
  }));
