# Wontent Content Hub

> **Write once. Publish everywhere.**

**Wontent Content Hub** adalah platform manajemen dan distribusi konten modern berbasis Headless / Content Hub. Platform ini memungkinkan pengguna untuk membuat konten sekali, mengoptimalkannya menggunakan kecerdasan buatan (SEO & GEO), dan mempublikasikannya ke berbagai website (WordPress, Astro, Next.js) serta media sosial (Meta, LinkedIn, dll) melalui sistem adapter.

---

## 🚀 Fitur Utama

- **Centralized Content Management**: Kelola artikel, draf, revisi, jadwal rilis, serta taksonomi (kategori & tag) dari satu tempat.
- **Modern Admin Dashboard**: UI/UX cepat dan responsif menggunakan React 19, TanStack Router, Shadcn UI, dan Tailwind CSS v4.
- **High-Performance API Engine**: Backend super cepat berbasis Bun, ElysiaJS, Drizzle ORM, dan PostgreSQL.
- **Authentication & Multi-Tenant**: Sistem autentikasi aman dengan Better Auth, mendukung manajemen Organization & Workspace.
- **Media Library**: Layanan manajemen media terintegrasi S3/MinIO dengan dukungan kompresi & konversi WebP.
- **SEO & GEO Engine**: Analisis SEO real-time dan optimasi *Generative Engine Optimization* (GEO) agar konten siap untuk pencarian berbasis AI (LLM).
- **Multi-Platform Adapters (Publish Everywhere)**: Arsitektur adapter modular untuk mempublikasikan konten ke berbagai CMS eksternal dan platform media sosial.
- **TypeScript SDK**: `@wontent/sdk` untuk integrasi cepat frontend (Astro, React, Next.js, Vue).

---

## 🛠️ Tech Stack & Ekosistem

Monorepo ini dikelola menggunakan **Bun Workspaces**:

### Apps (`/apps`)
| Application | Tech Stack | Port | Deskripsi |
| :--- | :--- | :--- | :--- |
| **`admin`** | React 19, Vite, TanStack Router, Tailwind CSS v4, Shadcn UI | `5173` | Dashboard Admin tempat pengelolaan & penulisan konten |
| **`api`** | ElysiaJS, Bun, Drizzle ORM, Better Auth, PostgreSQL | `3000` | REST API service, Auth, & Swagger Docs (`/swagger`) |
| **`compro`** | Astro 5, Tailwind CSS | `4321` | Website Company Profile Wontent |
| **`web`** | Astro 5, `@wontent/sdk` | `4322` | Client Frontend / Blog Website konsumen |

### Packages (`/packages`)
| Package | Deskripsi |
| :--- | :--- |
| **`@wontent/sdk`** | SDK TypeScript resmi untuk mengonsumsi API Wontent |
| **`@wontent/types`** | Shared TypeScript Type Definition untuk seluruh aplikasi |

### Infrastructure (`docker-compose.yml`)
- **Database**: PostgreSQL 16
- **Object Storage**: MinIO (S3-compatible)
- **Local Mail Testing**: Mailpit

---

## 📁 Struktur Direktori

```text
cms_project/
├── apps/
│   ├── admin/          # Frontend Dashboard Admin (Vite + React)
│   ├── api/            # Backend API Service (ElysiaJS + Bun)
│   ├── compro/         # Company Profile Website (Astro)
│   └── web/            # Public Client App (Astro)
├── packages/
│   ├── sdk/            # Wontent Client SDK
│   └── types/          # Shared TypeScript Interfaces & Types
├── docs/               # Dokumentasi Teknis, PRD, & Roadmap
├── docker-compose.yml  # Pengaturan layanan PostgreSQL, MinIO, Mailpit
└── package.json        # Root Workspace Configuration
```

---

## 🏎️ Panduan Memulai (Getting Started)

### Prasyarat (Prerequisites)
- [Bun](https://bun.sh/) (v1.1+)
- [Docker](https://www.docker.com/) & Docker Compose

### 1. Clone & Install Dependencies

```bash
# Clone repository
git clone <repository-url>
cd cms_project

# Install seluruh dependencies di monorepo
bun install
```

### 2. Environment Variables

Salin `.env.example` menjadi `.env` di root repository:

```bash
cp .env.example .env
```

### 3. Jalankan Service Infrastructure (Docker)

Jalankan database PostgreSQL, MinIO storage, dan Mailpit:

```bash
bun docker:up
# Atau: docker compose up -d
```

### 4. Database Setup & Migration

Jalankan migrasi database dan seeding data awal:

```bash
# Generate dan Push Schema Drizzle
bun --filter @wontent/api db:push

# (Opsional) Seed data awal
bun --filter @wontent/api db:seed
```

### 5. Jalankan Mode Development

Untuk menjalankan seluruh aplikasi secara bersamaan:

```bash
bun dev
```

Atau jalankan aplikasi tertentu secara spesifik:

```bash
# Admin Dashboard saja (port 5173)
bun dev:admin

# API Server saja (port 3000)
bun dev:api

# Company Profile (port 4321)
bun dev:compro
```

---

## 📜 Available Scripts

| Script | Deskripsi |
| :--- | :--- |
| `bun dev` | Jalankan semua aplikasi secara paralel |
| `bun build` | Build seluruh aplikasi untuk produksi |
| `bun typecheck` | Validasi tipe TypeScript di seluruh workspace |
| `bun docker:up` | Jalankan Docker Compose (PostgreSQL, MinIO, Mailpit) |
| `bun docker:down` | Matikan seluruh kontainer Docker |

---

## 📑 Dokumentasi Lanjutan

Dokumentasi detail mengenai spesifikasi produk dan roadmap pengembang dapat ditemukan di folder `docs/`:

- [Product Requirement Document (PRD)](file:///c:/KAIRAV/project/cms_project/docs/PRD.md)
- [Technical Overview Docs](file:///c:/KAIRAV/project/cms_project/docs/README.md)
- [Development TODO & Roadmap](file:///c:/KAIRAV/project/cms_project/docs/TODO.md)

---

## 📄 Lisensi

Private & Confidential — Wontent Team.
