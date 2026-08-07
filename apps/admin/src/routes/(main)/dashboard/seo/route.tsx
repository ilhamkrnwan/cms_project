import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, CheckCircle2, AlertTriangle, XCircle, Globe, Share2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { seoApi } from "@/lib/api-client";

export const Route = createFileRoute("/(main)/dashboard/seo")({
  component: SeoPage,
});

interface SeoCheck {
  name: string;
  status: "pass" | "warning" | "fail";
  message: string;
}

interface SeoResult {
  seoScore: number;
  checks: SeoCheck[];
  openGraphPreview: {
    title: string;
    description: string;
    url: string;
    type: string;
  };
  twitterCardPreview: {
    card: string;
    title: string;
    description: string;
  };
}

function SeoPage() {
  const [title, setTitle] = useState("Panduan Lengkap Optimasi SEO & GEO untuk CMS Modern 2026");
  const [content, setContent] = useState(
    "Panduan lengkap langkah demi langkah untuk mengoptimalkan konten website terhadap Google Search dan AI Generative Search Engines seperti ChatGPT & Perplexity.\n\nDalam era digital modern, membuat konten berkualitas saja tidak cukup. Konten harus terstruktur secara rapi agar mudah dipahami baik oleh crawler mesin pencari (SEO) maupun Large Language Model (GEO).\n\n## 1. Struktur Heading yang Disukai AI\nPenggunaan H1, H2, dan H3 yang konsisten membantu LLM mengekstrak poin penting dari artikel Anda."
  );
  const [metaDesc, setMetaDesc] = useState("Pelajari cara menulis artikel sekali dan mendistribusikannya ke berbagai platform dengan skor SEO & GEO tinggi.");
  const [focusKeyword, setFocusKeyword] = useState("seo");
  const [canonicalUrl, setCanonicalUrl] = useState("https://wontent.io/blog/panduan-lengkap-optimasi-seo-geo");

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [seoResult, setSeoResult] = useState<SeoResult | null>(null);

  const handleRunSeoAudit = async () => {
    setIsAnalyzing(true);
    const res = await seoApi.analyze({
      title,
      content,
    });
    setIsAnalyzing(false);

    if (res.success && res.data) {
      setSeoResult(res.data);
      toast.add({ type: "success", title: `SEO Audit Complete: Score ${res.data.seoScore}/100` });
    } else {
      toast.add({ type: "error", title: "SEO Audit failed" });
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12 font-sans">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Search className="size-6 text-amber-500" />
            <h1 className="text-2xl font-bold tracking-tight">SEO Engine & Auditor</h1>
          </div>
          <p className="text-muted-foreground text-xs mt-1">
            Audit article search visibility, meta tags, heading structure, Google SERP previews, and OpenGraph metadata.
          </p>
        </div>

        <Button onClick={handleRunSeoAudit} disabled={isAnalyzing} className="rounded-md">
          <Sparkles className="mr-1.5 size-4 text-amber-500" />
          {isAnalyzing ? "Auditing Content..." : "Run Instant SEO Audit"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Audit Input Form */}
        <Card className="lg:col-span-5 shadow-xs rounded-xl border">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-base font-bold">Article SEO Audit Inputs</CardTitle>
            <CardDescription className="text-xs">Provide article metadata to evaluate SEO health score.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <Label className="text-xs font-semibold">SEO Title</Label>
                <span className="text-[10px] text-muted-foreground">{title.length} chars (Optimal: 40-60)</span>
              </div>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-xs rounded-md" />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <Label className="text-xs font-semibold font-sans">Meta Description</Label>
                <span className="text-[10px] text-muted-foreground">{metaDesc.length} chars (Optimal: 120-160)</span>
              </div>
              <Textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} className="h-20 text-xs rounded-md" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Focus Keyword</Label>
                <Input value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} className="text-xs rounded-md" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Canonical URL</Label>
                <Input value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} className="text-xs font-mono rounded-md" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Content Body</Label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="h-36 text-xs font-mono rounded-md" />
            </div>
          </CardContent>
        </Card>

        {/* Audit Results Dashboard */}
        <div className="lg:col-span-7 space-y-6">
          {seoResult ? (
            <>
              {/* Score Overview Card */}
              <Card className="p-6 shadow-xs rounded-xl border bg-gradient-to-r from-card to-amber-500/5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Overall SEO Health Score</span>
                    <h2 className="text-3xl font-extrabold tracking-tight mt-1 flex items-baseline gap-2">
                      {seoResult.seoScore} <span className="text-lg text-muted-foreground font-normal">/ 100</span>
                      <Badge variant="outline" className={`ml-2 text-xs font-semibold ${seoResult.seoScore >= 90 ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"}`}>
                        {seoResult.seoScore >= 90 ? "Excellent" : seoResult.seoScore >= 70 ? "Good" : "Needs Work"}
                      </Badge>
                    </h2>
                  </div>

                  <div className="size-20 rounded-full border-4 border-amber-500/30 border-t-amber-500 flex items-center justify-center font-extrabold text-xl text-amber-600 dark:text-amber-400 bg-card shadow-xs">
                    {seoResult.seoScore}%
                  </div>
                </div>
              </Card>

              {/* Tabs for Checks and Previews */}
              <Tabs defaultValue="checks" className="w-full">
                <TabsList className="bg-muted p-1 rounded-lg inline-flex gap-1 mb-4 w-full">
                  <TabsTrigger value="checks" className="flex-1 text-xs rounded-md">SEO Checks ({seoResult.checks.length})</TabsTrigger>
                  <TabsTrigger value="serp" className="flex-1 text-xs rounded-md">Google SERP Preview</TabsTrigger>
                  <TabsTrigger value="social" className="flex-1 text-xs rounded-md">OpenGraph & Social</TabsTrigger>
                </TabsList>

                {/* Checks */}
                <TabsContent value="checks" className="space-y-3">
                  {seoResult.checks.map((check, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border bg-card shadow-xs flex items-start gap-3 text-xs">
                      {check.status === "pass" ? (
                        <CheckCircle2 className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                      ) : check.status === "warning" ? (
                        <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="size-5 text-destructive shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold text-sm">{check.name}</p>
                        <p className="text-muted-foreground mt-0.5 leading-relaxed">{check.message}</p>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                {/* SERP */}
                <TabsContent value="serp">
                  <Card className="p-5 bg-white text-slate-900 border rounded-xl shadow-xs">
                    <div className="flex items-center gap-2 text-xs text-slate-600 mb-1">
                      <Globe className="size-3.5 text-blue-600" />
                      <span className="truncate font-mono">{canonicalUrl}</span>
                    </div>
                    <h3 className="text-blue-800 hover:underline font-semibold text-lg leading-tight cursor-pointer">
                      {title}
                    </h3>
                    <p className="text-slate-600 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                      {metaDesc}
                    </p>
                  </Card>
                </TabsContent>

                {/* OpenGraph */}
                <TabsContent value="social" className="space-y-4">
                  <Card className="overflow-hidden border rounded-xl shadow-xs">
                    <div className="bg-muted p-4 border-b">
                      <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                        <Share2 className="size-3.5" /> OpenGraph Facebook & LinkedIn Preview
                      </p>
                    </div>
                    <div className="p-4 space-y-2">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">wontent.io</p>
                      <h4 className="font-bold text-sm">{seoResult.openGraphPreview?.title || title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{seoResult.openGraphPreview?.description || metaDesc}</p>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <Card className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-3 rounded-xl border shadow-xs">
              <Search className="size-10 text-muted-foreground/40" />
              <p className="text-sm font-medium">Click "Run Instant SEO Audit" to evaluate search readiness.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
