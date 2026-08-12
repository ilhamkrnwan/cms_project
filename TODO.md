# TODO — Wontent Content Hub

> **Status Pengembangan Aktual berdasarkan audit kode**  
> Last Updated: 2026-08-07

Legend:
- `[x]` — Selesai & functional
- `[~]` — Stub/Mock (ada kode tapi belum real implementation)
- `[/]` — In Progress / Partial
- `[ ]` — Belum dimulai

---

## Phase 0 — Project Foundation ✅

### Repository
- [x] Setup Monorepo (Bun Workspaces)
- [x] Configure TypeScript
- [x] Configure Biome (Linting/Formatting)
- [x] Configure Husky & Commitlint
- [x] Configure Environment Variables (.env)
- [x] Configure Docker Compose (PostgreSQL, MinIO, Mailpit)

### Apps Structure
- [x] Create Admin App (React 19, Vite, TanStack Router, Shadcn UI)
- [x] Create API App (ElysiaJS, Bun, Drizzle ORM)
- [x] Create Compro App (Astro 5)
- [x] Create Web App (Astro 5)
- [x] Create `@wontent/types` package
- [x] Create `@wontent/sdk` package

---

## Phase 1 — Authentication & User Management

### Authentication (Better Auth)
- [x] Better Auth setup with Drizzle adapter
- [x] Email/Password login endpoint
- [x] Register endpoint
- [x] Session management (DB-backed)
- [x] Forgot Password (endpoint real & integrasi email Mailpit)
- [x] Email Verification (endpoint real & integrasi email Mailpit)

### Admin Auth UI
- [x] Login page (v1 & v2 variants terintegrasi API)
- [x] Register page (terintegrasi API)
- [x] Auth guard / protected routes (Session check & redirect)
- [x] Forgot password flow UI
- [x] Email verification & Reset Password UI

### User Management
- [x] Users list API (Query DB real & fallback)
- [x] Roles list API (Query DB real & fallback)
- [x] Permissions list API (Query DB real & fallback)
- [x] Organizations API (Query DB real & fallback)
- [x] DB schema untuk `role`, `permission`, `role_permission`
- [x] DB schema untuk `organization`, `organization_member`
- [x] RBAC middleware di API (`requirePermission`)
- [x] Users management UI (terintegrasi API: list, invite, update role, delete)
- [x] Roles & Permissions management UI (terintegrasi API: list, create, delete)
- [x] Organization/Workspace management API & UI

---

## Phase 2 — Dashboard Core UI

### Layout & Navigation
- [x] Sidebar navigation with groups
- [x] Header with search, theme, layout controls
- [x] Theme switcher (light/dark)
- [x] Account switcher component
- [x] Command Palette / Search Dialog
- [x] Layout controls (sidebar variant, collapsible)
- [x] Responsive design

### Dashboard Overview Page
- [x] MetricCards component (Total Contents, Adapters, SEO Score, GEO Score)
- [x] PerformanceOverview chart
- [x] RecentContentsTable
- [x] **Connect MetricCards ke real API data** (`analyticsApi.overview`)
- [x] **Connect RecentContentsTable ke API `/contents`** (`contentApi.list`)
- [x] **Connect PerformanceOverview ke real analytics** (`analyticsApi.overview`)
- [x] Quick action buttons functional (Create Article, SEO Audit, GEO Engine, Adapters)

### Cleanup Template Pages
- [x] Hapus route `/dashboard/ecommerce`
- [x] Hapus route `/dashboard/finance`
- [x] Hapus route `/dashboard/crm`
- [x] Hapus route `/dashboard/invoice`
- [x] Hapus route `/dashboard/logistics`
- [x] Hapus route `/dashboard/academy`
- [x] Hapus route `/dashboard/productivity`
- [x] Repurpose `/dashboard/kanban` → Content Workflow Board
- [x] Repurpose `/dashboard/infrastructure` → System Health Monitor

---

## Phase 3 — Content Management (🔴 PRIORITY)

### API (Mostly Done)
- [x] Content CRUD endpoints (DB-backed)
- [x] Auto slug generation
- [x] Duplicate slug detection
- [x] Publish/Archive endpoints
- [x] Revisions endpoint (DB-backed & restore logic)
- [x] DB schema `content_revision` untuk real version tracking
- [x] Content filtering/pagination yang proper
- [x] Content search full-text
- [x] Workspace-scoped content queries

### Admin UI
- [x] Content list page (terintegrasi API `/contents`)
- [x] **Content list page connected ke API `/contents`**
- [x] **Content Create page dengan Rich Text Editor**
- [x] **Content Edit page dengan Rich Text Editor**
- [x] **Content delete confirmation dialog**
- [x] **Content status management (Draft → Publish → Archive)**
- [x] **Content preview**
- [x] **Content scheduling UI**
- [x] **Revision history UI**
- [x] **Inline SEO/GEO score panel saat editing**
- [x] Rich Text Editor integration
- [x] Featured image picker (from Media Library)
- [x] Category & Tag selector in content editor
- [x] Bulk actions (delete, publish, archive multiple)

### API Client (`api-client.ts`)
- [x] `getContents()`, `getContent()`, `createContent()` basic methods
- [x] `updateContent()`, `deleteContent()`
- [x] `publishContent()`, `archiveContent()`
- [x] `getRevisions()`, `restoreRevision()`
- [x] Error handling & retry logic
- [x] Authentication headers integration

---

## Phase 4 — Categories & Tags

### API
- [x] Categories CRUD (DB-backed)
- [x] Tags CRUD (DB-backed)

### Admin UI
- [x] Categories & Tags management page
- [x] Connect category/tag ke content editor (Real DB integration)
- [x] Nested categories support

---

## Phase 5 — Media Library

### API
- [x] Media CRUD endpoints (DB-backed)
- [x] Upload metadata endpoint
- [~] Folder management (mock data)
- [~] Image compression/WebP (mock response, no actual processing)
- [ ] **Actual file upload ke MinIO/S3**
- [ ] **Actual image processing (Sharp: resize, compress, WebP convert)**
- [ ] Real folder management (DB-backed)
- [ ] Media replace functionality
- [ ] Presigned URL generation for direct upload
- [ ] Image metadata extraction

### Admin UI
- [x] Media library page
- [ ] **Drag-and-drop file upload**
- [ ] **Image preview & lightbox**
- [ ] **Folder navigation**
- [ ] **Media picker modal (for content editor)**
- [ ] Bulk upload/delete
- [ ] Image editing (crop, resize)

---

## Phase 6 — SEO Engine

### API
- [x] SEO analysis endpoint (functional scoring)
- [x] Heading checker, keyword density, link checks
- [x] Meta preview data
- [~] Sitemap generator (mock)
- [~] Robots.txt generator (mock)
- [ ] Real sitemap XML generation
- [ ] Robots.txt file generation
- [ ] Canonical URL management

### Admin UI
- [x] SEO engine page with scoring UI
- [ ] SEO panel terintegrasi di content editor
- [ ] SERP preview component
- [ ] Keyword suggestions
- [ ] Competitor analysis

---

## Phase 7 — GEO Engine

### API
- [x] GEO analysis endpoint (basic scoring)
- [x] Readability analysis
- [~] Entity detection (mock/basic)
- [~] FAQ suggestions (mock)
- [~] Citation suggestions (mock)
- [ ] Real NLP-based entity extraction
- [ ] AI-powered FAQ generation
- [ ] Structured data (JSON-LD) generator

### Admin UI
- [x] GEO engine page
- [ ] GEO panel terintegrasi di content editor
- [ ] Entity highlighting in editor
- [ ] FAQ editor inline

---

## Phase 8 — AI Assistant

### API
- [~] AI generate endpoint (placeholder logic — string manipulation, bukan real LLM)
- [ ] **Integrasi LLM (OpenAI/Anthropic/Gemini)**
- [ ] AI title generation (real)
- [ ] AI summary generation (real)
- [ ] AI rewrite (real)
- [ ] AI grammar check (real)
- [ ] AI translation (real)
- [ ] AI FAQ generation (real)
- [ ] AI meta description (real)
- [ ] AI hashtag generation (real)
- [ ] AI CTA generation (real)
- [ ] Rate limiting per user
- [ ] Token usage tracking

### Admin UI
- [ ] **AI Assistant panel/sidebar dalam content editor**
- [ ] AI generation dialog/modal
- [ ] AI suggestions inline
- [ ] AI history/undo

---

## Phase 9 — Adapter System

### API Framework
- [x] BaseAdapter abstract class
- [x] Adapter registry (WordPress, Astro, Next.js)
- [x] Publish endpoint
- [~] WordPress Adapter (mock publish, tidak call WP REST API)
- [~] Astro Adapter (mock)
- [~] Next.js Adapter (mock)
- [ ] **Real WordPress REST API integration**
- [ ] **Real webhook/API integration untuk Astro**
- [ ] **Real webhook/API integration untuk Next.js**
- [ ] DB schema `adapter_connection` untuk menyimpan credentials
- [ ] Adapter health check
- [ ] Adapter error handling & retry
- [ ] Publish log/history

### Admin UI
- [x] Adapters list page
- [ ] **Adapter setup wizard (connect WordPress site)**
- [ ] **Adapter connection management (edit/delete/test)**
- [ ] Publish target selector dalam content editor
- [ ] Publish history per adapter

---

## Phase 10 — Social Publishing

### API
- [~] Social accounts list (mock data)
- [~] Social publish endpoint (mock response)
- [ ] **Meta Graph API integration (Facebook/Instagram)**
- [ ] **LinkedIn OAuth & Publishing API**
- [ ] **Telegram Bot API integration**
- [ ] DB schema `social_account` untuk OAuth tokens
- [ ] Social media image format optimization
- [ ] Hashtag management per platform
- [ ] Character limit validation per platform

### Admin UI
- [x] Social channels page
- [ ] **OAuth connect flow (Facebook, Instagram, LinkedIn)**
- [ ] **Social publish composer**
- [ ] **Platform preview (how post will look)**
- [ ] Social post history

---

## Phase 11 — Content Scheduling

### API
- [~] Schedule job CRUD (in-memory array, bukan DB/queue)
- [~] Retry endpoint (mock)
- [ ] **DB schema `schedule_job` untuk persistent scheduling**
- [ ] **Background worker/cron untuk execute scheduled publishes**
- [ ] Content calendar API
- [ ] Recurring publish support
- [ ] Failed job retry mechanism (real)

### Admin UI
- [/] Calendar component ada
- [ ] **Content Calendar connected to API**
- [ ] **Schedule publish flow dari content editor**
- [ ] **Calendar drag-and-drop rescheduling**
- [ ] Schedule queue management UI

---

## Phase 12 — Analytics

### API
- [~] Analytics overview (all hardcoded numbers)
- [ ] **Real aggregation queries ke DB**
- [ ] Content performance metrics
- [ ] Adapter usage statistics
- [ ] Social engagement tracking
- [ ] SEO/GEO score trends
- [ ] Time-series data

### Admin UI
- [x] Analytics page
- [ ] **Connect ke real API data**
- [ ] Chart components dengan real data
- [ ] Date range filtering
- [ ] Export functionality

---

## Phase 13 — Notifications

### API
- [~] Notifications list (mock)
- [~] Webhook endpoint (mock)
- [ ] DB schema `notification`
- [ ] Real email notifications (Mailpit/SMTP)
- [ ] Real Discord webhook integration
- [ ] Real Slack webhook integration
- [ ] In-app notification system (WebSocket/SSE)
- [ ] Notification preferences per user

### Admin UI
- [ ] Notification bell/dropdown
- [ ] Notification center page
- [ ] Notification settings

---

## Phase 14 — Settings

### API
- [~] Settings GET/PUT (in-memory variable, hilang saat restart)
- [ ] **DB schema `settings` per workspace**
- [ ] API key generation & management
- [ ] Storage settings validation
- [ ] Email settings with test send

### Admin UI
- [x] Settings page
- [ ] **Connect ke real API & DB persistence**
- [ ] API key management UI
- [ ] Storage test connection
- [ ] Email test send

---

## Phase 15 — Shared Packages

### `@wontent/types`
- [x] `ApiResponse`, `Workspace`, `ContentItem`, `AdapterConfig`
- [ ] `Category`, `Tag`, `Media`, `MediaFolder`
- [ ] `User`, `Role`, `Permission`, `Organization`
- [ ] `SEOAnalysis`, `GEOAnalysis`
- [ ] `AIGenerateRequest`, `AIGenerateResponse`
- [ ] `ScheduleJob`, `Notification`
- [ ] `Settings`, `SocialAccount`

### `@wontent/sdk`
- [x] Basic content & SEO methods (6 methods)
- [ ] Full Content CRUD (update, delete, publish, archive)
- [ ] Category & Tag methods
- [ ] Media methods
- [ ] Workspace methods
- [ ] AI methods
- [ ] GEO methods
- [ ] Social publishing methods
- [ ] Scheduling methods
- [ ] Settings methods
- [ ] Auth methods

---

## Phase 16 — Quality & DevOps

### Testing
- [ ] Unit tests (API routes)
- [ ] Integration tests (API → DB)
- [ ] Component tests (Admin UI)
- [ ] E2E tests (Playwright/Cypress)

### Security
- [ ] CSRF protection
- [ ] Rate limiting (Elysia plugin)
- [ ] Input sanitization
- [ ] Helmet/security headers
- [ ] SQL injection prevention audit
- [ ] XSS prevention audit

### DevOps
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Staging environment
- [ ] Production Dockerfile optimization
- [ ] Health check endpoints improvement
- [ ] Structured logging (Pino/Winston)
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring

### Documentation
- [x] README.md
- [x] PRD.md
- [x] TODO.md
- [ ] API documentation (beyond Swagger auto-gen)
- [ ] SDK usage guide
- [ ] Deployment guide
- [ ] Contributing guide (update from template)

---

## 🎯 Dashboard Completion Sprint — Prioritized Tasks

> **Fokus utama:** Membuat dashboard admin fungsional dan terhubung ke API

### Sprint 1: Content Management Core (🔴 HIGHEST PRIORITY)
1. [ ] Content list page — fetch dari API `/contents`, tampilkan tabel real
2. [ ] Content create page — form dengan Rich Text Editor
3. [ ] Content edit page — load content, edit, save
4. [ ] Content delete — confirmation dialog + API call
5. [ ] Content status management — draft/publish/archive buttons
6. [ ] Integrate API client dengan semua content endpoints

### Sprint 2: Dashboard Data Connection
7. [ ] MetricCards — fetch real counts dari API
8. [ ] RecentContentsTable — fetch recent contents dari API
9. [ ] PerformanceOverview — fetch real analytics
10. [ ] Quick actions — route to create article, etc.

### Sprint 3: Media Library Functional
11. [ ] Actual file upload ke MinIO (presigned URL / multipart)
12. [ ] Media preview grid/list connected to API
13. [ ] Media picker modal for content editor
14. [ ] Drag and drop upload

### Sprint 4: Integration & Polish
15. [ ] SEO panel inline di content editor
16. [ ] Category & Tag selector di content editor
17. [ ] Template routes cleanup (remove non-CMS pages)
18. [ ] Auth guard integration (redirect to login if not authenticated)
19. [ ] Error boundaries & loading states
20. [ ] Toast notifications for actions

---

## Summary Statistik

| Kategori | Total Fitur | Selesai | Stub/Mock | Partial | Belum Mulai |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Authentication | 11 | 5 | 3 | 2 | 1 |
| Dashboard UI | 10 | 7 | 0 | 3 | 0 |
| Content Management | 16 | 4 | 1 | 2 | 9 |
| Categories & Tags | 4 | 3 | 0 | 0 | 1 |
| Media Library | 12 | 2 | 2 | 0 | 8 |
| SEO Engine | 8 | 4 | 2 | 0 | 2 |
| GEO Engine | 8 | 2 | 3 | 0 | 3 |
| AI Assistant | 14 | 0 | 1 | 0 | 13 |
| Adapter System | 12 | 3 | 3 | 0 | 6 |
| Social Publishing | 10 | 0 | 2 | 0 | 8 |
| Scheduling | 8 | 0 | 2 | 1 | 5 |
| Analytics | 7 | 0 | 1 | 0 | 6 |
| Notifications | 8 | 0 | 2 | 0 | 6 |
| Settings | 5 | 0 | 1 | 0 | 4 |
| Packages | 12 | 2 | 0 | 0 | 10 |
| Quality/DevOps | 16 | 3 | 0 | 0 | 13 |
| **TOTAL** | **~161** | **~35 (22%)** | **~23 (14%)** | **~8 (5%)** | **~95 (59%)** |

> ⚠️ **Kesimpulan:** Sekitar **22% fitur benar-benar fungsional**, 14% berupa stub/mock, dan **59% belum dimulai sama sekali**. TODO.md sebelumnya yang menandai hampir semua `[x]` **tidak akurat** — banyak yang hanya endpoint dengan response mock atau UI tanpa koneksi ke data real.
