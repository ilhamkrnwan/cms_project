import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Bot, HelpCircle, Copy, Check, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { geoApi } from "@/lib/api-client";

export const Route = createFileRoute("/(main)/dashboard/geo")({
  component: GeoPage,
});

interface GeoResult {
  geoScore: number;
  llmReadiness: string;
  readabilityScore: number;
  detectedEntities: string[];
  faqSuggestions: Array<{ question: string; answer: string }>;
  citationSuggestions: Array<{ term: string; recommendation: string }>;
  structuredSchema: Record<string, any>;
}

function GeoPage() {
  const [title, setTitle] = useState("Panduan Lengkap Optimasi SEO & GEO untuk CMS Modern 2026");
  const [content, setContent] = useState(
    "Wontent Content Hub adalah platform modern untuk mengelola dan mendistribusikan konten ke WordPress, Astro, Facebook, Instagram, dan LinkedIn dari satu dashboard terpusat.\n\nDalam era kecerdasan buatan, Generative Engine Optimization (GEO) menjadi penting agar konten Anda dikutip oleh Large Language Models seperti ChatGPT, Perplexity, dan Google Gemini."
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [geoResult, setGeoResult] = useState<GeoResult | null>(null);
  const [isCopiedJsonLd, setIsCopiedJsonLd] = useState(false);

  const handleRunGeoAnalysis = async () => {
    setIsAnalyzing(true);
    const res = await geoApi.analyze({
      title,
      content,
    });
    setIsAnalyzing(false);

    if (res.success && res.data) {
      setGeoResult(res.data);
      toast.add({ type: "success", title: `GEO Readiness Complete: Score ${res.data.geoScore}/100` });
    } else {
      toast.add({ type: "error", title: "GEO Audit failed" });
    }
  };

  const handleCopyJsonLd = () => {
    if (!geoResult) return;
    navigator.clipboard.writeText(JSON.stringify(geoResult.structuredSchema, null, 2));
    setIsCopiedJsonLd(true);
    toast.add({ type: "success", title: "JSON-LD Schema copied to clipboard" });
    setTimeout(() => setIsCopiedJsonLd(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12 font-sans">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-6 text-purple-600 dark:text-purple-400" />
            <h1 className="text-2xl font-bold tracking-tight">GEO Engine (Generative Engine Optimization)</h1>
          </div>
          <p className="text-muted-foreground text-xs mt-1">
            Optimize articles for AI Search Engines (ChatGPT, Perplexity, Gemini) with Entity extraction, FAQ schemas, & AI Readability.
          </p>
        </div>

        <Button onClick={handleRunGeoAnalysis} disabled={isAnalyzing} className="bg-purple-600 hover:bg-purple-700 text-white rounded-md">
          <Bot className="mr-1.5 size-4" />
          {isAnalyzing ? "Analyzing AI Readiness..." : "Analyze GEO Readiness"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Card */}
        <Card className="lg:col-span-5 shadow-xs rounded-xl border">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-base font-bold">Article Content for GEO Audit</CardTitle>
            <CardDescription className="text-xs">Analyze how Large Language Models parse your text.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Article Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-xs rounded-md" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Article Body</Label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="h-64 text-xs font-mono rounded-md" />
            </div>
          </CardContent>
        </Card>

        {/* Results Card */}
        <div className="lg:col-span-7 space-y-6">
          {geoResult ? (
            <>
              {/* Score Header */}
              <Card className="p-6 shadow-xs rounded-xl border bg-gradient-to-r from-purple-500/10 via-card to-card border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">AI Search Engine Optimization Score</span>
                    <h2 className="text-3xl font-extrabold tracking-tight mt-1 flex items-baseline gap-2">
                      {geoResult.geoScore} <span className="text-lg text-muted-foreground font-normal">/ 100</span>
                      <Badge className="bg-purple-600 text-white rounded-full text-xs font-medium ml-2">LLM Readiness: {geoResult.llmReadiness}</Badge>
                    </h2>
                  </div>

                  <div className="size-20 rounded-full border-4 border-purple-500/30 border-t-purple-600 flex items-center justify-center font-extrabold text-xl text-purple-600 dark:text-purple-400 bg-card shadow-xs">
                    {geoResult.geoScore}%
                  </div>
                </div>
              </Card>

              <Tabs defaultValue="entities" className="w-full">
                <TabsList className="bg-muted p-1 rounded-lg inline-flex gap-1 mb-4 w-full">
                  <TabsTrigger value="entities" className="flex-1 text-xs rounded-md">Entities ({geoResult.detectedEntities.length})</TabsTrigger>
                  <TabsTrigger value="faq" className="flex-1 text-xs rounded-md">FAQs ({geoResult.faqSuggestions.length})</TabsTrigger>
                  <TabsTrigger value="citations" className="flex-1 text-xs rounded-md">Citations</TabsTrigger>
                  <TabsTrigger value="schema" className="flex-1 text-xs rounded-md">JSON-LD</TabsTrigger>
                </TabsList>

                {/* Detected Entities */}
                <TabsContent value="entities" className="space-y-4">
                  <Card className="p-5 shadow-xs rounded-xl border space-y-3">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Extracted Key Named Entities</h3>
                    <p className="text-xs text-muted-foreground">
                      AI search engines map these recognized entities to knowledge graphs when citing your content.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {geoResult.detectedEntities.map((ent, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs py-1 px-3 bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 rounded-md font-medium">
                          {ent}
                        </Badge>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-5 shadow-xs rounded-xl border space-y-2">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">AI Readability Index (Flesch-Kincaid)</h3>
                    <div className="flex items-center gap-4 pt-1">
                      <div className="text-3xl font-extrabold text-primary">{geoResult.readabilityScore}</div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {geoResult.readabilityScore > 60
                          ? "Clear sentence structure. High probability of AI citation & LLM extraction."
                          : "Sentence structure is complex. Simplify to increase LLM extraction accuracy."}
                      </p>
                    </div>
                  </Card>
                </TabsContent>

                {/* FAQ Suggestions */}
                <TabsContent value="faq" className="space-y-3">
                  {geoResult.faqSuggestions.map((faq, idx) => (
                    <Card key={idx} className="p-4 space-y-1.5 text-xs shadow-xs rounded-xl border">
                      <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                        <HelpCircle className="size-4 text-purple-600 dark:text-purple-400 shrink-0" />
                        {faq.question}
                      </div>
                      <p className="text-muted-foreground pl-6 leading-relaxed">{faq.answer}</p>
                    </Card>
                  ))}
                </TabsContent>

                {/* Citation Suggestions */}
                <TabsContent value="citations" className="space-y-3">
                  {geoResult.citationSuggestions.map((cit, idx) => (
                    <Card key={idx} className="p-4 text-xs flex items-center justify-between shadow-xs rounded-xl border">
                      <div>
                        <span className="font-bold text-sm">{cit.term}</span>
                        <p className="text-muted-foreground mt-0.5">{cit.recommendation}</p>
                      </div>
                      <ExternalLink className="size-4 text-muted-foreground" />
                    </Card>
                  ))}
                </TabsContent>

                {/* JSON-LD Schema Viewer */}
                <TabsContent value="schema" className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-muted-foreground">Schema.org Article JSON-LD</span>
                    <Button size="sm" variant="outline" onClick={handleCopyJsonLd} className="rounded-md text-xs">
                      {isCopiedJsonLd ? <Check className="mr-1.5 size-4 text-emerald-500" /> : <Copy className="mr-1.5 size-4" />}
                      Copy JSON-LD
                    </Button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950 text-slate-100 text-xs font-mono overflow-x-auto border">
                    {JSON.stringify(geoResult.structuredSchema, null, 2)}
                  </pre>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <Card className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-3 rounded-xl border shadow-xs">
              <Bot className="size-10 text-purple-400/50" />
              <p className="text-sm font-medium">Click "Analyze GEO Readiness" to check AI search readability & entity extraction.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
