import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FilePlus, Globe, Search, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MetricCards } from "./-components/metric-cards";
import { PerformanceOverview } from "./-components/performance-overview";
import { RecentContentsTable } from "./-components/recent-contents-table";

export const Route = createFileRoute("/(main)/dashboard/default")({
  component: Page,
});

function Page() {
  const navigate = useNavigate();

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      {/* Header Banner & Quick Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-xl border bg-card p-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-2xl tracking-tight">Wontent Content Hub</h1>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-xs text-primary">v1.0 MVP</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Write Once. Optimize with AI. Publish Everywhere.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" onClick={() => navigate({ to: "/dashboard/tasks" })}>
            <FilePlus className="mr-1.5 size-4" />
            Create Article
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate({ to: "/dashboard/seo" })}>
            <Search className="mr-1.5 size-4 text-amber-500" />
            SEO Audit
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate({ to: "/dashboard/geo" })}>
            <Sparkles className="mr-1.5 size-4 text-purple-500" />
            GEO Engine
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate({ to: "/dashboard/adapters" })}>
            <Globe className="mr-1.5 size-4 text-blue-500" />
            Adapters
          </Button>
        </div>
      </div>

      <MetricCards />
      <PerformanceOverview />
      <RecentContentsTable />
    </div>
  );
}
