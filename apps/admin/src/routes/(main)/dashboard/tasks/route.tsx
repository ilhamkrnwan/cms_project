import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ContentEditor, type ContentItem } from "./-components/content-editor";
import { ContentTable } from "./-components/content-table";

export const Route = createFileRoute("/(main)/dashboard/tasks")({
  component: Page,
});

const INITIAL_ARTICLES: ContentItem[] = [
  {
    id: "cnt_101",
    title: "Panduan Lengkap Optimasi SEO & GEO untuk CMS Modern",
    slug: "panduan-lengkap-optimasi-seo-geo-cms",
    body: "Panduan lengkap langkah demi langkah untuk mengoptimalkan konten website terhadap Google Search dan AI Generative Search Engines seperti ChatGPT & Perplexity.\n\nDalam era digital modern, membuat konten berkualitas saja tidak cukup. Konten harus terstruktur secara rapi agar mudah dipahami baik oleh crawler mesin pencari (SEO) maupun Large Language Model (GEO).\n\n### 1. Struktur Heading yang Disukai AI\nPenggunaan H1, H2, dan H3 yang konsisten membantu LLM mengekstrak poin penting dari artikel Anda.",
    category: "Tutorial",
    tags: ["SEO", "GEO", "CMS"],
    featuredImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
    status: "published",
    adapters: ["WordPress", "Astro", "Facebook"],
    seoScore: 96,
    geoScore: 92,
    publishDate: "2026-08-01 10:30",
    seoMetadata: {
      seoTitle: "Panduan Lengkap Optimasi SEO & GEO CMS Modern 2026",
      metaDescription: "Pelajari cara menulis artikel sekali dan mendistribusikannya ke berbagai platform dengan skor SEO & GEO tinggi.",
      keywords: "cms, seo, geo, wontent",
    },
  },
  {
    id: "cnt_102",
    title: "Strategi Content Marketing dengan Write Once Publish Everywhere",
    slug: "strategi-content-marketing-write-once-publish-everywhere",
    body: "Mengatasi masalah redundansi pembuatan konten di berbagai media sosial dan platform CMS melalui arsitektur adapter Wontent.\n\nTim marketing sering kehabisan waktu karena harus memposting ulang artikel yang sama ke berbagai channel secara manual.",
    category: "Marketing",
    tags: ["Marketing", "MultiPlatform"],
    featuredImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    status: "published",
    adapters: ["WordPress", "Next.js", "LinkedIn"],
    seoScore: 94,
    geoScore: 90,
    publishDate: "2026-07-31 14:15",
    seoMetadata: {
      seoTitle: "Strategi Content Marketing Multi-Platform 2026",
      metaDescription: "Hemat waktu publikasi konten marketing Anda hingga 80% menggunakan Content Hub terpusat.",
      keywords: "content marketing, multi platform, automation",
    },
  },
  {
    id: "cnt_103",
    title: "Cara Integrasi Headless CMS dengan Astro Adapter",
    slug: "cara-integrasi-headless-cms-dengan-astro-adapter",
    body: "Tutorial teknis mengintegrasikan Wontent Content Hub API ke dalam Astro static site generator menggunakan SDK @wontent/sdk.",
    category: "Engineering",
    tags: ["Astro", "SDK", "Headless"],
    featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    status: "scheduled",
    adapters: ["Astro"],
    seoScore: 88,
    geoScore: 85,
    publishDate: "2026-08-02 09:00",
    seoMetadata: {
      seoTitle: "Integrasi Headless CMS Astro Adapter Tutorial",
      metaDescription: "Panduan menghubungkan Astro site dengan Wontent Content Hub API secara mudah.",
      keywords: "astro, headless cms, sdk",
    },
  },
  {
    id: "cnt_104",
    title: "Meningkatkan Readability Konten Menggunakan AI Assistant",
    slug: "meningkatkan-readability-konten-menggunakan-ai-assistant",
    body: "Teknik memanfaatkan AI Assistant untuk memperbaiki struktur tata bahasa, variasi kata, dan skor keterbacaan artikel secara otomatis.",
    category: "AI & Automation",
    tags: ["AI", "Readability"],
    featuredImage: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&q=80",
    status: "draft",
    adapters: ["WordPress", "Facebook"],
    seoScore: 82,
    geoScore: 78,
    publishDate: "",
    seoMetadata: {
      seoTitle: "Meningkatkan Readability Konten dengan AI",
      metaDescription: "Gunakan AI Assistant Wontent untuk meningkatkan kualitas penulisan artikel.",
      keywords: "ai, readability, grammar",
    },
  },
  {
    id: "cnt_105",
    title: "Trend Micro-animations untuk User Experience Web Application",
    slug: "trend-micro-animations-untuk-user-experience",
    body: "Ulasan tren micro-animations pada antarmuka web modern untuk meningkatkan engagement dan pengalaman interaksi pengguna.",
    category: "Design",
    tags: ["Design", "UIUX"],
    featuredImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80",
    status: "archived",
    adapters: ["WordPress"],
    seoScore: 90,
    geoScore: 86,
    publishDate: "2026-07-25 11:20",
    seoMetadata: {
      seoTitle: "Trend Micro-animations untuk User Experience 2026",
      metaDescription: "Analisis micro-animations dan efek interaktif pada antarmuka web modern.",
      keywords: "design, ui, micro animations",
    },
  },
];

function Page() {
  const [articles, setArticles] = useState<ContentItem[]>(INITIAL_ARTICLES);
  const [viewMode, setViewMode] = useState<"list" | "editor">("list");
  const [editingArticle, setEditingArticle] = useState<ContentItem | null>(null);

  // Fetch articles from API server if running
  useEffect(() => {
    fetch("http://localhost:3000/contents")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: ContentItem[] = res.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            body: item.body || "",
            category: item.category || "Tutorial",
            featuredImage: item.featuredImage || "",
            status: item.status || "draft",
            publishDate: item.publishDate ? new Date(item.publishDate).toISOString().slice(0, 16) : "",
            adapters: ["WordPress", "Astro"],
            seoScore: 92,
            geoScore: 88,
            seoMetadata: item.seoMetadata,
          }));
          setArticles(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const handleOpenCreate = () => {
    setEditingArticle(null);
    setViewMode("editor");
  };

  const handleOpenEdit = (item: ContentItem) => {
    setEditingArticle(item);
    setViewMode("editor");
  };

  const handleSaveArticle = (formData: Partial<ContentItem>) => {
    if (editingArticle) {
      setArticles((prev) =>
        prev.map((item) =>
          item.id === editingArticle.id ? ({ ...item, ...formData } as ContentItem) : item
        )
      );

      fetch(`http://localhost:3000/contents/${editingArticle.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }).catch(() => {});
    } else {
      const newItem: ContentItem = {
        id: `cnt_${Date.now()}`,
        title: formData.title || "Untitled Article",
        slug: formData.slug || "untitled-article",
        body: formData.body || "",
        category: formData.category || "Tutorial",
        featuredImage: formData.featuredImage || "",
        status: formData.status || "draft",
        publishDate: formData.publishDate || (formData.status === "published" ? new Date().toLocaleString() : ""),
        adapters: formData.adapters || ["WordPress"],
        seoScore: formData.seoScore || 94,
        geoScore: formData.geoScore || 90,
        seoMetadata: formData.seoMetadata,
        createdAt: new Date().toLocaleString(),
      };
      setArticles((prev) => [newItem, ...prev]);

      fetch("http://localhost:3000/contents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      }).catch(() => {});
    }
    setViewMode("list");
  };

  const handleDeleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((item) => item.id !== id));
    fetch(`http://localhost:3000/contents/${id}`, {
      method: "DELETE",
    }).catch(() => {});
  };

  const handlePublishArticle = (id: string) => {
    setArticles((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "published",
              publishDate: new Date().toLocaleString(),
            }
          : item
      )
    );
    fetch(`http://localhost:3000/contents/${id}/publish`, {
      method: "POST",
    }).catch(() => {});
  };

  const handleArchiveArticle = (id: string) => {
    setArticles((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "archived" } : item
      )
    );
    fetch(`http://localhost:3000/contents/${id}/archive`, {
      method: "POST",
    }).catch(() => {});
  };

  const handleStatusChange = (id: string, newStatus: ContentItem["status"]) => {
    setArticles((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
              publishDate: newStatus === "published" ? new Date().toLocaleString() : item.publishDate,
            }
          : item
      )
    );
    fetch(`http://localhost:3000/contents/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    }).catch(() => {});
  };

  if (viewMode === "editor") {
    return (
      <ContentEditor
        initialData={editingArticle}
        onSave={handleSaveArticle}
        onCancel={() => setViewMode("list")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="size-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Articles & Content Management</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Create, edit, publish, schedule, and distribute articles across connected platform adapters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleOpenCreate} className="rounded-md">
            <Plus className="mr-1.5 size-4" />
            Create Article
          </Button>
        </div>
      </div>

      {/* Content Table & Filter List */}
      <ContentTable
        data={articles}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteArticle}
        onPublish={handlePublishArticle}
        onArchive={handleArchiveArticle}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}


