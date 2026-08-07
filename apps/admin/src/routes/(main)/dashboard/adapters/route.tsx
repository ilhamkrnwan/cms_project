import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Globe, CheckCircle2, AlertCircle, RefreshCw, Send, Settings2, Key, Zap, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { adapterApi } from "@/lib/api-client";

export const Route = createFileRoute("/(main)/dashboard/adapters")({
  component: AdaptersPage,
});

interface AdapterConfig {
  id: string;
  name: string;
  type: "cms" | "static_site" | "framework";
  siteUrl: string;
  apiUrl: string;
  apiKey: string;
  status: "connected" | "pending" | "disconnected";
  lastSync?: string;
}

const INITIAL_ADAPTERS: AdapterConfig[] = [
  {
    id: "wordpress",
    name: "WordPress Adapter",
    type: "cms",
    siteUrl: "https://my-wordpress-blog.com",
    apiUrl: "https://my-wordpress-blog.com/wp-json/wp/v2",
    apiKey: "wp_application_pass_xxxxxx",
    status: "connected",
    lastSync: "2026-08-01 10:30",
  },
  {
    id: "astro",
    name: "Astro Static Site Adapter",
    type: "static_site",
    siteUrl: "https://my-astro-site.vercel.app",
    apiUrl: "https://my-astro-site.vercel.app/api/webhooks/content",
    apiKey: "astro_webhook_secret_key",
    status: "connected",
    lastSync: "2026-08-02 09:00",
  },
  {
    id: "next",
    name: "Next.js Application Adapter",
    type: "framework",
    siteUrl: "https://my-next-app.com",
    apiUrl: "https://my-next-app.com/api/revalidate",
    apiKey: "next_revalidate_token",
    status: "connected",
    lastSync: "2026-07-31 14:15",
  },
];

function AdaptersPage() {
  const [adapters, setAdapters] = useState<AdapterConfig[]>(INITIAL_ADAPTERS);
  
  // Config Modal
  const [activeConfig, setActiveConfig] = useState<AdapterConfig | null>(null);
  const [siteUrlInput, setSiteUrlInput] = useState("");
  const [apiUrlInput, setApiUrlInput] = useState("");
  const [apiKeyInput, setApiKeyInput] = useState("");

  // Test Publish Modal
  const [testAdapter, setTestAdapter] = useState<AdapterConfig | null>(null);
  const [testTitle, setTestTitle] = useState("Test Article from Wontent Content Hub");
  const [testContent, setTestContent] = useState("This is a test publication dispatched from Wontent Content Hub adapter system.");
  const [testResult, setTestResult] = useState<any | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Fetch API
  useEffect(() => {
    adapterApi.list()
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          // Keep list
        }
      })
      .catch(() => {});
  }, []);

  const handleOpenConfig = (adapter: AdapterConfig) => {
    setActiveConfig(adapter);
    setSiteUrlInput(adapter.siteUrl);
    setApiUrlInput(adapter.apiUrl);
    setApiKeyInput(adapter.apiKey);
  };

  const handleSaveConfig = async () => {
    if (!activeConfig) return;
    setAdapters((prev) =>
      prev.map((a) =>
        a.id === activeConfig.id
          ? {
              ...a,
              siteUrl: siteUrlInput,
              apiUrl: apiUrlInput,
              apiKey: apiKeyInput,
              status: "connected",
              lastSync: new Date().toISOString().slice(0, 16).replace("T", " "),
            }
          : a
      )
    );

    await adapterApi.publish({
      targetAdapter: activeConfig.id as any,
      title: "Config sync",
      content: "Sync connection config",
      config: { siteUrl: siteUrlInput, apiUrl: apiUrlInput, apiKey: apiKeyInput },
    });

    toast.add({ type: "success", title: "Adapter configuration saved" });
    setActiveConfig(null);
  };

  const handleOpenTestPublish = (adapter: AdapterConfig) => {
    setTestAdapter(adapter);
    setTestResult(null);
  };

  const handleExecuteTestPublish = async () => {
    if (!testAdapter) return;
    setIsPublishing(true);
    setTestResult(null);

    const res = await adapterApi.publish({
      targetAdapter: testAdapter.id as any,
      title: testTitle,
      content: testContent,
      slug: "test-article",
      config: { siteUrl: testAdapter.siteUrl, apiUrl: testAdapter.apiUrl },
    });

    setIsPublishing(false);
    setTestResult(res);

    if (res.success) {
      toast.add({ type: "success", title: `Test publish sent to ${testAdapter.name}` });
    } else {
      toast.add({ type: "error", title: "Test publish failed" });
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12 font-sans">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="size-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Platform Adapters & Distribution</h1>
          </div>
          <p className="text-muted-foreground text-xs mt-1">
            Configure external CMS, static site generators, and web framework adapters for seamless multi-channel publication.
          </p>
        </div>

        <Badge variant="outline" className="text-xs px-3 py-1 bg-primary/10 text-primary border-primary/20 rounded-full font-medium">
          <Zap className="mr-1 size-3.5" />
          Adapter Engine Active
        </Badge>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {adapters.map((adapter) => (
          <Card key={adapter.id} className="flex flex-col justify-between shadow-xs border hover:border-primary/80 transition-all rounded-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant={adapter.type === "cms" ? "default" : adapter.type === "static_site" ? "secondary" : "outline"} className="text-xs font-semibold">
                  {adapter.type.toUpperCase()}
                </Badge>
                {adapter.status === "connected" ? (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs font-normal">
                    <CheckCircle2 className="mr-1 size-3" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs font-normal">
                    <AlertCircle className="mr-1 size-3" />
                    Pending Config
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg font-bold mt-3">{adapter.name}</CardTitle>
              <CardDescription className="text-xs font-mono truncate">{adapter.siteUrl}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <div className="bg-muted/60 p-3 rounded-lg space-y-1 font-mono border">
                <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">API Endpoint</span>
                <p className="text-xs truncate font-medium">{adapter.apiUrl || "Not configured"}</p>
              </div>

              {adapter.lastSync && (
                <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-1">
                  <RefreshCw className="size-3 text-primary" />
                  Last synced: {adapter.lastSync}
                </p>
              )}
            </CardContent>

            <CardFooter className="pt-3 gap-2 border-t mt-auto">
              <Button variant="outline" size="sm" onClick={() => handleOpenConfig(adapter)} className="w-full text-xs rounded-md">
                <Settings2 className="mr-1.5 size-3.5" />
                Configure
              </Button>
              <Button size="sm" onClick={() => handleOpenTestPublish(adapter)} className="w-full text-xs rounded-md">
                <Send className="mr-1.5 size-3.5" />
                Test Publish
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Configuration Modal */}
      <Dialog open={!!activeConfig} onOpenChange={(open) => !open && setActiveConfig(null)}>
        {activeConfig && (
          <DialogContent className="sm:max-w-md rounded-xl p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Configure {activeConfig.name}</DialogTitle>
              <DialogDescription className="text-xs">
                Set up connection details for target site distribution.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Target Website URL</Label>
                <Input
                  placeholder="https://example.com"
                  value={siteUrlInput}
                  onChange={(e) => setSiteUrlInput(e.target.value)}
                  className="text-xs rounded-md font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">API Webhook / REST Endpoint</Label>
                <Input
                  placeholder="https://example.com/wp-json/wp/v2"
                  value={apiUrlInput}
                  onChange={(e) => setApiUrlInput(e.target.value)}
                  className="text-xs rounded-md font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">API Key / Application Password</Label>
                <div className="relative">
                  <Key className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Secret Key"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    className="pl-8 text-xs rounded-md font-mono"
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setActiveConfig(null)} className="rounded-md">
                Cancel
              </Button>
              <Button onClick={handleSaveConfig} className="rounded-md">Save Connection</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Test Publish Modal */}
      <Dialog open={!!testAdapter} onOpenChange={(open) => !open && setTestAdapter(null)}>
        {testAdapter && (
          <DialogContent className="sm:max-w-lg rounded-xl p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                <Send className="size-4 text-primary" />
                Test Publish to {testAdapter.name}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Send a test payload to verify adapter integration.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Article Title</Label>
                <Input value={testTitle} onChange={(e) => setTestTitle(e.target.value)} className="text-xs rounded-md" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Content Payload</Label>
                <Textarea value={testContent} onChange={(e) => setTestContent(e.target.value)} className="h-24 text-xs rounded-md" />
              </div>

              {testResult && (
                <div className={`p-3 rounded-lg border text-xs space-y-1 ${testResult.success ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300" : "bg-destructive/10 border-destructive/20 text-destructive"}`}>
                  <p className="font-semibold flex items-center gap-1.5">
                    {testResult.success ? <CheckCircle2 className="size-4 text-emerald-600" /> : <AlertCircle className="size-4" />}
                    {testResult.success ? "Publication Successful!" : "Publication Failed"}
                  </p>
                  <p className="text-[11px] opacity-90">{testResult.data?.message || testResult.message}</p>
                  {testResult.data?.publishedUrl && (
                    <a
                      href={testResult.data.publishedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline text-[11px] block pt-1 font-mono"
                    >
                      View Live Post: {testResult.data.publishedUrl}
                    </a>
                  )}
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setTestAdapter(null)} className="rounded-md">
                Close
              </Button>
              <Button onClick={handleExecuteTestPublish} disabled={isPublishing} className="rounded-md">
                {isPublishing ? "Publishing..." : "Send Test Payload"}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
