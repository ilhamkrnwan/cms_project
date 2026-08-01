# Wontent Content Hub

> **Write once. Publish everywhere.**

Wontent Content Hub adalah platform manajemen konten modern yang dirancang sebagai pusat distribusi konten untuk berbagai website dan platform sosial media. Tidak seperti CMS tradisional, Wontent berperan sebagai **Content Hub**, memungkinkan pengguna menulis konten sekali, mengoptimalkannya menggunakan AI, kemudian mempublikasikannya ke berbagai tujuan seperti WordPress, Astro, Next.js, hingga Meta (Facebook & Instagram) melalui sistem adapter.

## Vision

Menyediakan satu dashboard modern yang mampu mengelola, mengoptimalkan, dan mendistribusikan konten ke berbagai platform tanpa terikat pada satu CMS atau framework tertentu.

## Philosophy

> Content should be created once and delivered everywhere.

Wontent memisahkan proses:

- Menulis konten
- Optimasi SEO & GEO
- Workflow editorial
- Distribusi konten

dari platform tujuan.

Frontend website dapat menggunakan framework apa pun, sedangkan dashboard tetap menjadi satu sumber pengelolaan konten.

---

# Why Wontent?

Saat ini perusahaan sering mengalami workflow seperti berikut:

- Menulis artikel di WordPress.
- Membuat caption Facebook secara manual.
- Menyalin ulang ke Instagram.
- Menulis ulang untuk LinkedIn.
- Membuat thread untuk Threads.
- Mengelola beberapa website dengan dashboard yang berbeda.

Wontent mengubah workflow tersebut menjadi:

```
Write Once
      │
      ▼
AI Optimization
      │
      ▼
Publish Everywhere
```

Satu dashboard.

Satu editor.

Banyak tujuan publish.

---

# Core Features

## Modern Dashboard

Dashboard modern berbasis Next.js dengan pengalaman pengguna yang cepat, responsif, dan mudah digunakan.

Features:

- Authentication
- Organizations
- Workspace
- Rich Text Editor
- Media Library
- Content Draft
- Scheduled Publishing
- Revisions
- Activity Logs

---

## AI Content Assistant

AI membantu pengguna menghasilkan konten yang lebih baik.

Features:

- AI Title Generator
- AI Summary
- Meta Description Generator
- FAQ Generator
- Schema Suggestion
- Internal Link Suggestion
- Content Rewrite
- Multi Platform Rewrite

---

## SEO Optimization

Membantu menghasilkan halaman yang ramah mesin pencari.

Features:

- SEO Score
- Readability Analysis
- Heading Structure
- Meta Preview
- OpenGraph Preview
- Twitter Card Preview
- Canonical Validation
- Schema Recommendation

---

## GEO Optimization

Di era AI Search, konten perlu mudah dipahami oleh Large Language Model.

Wontent menyediakan analisis Generative Engine Optimization (GEO).

Features:

- Entity Detection
- Question Coverage
- FAQ Recommendation
- AI Readability
- Citation Suggestion
- Structured Content Analysis
- AI Search Readiness Score

---

## Multi Platform Publishing

Publish sekali ke berbagai platform.

Supported targets (Roadmap):

- WordPress
- Astro
- Next.js
- Nuxt
- Facebook Page
- Instagram Business
- Threads
- LinkedIn
- Telegram
- WhatsApp Channel
- Google Business Profile

---

## Adapter Architecture

Wontent menggunakan sistem Adapter.

```
           Content
               │
        ┌──────┼──────┐
        │      │      │
   WordPress Astro  Next.js
        │
      Meta
```

Setiap platform memiliki adapter sendiri sehingga dashboard tidak bergantung pada teknologi tertentu.

---

# Architecture

```
apps/
├── admin/
├── api/

packages/
├── sdk/
├── types/
├── adapters/
│   ├── wordpress/
│   ├── astro/
│   ├── next/
│   ├── meta/
│   └── ...
└── ui/
```

---

# Tech Stack

## Frontend

- Next.js
- shadcn/ui
- Tailwind CSS
- React Query
- React Hook Form

## Backend

- Bun
- Elysia
- Drizzle ORM

## Database

- PostgreSQL

## Authentication

- Better Auth

## Storage

- S3 Compatible Storage
- MinIO

---

# Roadmap

## Phase 1

- Authentication
- Dashboard
- Workspace
- Rich Editor
- Media Library
- WordPress Adapter
- SEO Analysis

---

## Phase 2

- Facebook Integration
- Instagram Integration
- AI Rewrite
- Scheduler
- Content Calendar

---

## Phase 3

- Astro Adapter
- Next Adapter
- Nuxt Adapter
- Webhooks
- Plugin System

---

## Phase 4

- GEO Analysis
- AI Content Planner
- Analytics
- Team Collaboration
- Marketplace

---

# Target Users

- Digital Agencies
- Freelancers
- Marketing Teams
- Content Writers
- SEO Specialists
- Startup Teams
- Multi-brand Companies

---

# Future Vision

Wontent bukan sekadar Headless CMS.

Wontent adalah **Content Operating System** yang menjadi pusat pengelolaan, optimasi, kolaborasi, dan distribusi konten ke berbagai platform.

Website hanyalah salah satu tujuan publish.

Media sosial hanyalah tujuan lainnya.

Dengan pendekatan adapter, Wontent dapat berkembang mendukung platform baru tanpa mengubah pengalaman pengguna di dashboard.

---

# Motto

> **Write Once. Optimize with AI. Publish Everywhere.**
