# PRD.md

# Wontent Content Hub

**Version:** 1.0.0

**Status:** Draft

**Author:** Ilham Kurniawan

---

# Product Overview

Wontent Content Hub adalah platform modern untuk mengelola, mengoptimalkan, dan mendistribusikan konten ke berbagai website dan media sosial dari satu dashboard.

Wontent tidak bertujuan menggantikan WordPress atau CMS lain.

Sebaliknya, Wontent menjadi **Content Hub** yang menghubungkan berbagai platform melalui sistem adapter.

Dengan konsep **Write Once, Publish Everywhere**, pengguna cukup membuat konten sekali, kemudian memilih tujuan publikasi seperti WordPress, Astro, Facebook, Instagram, LinkedIn, atau platform lainnya.

---

# Problem Statement

Tim marketing dan content writer sering menghadapi masalah berikut:

- Mengelola banyak website dengan dashboard yang berbeda.
- Menyalin artikel ke berbagai media sosial secara manual.
- Melakukan optimasi SEO secara terpisah.
- Tidak memiliki workflow editorial yang terpusat.
- Sulit menjaga konsistensi konten di semua platform.

Akibatnya proses publikasi menjadi lambat, tidak konsisten, dan memakan banyak waktu.

---

# Vision

Menjadi pusat distribusi konten modern yang mendukung berbagai CMS, website, dan media sosial melalui satu dashboard.

---

# Mission

Membantu individu, freelancer, agensi, dan perusahaan mengelola seluruh proses content marketing dari satu tempat.

---

# Target Users

## Freelancer

Mengelola banyak website klien.

---

## Digital Agency

Mengelola puluhan brand sekaligus.

---

## Startup

Memiliki website, blog, dan sosial media.

---

## Marketing Team

Workflow penulisan hingga publikasi.

---

## SEO Specialist

Optimasi SEO dan GEO.

---

# Product Goals

- Mengurangi waktu publikasi konten.
- Menyediakan dashboard modern.
- Mendukung banyak platform.
- Menggunakan AI untuk meningkatkan kualitas konten.
- Menjadi platform yang dapat dikembangkan melalui adapter.

---

# Non Goals (MVP)

Wontent tidak akan membangun:

- Website Builder
- Page Builder visual
- E-commerce
- CRM
- Email Marketing
- Social Media Analytics mendalam

Fokus awal adalah **Content Management** dan **Content Distribution**.

---

# Core Concepts

## Content

Konten utama yang akan dipublikasikan.

Attributes:

- Title
- Slug
- Content
- Featured Image
- Status
- Publish Date
- SEO Metadata

---

## Workspace

Representasi organisasi atau klien.

Satu pengguna dapat memiliki beberapa workspace.

---

## Adapter

Layer integrasi ke platform eksternal.

Contoh:

- WordPress
- Astro
- Next.js
- Facebook
- Instagram
- LinkedIn

---

## AI Engine

Membantu menghasilkan dan mengoptimalkan konten.

---

# User Flow

## Login

User login menggunakan Better Auth.

↓

Masuk ke Dashboard.

↓

Memilih Workspace.

---

## Create Content

User membuat artikel.

↓

Upload media.

↓

AI memberikan rekomendasi.

↓

SEO Score dihitung.

↓

GEO Score dihitung.

↓

Draft disimpan.

---

## Publish

User memilih target.

☑ WordPress

☑ Facebook

☑ Instagram

↓

Publish.

↓

Adapter mengirim konten ke masing-masing platform.

---

# Functional Requirements

## Authentication

- Login
- Register
- Session
- Workspace
- Roles
- Permissions

---

## Dashboard

- Dashboard Overview
- Recent Content
- Scheduled Content
- Activity

---

## Content

- Create
- Edit
- Delete
- Draft
- Publish
- Archive
- Schedule

---

## Media Library

- Upload
- Folder
- Search
- Replace
- Metadata

---

## SEO

- SEO Title
- Meta Description
- Canonical
- Robots
- OpenGraph
- Twitter Card

---

## GEO

- AI Readability
- Entity Detection
- FAQ Suggestion
- Citation Suggestion
- AI Search Readiness

---

## AI

- Rewrite
- Summary
- Translation
- Meta Description
- FAQ
- CTA
- Hashtag
- Keywords

---

## Adapters

### WordPress

- Publish
- Update
- Delete
- Upload Media
- Sync Categories
- Sync Tags

---

### Meta

- Facebook Page
- Instagram Business

---

### Astro

- API Publish

---

### Next.js

- API Publish

---

# Non Functional Requirements

## Performance

Dashboard load < 2 detik.

---

## Security

- Better Auth
- CSRF Protection
- Rate Limiting
- Secure Cookies

---

## Scalability

Adapter harus dapat ditambahkan tanpa mengubah core system.

---

## Extensibility

Plugin system pada roadmap.

---

# Technical Stack

## Frontend

- Next.js
- shadcn/ui
- Tailwind CSS

---

## Backend

- Bun
- Elysia

---

## Database

- PostgreSQL

---

## ORM

- Drizzle ORM

---

## Authentication

- Better Auth

---

## Storage

- MinIO
- Amazon S3 Compatible

---

# MVP Scope

Versi pertama hanya mencakup:

- Authentication
- Workspace
- Content CRUD
- Media Library
- SEO Analyzer
- WordPress Adapter
- Facebook Publishing
- AI Rewrite
- Scheduler

---

# Success Metrics

- Konten berhasil dipublikasikan ke WordPress.
- Konten berhasil dipublikasikan ke Facebook.
- Waktu publikasi kurang dari 1 menit.
- SEO Score tersedia sebelum publish.
- Minimal 90% proses publish berhasil tanpa error.

---

# Future Roadmap

## V1

AI Content Hub

WordPress Adapter

Facebook Integration

---

## V2

Instagram

LinkedIn

Threads

---

## V3

Astro Adapter

Next Adapter

Nuxt Adapter

---

## V4

Plugin Marketplace

Analytics

Workflow Approval

Team Collaboration

---

# Product Principles

- API First
- Adapter Based
- AI Assisted
- Platform Agnostic
- Performance Focus
- Security by Default
- Developer Friendly

---

# Product Motto

> **Write Once. Optimize with AI. Publish Everywhere.**
