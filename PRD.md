# PRD — Wontent Content Hub

> **Write Once. Optimize with AI. Publish Everywhere.**

**Version:** 1.0.0-alpha  
**Status:** In Development  
**Author:** Ilham Kurniawan  
**Last Updated:** 2026-08-07  

---

## 1. Product Overview

Wontent Content Hub adalah platform manajemen dan distribusi konten modern berbasis Headless CMS / Content Hub. Platform ini memungkinkan pengguna membuat konten sekali, mengoptimalkannya menggunakan AI (SEO & GEO), dan mempublikasikannya ke berbagai website (WordPress, Astro, Next.js) serta media sosial (Facebook, Instagram, LinkedIn, dll) melalui sistem adapter modular.

**Konsep Inti:** Wontent bukan pengganti WordPress/CMS lain, melainkan **Content Hub** yang menghubungkan berbagai platform melalui arsitektur adapter.

---

## 2. Problem Statement

Tim marketing dan content writer menghadapi:

- Mengelola banyak website dengan dashboard yang berbeda-beda
- Menyalin artikel ke berbagai media sosial secara manual
- Melakukan optimasi SEO secara terpisah di setiap platform
- Tidak memiliki workflow editorial yang terpusat
- Sulit menjaga konsistensi konten di semua platform
- Tidak memiliki insight terpadu mengenai performa konten

---

## 3. Target Users

| Persona | Kebutuhan |
| :--- | :--- |
| **Freelancer** | Kelola banyak website klien dari satu dashboard |
| **Digital Agency** | Kelola puluhan brand sekaligus dengan tim |
| **Startup** | Website, blog, dan sosial media dalam satu alur |
| **Marketing Team** | Workflow penulisan → review → publikasi |
| **SEO Specialist** | Optimasi SEO & GEO dengan analitik real-time |

---

## 4. Tech Stack

### Monorepo (Bun Workspaces)

| App | Stack | Port | Deskripsi |
| :--- | :--- | :--- | :--- |
| `admin` | React 19, Vite, TanStack Router, Tailwind CSS v4, Shadcn UI | 5173 | Dashboard Admin |
| `api` | ElysiaJS, Bun, Drizzle ORM, Better Auth, PostgreSQL | 3000 | REST API Service |
| `compro` | Astro 5, Tailwind CSS | 4321 | Company Profile Website |
| `web` | Astro 5, `@wontent/sdk` | 4322 | Client Blog/Frontend |

| Package | Deskripsi |
| :--- | :--- |
| `@wontent/types` | Shared TypeScript type definitions |
| `@wontent/sdk` | TypeScript SDK untuk konsumsi API |

### Infrastructure (Docker Compose)

- **PostgreSQL 16** — Primary Database
- **MinIO** — S3-Compatible Object Storage
- **Mailpit** — Local Mail Testing

---

## 5. Functional Requirements & Status Implementasi

### 5.1 Authentication & User Management

| Fitur | API | Admin UI | Status |
| :--- | :--- | :--- | :--- |
| Login (Email/Password) | ✅ Better Auth | ✅ Auth pages (v1/v2) | **Implemented** |
| Register | ✅ Better Auth | ✅ Auth pages | **Implemented** |
| Session Management | ✅ Better Auth | ⚠️ Partial | **Partial** — Session di admin belum fully integrated |
| Forgot Password | ✅ Better Auth | ⚠️ UI ada, flow belum | **Partial** |
| Email Verification | ✅ Better Auth | ❌ Belum terintegrasi | **Stub** |
| Roles & Permissions | ⚠️ Mock data only | ⚠️ UI ada, mock data | **Stub** — Tidak ada DB schema untuk roles |
| Organization / Multi-tenant | ⚠️ Mock data only | ❌ Belum ada UI | **Stub** |

### 5.2 Dashboard

| Fitur | API | Admin UI | Status |
| :--- | :--- | :--- | :--- |
| Layout (Sidebar, Header, Theme) | — | ✅ Lengkap | **Implemented** |
| Dashboard Overview | ⚠️ Static analytics | ✅ MetricCards, PerformanceOverview | **Partial** — Data hardcoded |
| Recent Content Table | ⚠️ Static JSON | ✅ RecentContentsTable | **Partial** — Belum fetch dari API |
| Command Palette / Search | — | ✅ SearchDialog | **Implemented** (UI only) |
| Theme Switcher | — | ✅ ThemeSwitcher | **Implemented** |

### 5.3 Content Management

| Fitur | API | Admin UI | Status |
| :--- | :--- | :--- | :--- |
| Create Content | ✅ POST `/contents` | ⚠️ Button ada, form belum | **API Done, UI Partial** |
| Edit Content | ✅ PUT `/contents/:id` | ❌ Belum ada editor page | **API Done, UI Missing** |
| Delete Content | ✅ DELETE `/contents/:id` | ❌ Belum terintegrasi | **API Done, UI Missing** |
| Content List | ✅ GET `/contents` | ⚠️ Tasks page (template-based) | **Partial** — UI belum fetch API |
| Publish | ✅ POST `/contents/:id/publish` | ❌ Belum ada UI flow | **API Done, UI Missing** |
| Archive | ✅ POST `/contents/:id/archive` | ❌ Belum ada UI flow | **API Done, UI Missing** |
| Schedule | ✅ Via scheduling routes | ❌ Belum ada UI flow | **API Done, UI Missing** |
| Auto Slug | ✅ Di API | — | **Implemented** |
| Duplicate Slug Detection | ✅ Di API | — | **Implemented** |
| Rich Text Editor | — | ❌ Belum ada | **Not Started** |
| Revisions | ⚠️ Mock revisions data | ❌ Belum ada UI | **Stub** |

### 5.4 Categories & Tags

| Fitur | API | Admin UI | Status |
| :--- | :--- | :--- | :--- |
| CRUD Categories | ✅ DB-backed | ✅ UI page ada | **Implemented** |
| CRUD Tags | ✅ DB-backed | ✅ UI page ada | **Implemented** |

### 5.5 Media Library

| Fitur | API | Admin UI | Status |
| :--- | :--- | :--- | :--- |
| Upload (metadata only) | ✅ DB-backed | ✅ UI page ada | **Partial** — Belum actual file upload ke MinIO |
| List & Search | ✅ DB-backed | ✅ UI page ada | **Implemented** |
| Folder Management | ⚠️ Mock data | ❌ Belum di UI | **Stub** |
| Image Compression/WebP | ⚠️ Mock response | ❌ Belum di UI | **Stub** — Tidak ada actual Sharp/compression |
| Replace Media | ❌ | ❌ | **Not Started** |

### 5.6 SEO Engine

| Fitur | API | Admin UI | Status |
| :--- | :--- | :--- | :--- |
| SEO Analyzer | ✅ Functional logic | ✅ UI page ada | **Implemented** |
| SEO Score Calculation | ✅ Basic scoring | ✅ Display | **Implemented** |
| Meta Preview | ⚠️ Partial | ⚠️ Partial | **Partial** |
| Sitemap/Robots Generator | ⚠️ Mock | ❌ | **Stub** |

### 5.7 GEO Engine

| Fitur | API | Admin UI | Status |
| :--- | :--- | :--- | :--- |
| GEO Score | ✅ Basic scoring | ✅ UI page ada | **Implemented** |
| AI Readability | ✅ Logic ada | ⚠️ Partial display | **Partial** |
| Entity/FAQ/Citation | ⚠️ Mock suggestions | ⚠️ Partial | **Stub** |

### 5.8 AI Assistant

| Fitur | API | Admin UI | Status |
| :--- | :--- | :--- | :--- |
| AI Generate (title, summary, rewrite, etc.) | ⚠️ Placeholder logic | ❌ Belum ada dedicated UI | **Stub** — Tidak call LLM sebenarnya |
| AI Integration (OpenAI/etc.) | ❌ | — | **Not Started** |

### 5.9 Adapter System

| Fitur | API | Admin UI | Status |
| :--- | :--- | :--- | :--- |
| Adapter Interface/Registry | ✅ Class-based | ✅ UI list page | **Partial** — Publish adalah mock |
| WordPress Adapter | ⚠️ Mock publish | ✅ Listed di UI | **Stub** — Tidak connect ke WP nyata |
| Astro Adapter | ⚠️ Mock publish | ✅ Listed | **Stub** |
| Next.js Adapter | ⚠️ Mock publish | ✅ Listed | **Stub** |
| Adapter Configuration UI | — | ❌ Belum ada | **Not Started** |

### 5.10 Social Publishing

| Fitur | API | Admin UI | Status |
| :--- | :--- | :--- | :--- |
| Social Accounts List | ⚠️ Mock data | ✅ UI page ada | **Stub** |
| Publish to Facebook | ⚠️ Mock response | ❌ No actual integration | **Stub** |
| Publish to Instagram | ⚠️ Mock response | ❌ | **Stub** |
| LinkedIn/Threads/Telegram | ⚠️ Mock response | ❌ | **Stub** |
| OAuth Flows | ❌ | ❌ | **Not Started** |

### 5.11 Scheduling

| Fitur | API | Admin UI | Status |
| :--- | :--- | :--- | :--- |
| Schedule Job (CRUD) | ⚠️ In-memory mock | ❌ Calendar page empty | **Stub** — Tidak ada real job queue |
| Content Calendar | — | ⚠️ Calendar component ada | **Partial** — Tidak connected |
| Retry Failed Publish | ⚠️ Mock | ❌ | **Stub** |
| Cron/Background Worker | ❌ | — | **Not Started** |

### 5.12 Analytics

| Fitur | API | Admin UI | Status |
| :--- | :--- | :--- | :--- |
| Dashboard Overview Stats | ⚠️ All hardcoded | ✅ UI ada | **Stub** — Tidak query DB |
| Content Analytics | ⚠️ Hardcoded | ✅ UI page ada | **Stub** |
| Social Engagement | ⚠️ Hardcoded | ⚠️ Partial | **Stub** |

### 5.13 Notifications

| Fitur | API | Admin UI | Status |
| :--- | :--- | :--- | :--- |
| In-App Notifications | ⚠️ Mock data | ❌ | **Stub** |
| Discord/Slack Webhook | ⚠️ Mock response | ❌ | **Stub** |
| Email Notifications | ❌ Belum integrasi SMTP | ❌ | **Not Started** |

### 5.14 Settings

| Fitur | API | Admin UI | Status |
| :--- | :--- | :--- | :--- |
| Settings CRUD | ⚠️ In-memory variable | ✅ UI page ada | **Partial** — Tidak persist ke DB |
| API Keys Management | ⚠️ Mock | ⚠️ UI partial | **Stub** |

---

## 6. Non-Functional Requirements

| Requirement | Status |
| :--- | :--- |
| Dashboard load < 2 detik | ⚠️ Belum benchmark |
| CSRF Protection | ❌ Belum implemented |
| Rate Limiting | ❌ Belum implemented |
| Secure Cookies | ⚠️ Better Auth default |
| Input Validation | ⚠️ Partial (Elysia `t.Object`) |
| Error Handling Global | ❌ Belum ada error boundary |
| Logging | ❌ Belum ada structured logging |
| Testing | ❌ Belum ada unit/integration test |
| CI/CD | ❌ Belum ada pipeline |

---

## 7. Database Schema Gap Analysis

### Yang Sudah Ada (Drizzle Schema)
- `user`, `session`, `account`, `verification` (Better Auth)
- `workspace`, `category`, `tag`, `content`, `content_tag`, `media`

### Yang Belum Ada (Dibutuhkan)
- `role`, `permission`, `user_role` — untuk RBAC
- `organization`, `organization_member` — untuk multi-tenant
- `content_revision` — untuk version history nyata
- `adapter_connection` — untuk menyimpan adapter configs
- `social_account` — untuk OAuth tokens social media
- `schedule_job` — untuk persistent scheduling
- `notification` — untuk in-app notifications
- `settings` — untuk persistent settings per workspace
- `media_folder` — untuk folder management
- `api_key` — untuk API key management
- `audit_log` — untuk activity log

---

## 8. Admin Dashboard Gap: Non-CMS Template Pages

Dashboard admin berisi beberapa route yang merupakan **template bawaan** dan **tidak relevan** dengan Wontent CMS:

| Route | Deskripsi | Rekomendasi |
| :--- | :--- | :--- |
| `/dashboard/ecommerce` | E-commerce template | Hapus atau repurpose |
| `/dashboard/finance` | Finance template | Hapus |
| `/dashboard/crm` | CRM template | Hapus |
| `/dashboard/kanban` | Kanban board template | Repurpose → Content Workflow |
| `/dashboard/invoice` | Invoice template | Hapus |
| `/dashboard/logistics` | Logistics template | Hapus |
| `/dashboard/infrastructure` | Infrastructure monitor | Repurpose → System Health |
| `/dashboard/academy` | Academy/LMS template | Hapus |
| `/dashboard/productivity` | Productivity template | Hapus |

---

## 9. Packages Gap Analysis

### `@wontent/types`
- **Hanya 3 interface:** `ApiResponse`, `Workspace`, `ContentItem`, `AdapterConfig`
- **Belum ada:** `Category`, `Tag`, `Media`, `User`, `Role`, `Permission`, `Organization`, `SEOMetadata`, `GEOResult`, `AIGenerateRequest`, `ScheduleJob`, `Notification`, `Settings`

### `@wontent/sdk`
- **Hanya 6 method:** `getHealth`, `getContents`, `getContent`, `createContent`, `analyzeSeo`, `publishAdapter`
- **Belum ada:** Media, Category, Tag, Workspace CRUD, AI, GEO, Social, Scheduling, Settings, Auth

---

## 10. MVP Scope (Prioritas v1.0)

Fitur yang harus **benar-benar functional** untuk MVP:

1. ✅ Authentication (Login/Register) — Better Auth
2. ⚠️ Dashboard Overview — Perlu connect ke real data
3. ⚠️ Content CRUD Full Cycle — API done, **UI editor belum ada**
4. ⚠️ Media Library — Perlu actual MinIO upload
5. ✅ SEO Analyzer — Functional
6. ❌ WordPress Adapter — Perlu real API integration
7. ❌ Facebook Publishing — Perlu Meta Graph API
8. ❌ AI Rewrite — Perlu LLM integration
9. ❌ Content Scheduler — Perlu background worker
10. ⚠️ Settings — Perlu DB persistence

---

## 11. Success Metrics

| Metric | Target |
| :--- | :--- |
| Content publish ke WordPress | < 1 menit |
| Content publish ke Facebook | < 1 menit |
| SEO Score tersedia pre-publish | Ya |
| Publish success rate | ≥ 90% |
| Dashboard load time | < 2 detik |

---

## 12. Future Roadmap

| Version | Fitur |
| :--- | :--- |
| **v1.0** | Content CRUD, Media, SEO, WordPress Adapter, Facebook |
| **v2.0** | Instagram, LinkedIn, Threads, Content Calendar |
| **v3.0** | Astro/Next.js real adapters, Multi-tenant |
| **v4.0** | Plugin Marketplace, Analytics, Workflow Approval |
