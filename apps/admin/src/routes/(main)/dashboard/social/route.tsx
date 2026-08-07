import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Share2, Facebook, Instagram, Linkedin, Send, Plus, CheckCircle2, Sparkles, Image as ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { socialApi } from "@/lib/api-client";

export const Route = createFileRoute("/(main)/dashboard/social")({
  component: SocialPage,
});

interface SocialAccount {
  id: string;
  platform: string;
  name: string;
  status: string;
}

interface SocialPostHistory {
  id: string;
  platform: string;
  text: string;
  mediaUrl?: string;
  publishedAt: string;
  status: "published" | "scheduled";
}

const INITIAL_ACCOUNTS: SocialAccount[] = [
  { id: "acc_fb", platform: "facebook", name: "Wontent Official Facebook Page", status: "connected" },
  { id: "acc_ig", platform: "instagram", name: "@wontenthub Business Account", status: "connected" },
  { id: "acc_li", platform: "linkedin", name: "Wontent Inc Company Page", status: "connected" },
  { id: "acc_tg", platform: "telegram", name: "@wontent_announcements Channel", status: "connected" },
];

const INITIAL_HISTORY: SocialPostHistory[] = [
  {
    id: "sp_101",
    platform: "facebook",
    text: "🚀 Panduan Lengkap Optimasi SEO & GEO untuk CMS Modern! Baca artikel terbaru kami mengenai strategi Write Once Publish Everywhere.",
    mediaUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
    publishedAt: "2026-08-01 11:00",
    status: "published",
  },
  {
    id: "sp_102",
    platform: "linkedin",
    text: "Hemat waktu publikasi konten marketing Anda hingga 80% menggunakan Content Hub terpusat. Simak ulasan strategi content marketing multi-platform.",
    mediaUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    publishedAt: "2026-07-31 15:30",
    status: "published",
  },
];

function SocialPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>(INITIAL_ACCOUNTS);
  const [history, setHistory] = useState<SocialPostHistory[]>(INITIAL_HISTORY);
  
  // Publisher Form State
  const [selectedPlatform, setSelectedPlatform] = useState<string>("facebook");
  const [postText, setPostText] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  // Connect Account Dialog
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [connectPlatform, setConnectPlatform] = useState("facebook");
  const [accountNameInput, setAccountNameInput] = useState("");

  // Fetch API
  useEffect(() => {
    socialApi.accounts()
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setAccounts(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleGenerateHashtags = () => {
    setPostText((prev) => `${prev.trim()}\n\n#Wontent #ContentMarketing #SEO #AI #DigitalMarketing`);
    toast.add({ type: "success", title: "AI Hashtags appended to post" });
  };

  const handlePublishPost = async () => {
    if (!postText.trim()) return;
    setIsPublishing(true);

    const res = await socialApi.publish({
      platform: selectedPlatform,
      text: postText,
      mediaUrl: mediaUrl || undefined,
    });

    setIsPublishing(false);

    if (res.success) {
      const newPost: SocialPostHistory = {
        id: `sp_${Date.now()}`,
        platform: selectedPlatform,
        text: postText,
        mediaUrl,
        publishedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
        status: "published",
      };
      setHistory((prev) => [newPost, ...prev]);
      toast.add({ type: "success", title: `Successfully published to ${selectedPlatform.toUpperCase()}!` });
      setPostText("");
      setMediaUrl("");
    } else {
      toast.add({ type: "error", title: "Failed to publish social post" });
    }
  };

  const handleSaveConnectAccount = () => {
    if (!accountNameInput.trim()) return;
    const newAcc: SocialAccount = {
      id: `acc_${Date.now()}`,
      platform: connectPlatform,
      name: accountNameInput,
      status: "connected",
    };
    setAccounts((prev) => [...prev, newAcc]);
    toast.add({ type: "success", title: `${connectPlatform.toUpperCase()} channel connected` });
    setAccountNameInput("");
    setIsConnectOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12 font-sans">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="size-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Social Channels & Direct Publisher</h1>
          </div>
          <p className="text-muted-foreground text-xs mt-1">
            Publish micro-content, announcements, and links directly to connected social media pages.
          </p>
        </div>

        <Button onClick={() => setIsConnectOpen(true)} size="sm" className="rounded-md">
          <Plus className="mr-1.5 size-4" />
          Connect Channel
        </Button>
      </div>

      {/* Connected Accounts Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {accounts.map((acc) => (
          <Card key={acc.id} className="p-4 border shadow-xs flex items-center justify-between rounded-xl hover:border-primary/50 transition-all">
            <div className="flex items-center gap-3">
              <div className={`size-10 rounded-xl flex items-center justify-center font-bold ${acc.platform === 'facebook' ? 'bg-blue-500/10 text-blue-600' : acc.platform === 'instagram' ? 'bg-pink-500/10 text-pink-600' : acc.platform === 'linkedin' ? 'bg-sky-500/10 text-sky-600' : 'bg-indigo-500/10 text-indigo-600'}`}>
                {acc.platform === "facebook" ? <Facebook className="size-5" /> : acc.platform === "instagram" ? <Instagram className="size-5" /> : acc.platform === "linkedin" ? <Linkedin className="size-5" /> : <Send className="size-5" />}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold truncate">{acc.name}</p>
                <p className="text-[10px] text-muted-foreground capitalize font-medium">{acc.platform}</p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] text-emerald-600 bg-emerald-500/10 border-emerald-500/20 font-normal">
              Active
            </Badge>
          </Card>
        ))}
      </div>

      {/* Publisher Form & Recent Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Publisher Form */}
        <Card className="lg:col-span-2 shadow-xs rounded-xl border">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Send className="size-4 text-primary" />
              Compose Social Post
            </CardTitle>
            <CardDescription className="text-xs">
              Select platform and write your social broadcast.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            {/* Target Platform selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Target Platform</Label>
              <div className="flex flex-wrap gap-2">
                {["facebook", "instagram", "linkedin", "telegram"].map((p) => (
                  <Button
                    key={p}
                    type="button"
                    variant={selectedPlatform === p ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPlatform(p)}
                    className="capitalize text-xs rounded-md"
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>

            {/* Post Content */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-semibold">Post Caption / Message</Label>
                <Button variant="ghost" size="sm" onClick={handleGenerateHashtags} className="h-6 text-[11px] text-purple-600 dark:text-purple-400 hover:bg-purple-500/10">
                  <Sparkles className="mr-1 size-3" />
                  + AI Hashtags
                </Button>
              </div>
              <Textarea
                placeholder="What would you like to share across social media?"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                className="h-32 text-xs rounded-md"
              />
            </div>

            {/* Media URL Attachment */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Attached Image / Media URL (Optional)</Label>
              <div className="relative">
                <ImageIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="https://images.unsplash.com/..."
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="pl-8 text-xs font-mono rounded-md"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-4">
            <span className="text-[11px] text-muted-foreground">{postText.length} characters</span>
            <Button onClick={handlePublishPost} disabled={isPublishing || !postText.trim()} className="rounded-md">
              <Send className="mr-1.5 size-4" />
              {isPublishing ? "Publishing..." : "Publish Post Now"}
            </Button>
          </CardFooter>
        </Card>

        {/* History Feed */}
        <Card className="lg:col-span-1 shadow-xs rounded-xl border">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-base font-bold">Recent Social Activity</CardTitle>
            <CardDescription className="text-xs">History of posts published to social channels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {history.map((h) => (
              <div key={h.id} className="p-3.5 rounded-xl border bg-muted/40 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="capitalize text-[10px] font-semibold">
                    {h.platform}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">{h.publishedAt}</span>
                </div>
                <p className="line-clamp-3 text-muted-foreground leading-relaxed">{h.text}</p>
                {h.mediaUrl && (
                  <div className="h-24 rounded-lg bg-muted overflow-hidden border">
                    <img src={h.mediaUrl} alt="social media attached media" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Connect Account Modal */}
      <Dialog open={isConnectOpen} onOpenChange={setIsConnectOpen}>
        <DialogContent className="sm:max-w-md rounded-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Connect New Social Channel</DialogTitle>
            <DialogDescription className="text-xs">
              Link your social account or page to Wontent Content Hub.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Platform</Label>
              <select
                value={connectPlatform}
                onChange={(e) => setConnectPlatform(e.target.value)}
                className="w-full h-9 rounded-md border bg-background px-3 text-xs"
              >
                <option value="facebook">Facebook Page</option>
                <option value="instagram">Instagram Business</option>
                <option value="linkedin">LinkedIn Company</option>
                <option value="telegram">Telegram Channel</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Account / Channel Name</Label>
              <Input
                placeholder="e.g. My Brand Page"
                value={accountNameInput}
                onChange={(e) => setAccountNameInput(e.target.value)}
                className="text-xs rounded-md"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsConnectOpen(false)} className="rounded-md">
              Cancel
            </Button>
            <Button onClick={handleSaveConnectAccount} className="rounded-md">Connect Channel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
