import type { BoardState, Column, TaskOwnerProfile, TaskTeam } from "./types";

export const columns = [
  { id: "drafts", title: "Draft Articles" },
  { id: "editorial_review", title: "Editorial Review" },
  { id: "scheduled", title: "Scheduled Publish" },
  { id: "published", title: "Published Live" },
] as const satisfies readonly Column[];

export const columnIds = columns.map((column) => column.id);

export const tagTones: Record<TaskTeam, string> = {
  Backend: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  Data: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Design: "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300",
  Docs: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  "Finance Ops": "bg-teal-500/10 text-teal-700 dark:text-teal-300",
  Platform: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  Product: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
  QA: "bg-red-500/10 text-red-700 dark:text-red-300",
  Security: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
};

const taskOwners = {
  arham: {
    name: "Arham Khan",
    tone: "[&_[data-slot=avatar-fallback]]:bg-zinc-100 [&_[data-slot=avatar-fallback]]:text-zinc-700 after:border-zinc-200 dark:[&_[data-slot=avatar-fallback]]:bg-zinc-500/15 dark:[&_[data-slot=avatar-fallback]]:text-zinc-300 dark:after:border-zinc-500/20",
  },
  budi: {
    name: "Budi Santoso",
    tone: "[&_[data-slot=avatar-fallback]]:bg-lime-100 [&_[data-slot=avatar-fallback]]:text-lime-700 after:border-lime-200 dark:[&_[data-slot=avatar-fallback]]:bg-lime-500/15 dark:[&_[data-slot=avatar-fallback]]:text-lime-300 dark:after:border-lime-500/20",
  },
  siti: {
    name: "Siti Rahma",
    tone: "[&_[data-slot=avatar-fallback]]:bg-indigo-100 [&_[data-slot=avatar-fallback]]:text-indigo-700 after:border-indigo-200 dark:[&_[data-slot=avatar-fallback]]:bg-indigo-500/15 dark:[&_[data-slot=avatar-fallback]]:text-indigo-300 dark:after:border-indigo-500/20",
  },
  dewi: {
    name: "Dewi Lestari",
    tone: "[&_[data-slot=avatar-fallback]]:bg-fuchsia-100 [&_[data-slot=avatar-fallback]]:text-fuchsia-700 after:border-fuchsia-200 dark:[&_[data-slot=avatar-fallback]]:bg-fuchsia-500/15 dark:[&_[data-slot=avatar-fallback]]:text-fuchsia-300 dark:after:border-fuchsia-500/20",
  },
} satisfies Record<string, TaskOwnerProfile>;

export const initialBoard: BoardState = {
  drafts: [
    {
      id: "cnt-draft-1",
      title: "Optimizing Astro 5 Static Site Generation with Bun",
      description: "Draft article exploring build performance improvements for enterprise Astro 5 deployment.",
      priority: "High",
      dueDate: "Aug 15",
      progress: 30,
      owner: taskOwners.budi,
      team: "Product",
      insights: [
        { label: "SEO Score", count: 85 },
        { label: "GEO Score", count: 90 },
      ],
    },
    {
      id: "cnt-draft-2",
      title: "Deep Dive into Multi-Tenant MinIO S3 Image Asset Management",
      description: "Technical guide on configuring bucket policies and presigned URLs in Wontent Media Library.",
      priority: "Medium",
      dueDate: "Aug 18",
      progress: 50,
      owner: taskOwners.arham,
      team: "Backend",
      insights: [
        { label: "SEO Score", count: 78 },
        { label: "GEO Score", count: 82 },
      ],
    },
  ],
  editorial_review: [
    {
      id: "cnt-review-1",
      title: "GEO vs SEO: Optimizing Content for Perplexity & ChatGPT Search",
      description: "Editorial review for structured JSON-LD entity detection and AI readability metrics.",
      priority: "High",
      dueDate: "Aug 14",
      progress: 80,
      owner: taskOwners.siti,
      team: "Data",
      insights: [
        { label: "SEO Score", count: 98 },
        { label: "GEO Score", count: 95 },
      ],
    },
  ],
  scheduled: [
    {
      id: "cnt-sched-1",
      title: "WordPress REST Adapter Integration & Webhook Sync Guide",
      description: "Scheduled to publish live to corporate blog and cross-post to LinkedIn API.",
      priority: "Medium",
      dueDate: "Aug 16",
      progress: 100,
      owner: taskOwners.dewi,
      team: "Docs",
      insights: [
        { label: "SEO Score", count: 94 },
        { label: "Adapters", count: 3 },
      ],
    },
  ],
  published: [
    {
      id: "cnt-pub-1",
      title: "Building Modern Content Ecosystems with Bun, Elysia, and Astro",
      description: "Published live to Wontent Compro & Enterprise Client Blog.",
      priority: "High",
      dueDate: "Aug 07",
      progress: 100,
      owner: taskOwners.arham,
      team: "Product",
      insights: [
        { label: "SEO Score", count: 96 },
        { label: "Views", count: 1240 },
      ],
    },
  ],
};
