import { useEffect, useState } from "react";
import { Eye, Globe, Loader2, MoreHorizontal, Plus, Search, Sparkles } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { contentApi } from "@/lib/api-client";

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: "published" | "scheduled" | "draft" | "archived";
  adapters: string[];
  seoScore: number;
  geoScore: number;
  date: string;
}

const FALLBACK_ARTICLES: ArticleItem[] = [
  {
    id: "cnt_101",
    title: "Panduan Lengkap Optimasi SEO & GEO untuk CMS Modern",
    slug: "panduan-lengkap-optimasi-seo-geo-cms",
    category: "Tutorial",
    status: "published",
    adapters: ["WordPress", "Astro", "Facebook"],
    seoScore: 96,
    geoScore: 92,
    date: "2026-08-01 10:30",
  },
  {
    id: "cnt_102",
    title: "Strategi Content Marketing dengan Write Once Publish Everywhere",
    slug: "strategi-content-marketing-write-once-publish-everywhere",
    category: "Marketing",
    status: "published",
    adapters: ["WordPress", "Next.js", "LinkedIn"],
    seoScore: 94,
    geoScore: 90,
    date: "2026-07-31 14:15",
  },
  {
    id: "cnt_103",
    title: "Cara Integrasi Headless CMS dengan Astro Adapter",
    slug: "cara-integrasi-headless-cms-dengan-astro-adapter",
    category: "Engineering",
    status: "scheduled",
    adapters: ["Astro"],
    seoScore: 88,
    geoScore: 85,
    date: "2026-08-02 09:00",
  },
  {
    id: "cnt_104",
    title: "Meningkatkan Readability Konten Menggunakan AI Assistant",
    slug: "meningkatkan-readability-konten-menggunakan-ai-assistant",
    category: "AI & Automation",
    status: "draft",
    adapters: ["WordPress", "Meta"],
    seoScore: 82,
    geoScore: 78,
    date: "2026-07-30 16:45",
  },
  {
    id: "cnt_105",
    title: "Trend Micro-animations untuk User Experience Web Application",
    slug: "trend-micro-animations-untuk-user-experience",
    category: "Design",
    status: "archived",
    adapters: ["WordPress"],
    seoScore: 90,
    geoScore: 86,
    date: "2026-07-25 11:20",
  },
];

const statusStyles: Record<ArticleItem["status"], { label: string; className: string }> = {
  published: {
    label: "Published",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  draft: {
    label: "Draft",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  archived: {
    label: "Archived",
    className: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  },
};

export function RecentContentsTable() {
  const [articles, setArticles] = useState<ArticleItem[]>(FALLBACK_ARTICLES);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    contentApi
      .list()
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: ArticleItem[] = res.data.slice(0, 10).map((item: any) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            category: item.categoryId || "General",
            status: item.status || "draft",
            adapters: ["WordPress", "Astro"],
            seoScore: 92,
            geoScore: 88,
            date: item.createdAt
              ? new Date(item.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
          }));
          setArticles(mapped);
        }
      })
      .catch(() => {
        // fallback to mock data
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Contents & Articles</CardTitle>
          <CardDescription>Manage articles, publication status, SEO/GEO scores, and target adapters</CardDescription>
        </div>
        <CardAction className="flex items-center gap-2">
          <Button size="sm" onClick={() => navigate({ to: "/dashboard/tasks" })}>
            <Plus className="mr-1 size-4" />
            New Content
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="pt-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Loading contents...</span>
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title & Slug</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Adapters</TableHead>
                  <TableHead className="text-center">SEO Score</TableHead>
                  <TableHead className="text-center">GEO Score</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium max-w-xs">
                      <div className="font-semibold text-sm truncate">{article.title}</div>
                      <div className="text-xs text-muted-foreground truncate">/{article.slug}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{article.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusStyles[article.status]?.className}>
                        {statusStyles[article.status]?.label || article.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {article.adapters.map((adapter) => (
                          <Badge key={adapter} variant="secondary" className="text-xs font-normal">
                            <Globe className="mr-1 size-3 text-muted-foreground" />
                            {adapter}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center gap-1 font-semibold text-xs text-emerald-600 dark:text-emerald-400">
                        <Search className="size-3" />
                        {article.seoScore}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center gap-1 font-semibold text-xs text-purple-600 dark:text-purple-400">
                        <Sparkles className="size-3" />
                        {article.geoScore}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {article.date}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => navigate({ to: "/dashboard/tasks" })}
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
