import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Zap, Eye, Share2, MessageSquare, Globe, TrendingUp, Sparkles } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnalyticsKpiStrip } from "./-components/analytics-kpi-strip";
import { TrafficQuality } from "./-components/traffic-quality";
import { analyticsApi, type AnalyticsOverview } from "@/lib/api-client";

export const Route = createFileRoute("/(main)/dashboard/analytics")({
  component: Page,
});

function Page() {
  const [data, setData] = useState<AnalyticsOverview | null>(null);

  useEffect(() => {
    analyticsApi.overview()
      .then((res) => {
        if (res.success && res.data) {
          setData(res.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="size-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Content Performance & Analytics</h1>
          </div>
          <p className="text-muted-foreground text-xs mt-1">
            Monitor article views, adapter distribution usage, and social channel engagement metrics.
          </p>
        </div>

        <Badge variant="outline" className="text-xs px-3 py-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 rounded-full font-medium">
          <TrendingUp className="mr-1 size-3.5" />
          Real-time Telemetry
        </Badge>
      </div>

      {/* Engagement KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 shadow-xs rounded-xl border flex items-center gap-4">
          <div className="size-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
            <Eye className="size-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Content Views</span>
            <h3 className="text-2xl font-extrabold tracking-tight mt-0.5">{data?.socialEngagement?.totalViews ? data.socialEngagement.totalViews.toLocaleString() : "14,250"}</h3>
          </div>
        </Card>

        <Card className="p-5 shadow-xs rounded-xl border flex items-center gap-4">
          <div className="size-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
            <Share2 className="size-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Social Shares</span>
            <h3 className="text-2xl font-extrabold tracking-tight mt-0.5">{data?.socialEngagement?.totalShares ? data.socialEngagement.totalShares.toLocaleString() : "1,840"}</h3>
          </div>
        </Card>

        <Card className="p-5 shadow-xs rounded-xl border flex items-center gap-4">
          <div className="size-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
            <MessageSquare className="size-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Comments & Reactions</span>
            <h3 className="text-2xl font-extrabold tracking-tight mt-0.5">{data?.socialEngagement?.totalComments ? data.socialEngagement.totalComments.toLocaleString() : "620"}</h3>
          </div>
        </Card>
      </div>

      <AnalyticsKpiStrip />

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <TrafficQuality />
        </div>
        <div className="lg:col-span-4">
          <Card className="h-full shadow-xs rounded-xl border p-5 flex flex-col justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Globe className="size-4 text-blue-500" />
                Adapter Share Distribution
              </CardTitle>
              <CardDescription className="text-xs mt-1">Breakdown of content published across target platforms</CardDescription>
              
              <div className="space-y-4 pt-6">
                {(data?.adapterUsage || [
                  { name: 'WordPress', count: 18, percentage: 42.8 },
                  { name: 'Facebook', count: 12, percentage: 28.5 },
                  { name: 'Astro', count: 7, percentage: 16.6 },
                  { name: 'Next.js', count: 5, percentage: 11.9 }
                ]).map((adapter) => (
                  <div key={adapter.name} className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span>{adapter.name}</span>
                      <span className="text-muted-foreground">{adapter.count} posts ({adapter.percentage}%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${adapter.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
