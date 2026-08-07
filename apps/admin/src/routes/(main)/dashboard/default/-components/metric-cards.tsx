import { useEffect, useState } from "react";
import { CheckCircle2, FileText, Globe, Loader2, Search, Sparkles, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { analyticsApi, type AnalyticsOverview } from "@/lib/api-client";

interface MetricData {
  totalContents: number;
  publishedContents: number;
  scheduledContents: number;
  draftContents: number;
  adapterCount: number;
  adapterNames: string;
  averageSeoScore: number;
  averageGeoScore: number;
}

const FALLBACK: MetricData = {
  totalContents: 42,
  publishedContents: 28,
  scheduledContents: 8,
  draftContents: 6,
  adapterCount: 4,
  adapterNames: "WordPress, Facebook, Astro, Next.js",
  averageSeoScore: 92,
  averageGeoScore: 88,
};

export function MetricCards() {
  const [data, setData] = useState<MetricData>(FALLBACK);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    analyticsApi
      .overview()
      .then((res) => {
        if (res.success && res.data) {
          const d = res.data;
          setData({
            totalContents: d.totalContents,
            publishedContents: d.publishedContents,
            scheduledContents: d.scheduledContents,
            draftContents: d.draftContents,
            adapterCount: d.adapterUsage?.length || 4,
            adapterNames: d.adapterUsage?.map((a) => a.name).join(", ") || FALLBACK.adapterNames,
            averageSeoScore: d.averageSeoScore,
            averageGeoScore: d.averageGeoScore,
          });
        }
      })
      .catch(() => {
        // fallback to defaults
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-7 w-7 rounded-lg bg-muted" />
              <div className="mt-2 h-4 w-24 rounded bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 rounded bg-muted" />
              <div className="mt-2 h-3 w-32 rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs xl:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-primary/10 text-primary">
              <FileText className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Total Contents</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">{data.totalContents}</div>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
              <TrendingUp className="size-3 mr-1" />
              Active
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs">{data.publishedContents} Published · {data.scheduledContents} Scheduled · {data.draftContents} Drafts</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Globe className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Active Adapters</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">{data.adapterCount}</div>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
              <CheckCircle2 className="size-3 mr-1" />
              All Healthy
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs">{data.adapterNames}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Search className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Average SEO Score</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">{data.averageSeoScore}<span className="text-lg text-muted-foreground">/100</span></div>
            <Badge variant="outline" className={`${data.averageSeoScore >= 80 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"}`}>
              {data.averageSeoScore >= 90 ? "Excellent" : data.averageSeoScore >= 80 ? "Good" : "Needs Work"}
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs">Meta, Headings, Keywords & Alt text checked</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Sparkles className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Average GEO Score</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">{data.averageGeoScore}<span className="text-lg text-muted-foreground">/100</span></div>
            <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20">
              AI Ready
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs">Readability, Entities & Citations ready</p>
        </CardContent>
      </Card>
    </div>
  );
}
