import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Settings, Save, Key, Building2, Shield, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { settingsApi } from "@/lib/api-client";

export const Route = createFileRoute("/(main)/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [workspaceName, setWorkspaceName] = useState("Wontent Official Workspace");
  const [workspaceSlug, setWorkspaceSlug] = useState("wontent-official");
  const [timezone, setTimezone] = useState("Asia/Jakarta (UTC+7)");
  const [defaultLanguage, setDefaultLanguage] = useState("Indonesian (id-ID)");

  // API & Integration state
  const [aiApiKey, setAiApiKey] = useState("sk-proj-xxxxxxxxxxxxxxxxxxxx");
  const [betterAuthSecret, setBetterAuthSecret] = useState("ba_secret_key_123456789");
  const [webhookUrl, setWebhookUrl] = useState("https://wontent.io/api/v1/webhooks");

  // Options
  const [autoSeo, setAutoSeo] = useState(true);
  const [autoGeo, setAutoGeo] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    settingsApi.get()
      .then((res) => {
        if (res.success && res.data) {
          if (res.data.general?.siteName) setWorkspaceName(res.data.general.siteName);
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    const res = await settingsApi.update({
      general: { siteName: workspaceName, defaultLocale: defaultLanguage },
      seoDefaults: { defaultTitleSuffix: " | Wontent Hub", defaultMetaRobots: "index, follow" },
      aiSettings: { defaultModel: "gpt-4o", autoSuggestKeywords: autoGeo },
    });
    setIsSaving(false);

    if (res.success) {
      toast.add({ type: "success", title: "Workspace settings saved to database" });
    } else {
      toast.add({ type: "error", title: "Failed to save settings" });
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12 font-sans">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="size-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Workspace & System Settings</h1>
          </div>
          <p className="text-muted-foreground text-xs mt-1">
            Manage organization credentials, AI provider keys, adapter defaults, and system preferences.
          </p>
        </div>

        <Button onClick={handleSaveSettings} disabled={isSaving} className="rounded-md">
          <Save className="mr-1.5 size-4" />
          {isSaving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-muted p-1 rounded-lg inline-flex gap-1 mb-4">
          <TabsTrigger value="general" className="flex items-center gap-1.5 text-xs rounded-md">
            <Building2 className="size-3.5" /> General Workspace
          </TabsTrigger>
          <TabsTrigger value="apikeys" className="flex items-center gap-1.5 text-xs rounded-md">
            <Key className="size-3.5" /> API Keys & Webhooks
          </TabsTrigger>
          <TabsTrigger value="defaults" className="flex items-center gap-1.5 text-xs rounded-md">
            <Shield className="size-3.5" /> Engine Automation
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card className="shadow-xs rounded-xl border">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-base font-bold">Workspace Information</CardTitle>
              <CardDescription className="text-xs">Identitas workspace dan zona waktu default.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 text-xs max-w-xl">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Workspace Name</Label>
                <Input value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} className="text-xs rounded-md" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Organization Slug</Label>
                <Input value={workspaceSlug} onChange={(e) => setWorkspaceSlug(e.target.value)} className="text-xs font-mono rounded-md" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Default Timezone</Label>
                  <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} className="text-xs rounded-md" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Default Language</Label>
                  <Input value={defaultLanguage} onChange={(e) => setDefaultLanguage(e.target.value)} className="text-xs rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys Settings */}
        <TabsContent value="apikeys">
          <Card className="shadow-xs rounded-xl border">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-base font-bold">API Keys & External Services</CardTitle>
              <CardDescription className="text-xs">Configure AI model providers and authentication keys.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 text-xs max-w-xl">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">OpenAI / AI Engine API Key</Label>
                <Input type="password" value={aiApiKey} onChange={(e) => setAiApiKey(e.target.value)} className="text-xs font-mono rounded-md" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Better Auth Secret Token</Label>
                <Input type="password" value={betterAuthSecret} onChange={(e) => setBetterAuthSecret(e.target.value)} className="text-xs font-mono rounded-md" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">System Webhook Dispatch URL</Label>
                <Input value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} className="text-xs font-mono rounded-md" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Defaults Settings */}
        <TabsContent value="defaults">
          <Card className="shadow-xs rounded-xl border">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-base font-bold">Automation & Engine Defaults</CardTitle>
              <CardDescription className="text-xs">Configure automated background checks for content creation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 text-xs max-w-xl">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-semibold text-sm">Automatic SEO Audit on Save</p>
                  <p className="text-muted-foreground text-xs">Run SEO score calculation automatically whenever an article is updated.</p>
                </div>
                <Switch checked={autoSeo} onCheckedChange={setAutoSeo} />
              </div>

              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-semibold text-sm">Automatic GEO AI Readiness Check</p>
                  <p className="text-muted-foreground text-xs">Extract entities and calculate readability score on draft creation.</p>
                </div>
                <Switch checked={autoGeo} onCheckedChange={setAutoGeo} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
