import { CheckCircle2, FileText, Globe, Search, Sparkles, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function MetricCards() {
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
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">42</div>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
              <TrendingUp className="size-3 mr-1" />
              +8 this week
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs">28 Published · 8 Scheduled · 6 Drafts</p>
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
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">4</div>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
              <CheckCircle2 className="size-3 mr-1" />
              All Healthy
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs">WordPress, Facebook, Astro, Next.js</p>
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
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">92<span className="text-lg text-muted-foreground">/100</span></div>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
              Excellent
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
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">88<span className="text-lg text-muted-foreground">/100</span></div>
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
