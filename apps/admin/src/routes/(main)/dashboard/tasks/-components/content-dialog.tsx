import { useEffect, useState } from "react";
import { Globe, Image as ImageIcon, Search, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  body: string;
  category: string;
  featuredImage?: string;
  status: "published" | "scheduled" | "draft" | "archived";
  publishDate?: string;
  adapters: string[];
  seoMetadata?: {
    seoTitle?: string;
    metaDescription?: string;
    keywords?: string;
  };
  seoScore?: number;
  geoScore?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ContentItem | null;
  onSave: (data: Partial<ContentItem>) => void;
}

const AVAILABLE_ADAPTERS = [
  { id: "WordPress", label: "WordPress" },
  { id: "Facebook", label: "Facebook Page" },
  { id: "Instagram", label: "Instagram Business" },
  { id: "Astro", label: "Astro API" },
  { id: "Next.js", label: "Next.js API" },
  { id: "LinkedIn", label: "LinkedIn" },
];

const CATEGORIES = [
  "Tutorial",
  "Marketing",
  "Engineering",
  "AI & Automation",
  "Design",
  "News & Updates",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ContentDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: ContentDialogProps) {
  const isEditing = Boolean(initialData);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugCustom, setIsSlugCustom] = useState(false);
  const [category, setCategory] = useState("Tutorial");
  const [body, setBody] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [status, setStatus] = useState<ContentItem["status"]>("draft");
  const [publishDate, setPublishDate] = useState("");
  const [selectedAdapters, setSelectedAdapters] = useState<string[]>(["WordPress"]);

  // SEO state
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setSlug(initialData.slug || "");
      setIsSlugCustom(true);
      setCategory(initialData.category || "Tutorial");
      setBody(initialData.body || "");
      setFeaturedImage(initialData.featuredImage || "");
      setStatus(initialData.status || "draft");
      setPublishDate(initialData.publishDate || "");
      setSelectedAdapters(initialData.adapters || ["WordPress"]);
      setSeoTitle(initialData.seoMetadata?.seoTitle || initialData.title || "");
      setMetaDescription(initialData.seoMetadata?.metaDescription || "");
      setKeywords(initialData.seoMetadata?.keywords || "");
    } else {
      setTitle("");
      setSlug("");
      setIsSlugCustom(false);
      setCategory("Tutorial");
      setBody("");
      setFeaturedImage("");
      setStatus("draft");
      setPublishDate("");
      setSelectedAdapters(["WordPress"]);
      setSeoTitle("");
      setMetaDescription("");
      setKeywords("");
    }
  }, [initialData, open]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugCustom) {
      setSlug(slugify(val));
    }
    if (!seoTitle || seoTitle === title) {
      setSeoTitle(val);
    }
  };

  const toggleAdapter = (adapterId: string) => {
    setSelectedAdapters((prev) =>
      prev.includes(adapterId)
        ? prev.filter((a) => a !== adapterId)
        : [...prev, adapterId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id,
      title,
      slug: slug || slugify(title),
      body,
      category,
      featuredImage,
      status,
      publishDate: status === "published" ? new Date().toISOString() : publishDate,
      adapters: selectedAdapters,
      seoMetadata: {
        seoTitle,
        metaDescription,
        keywords,
      },
      seoScore: initialData?.seoScore || Math.floor(Math.random() * 15) + 85,
      geoScore: initialData?.geoScore || Math.floor(Math.random() * 15) + 80,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Article / Content" : "Create New Article / Content"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update article details, publishing status, and target platform adapters."
                : "Create a new article to distribute across connected adapters."}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="content" className="mt-4 w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Content & Distribution</TabsTrigger>
              <TabsTrigger value="seo">SEO & GEO Optimization</TabsTrigger>
            </TabsList>

            {/* TAB 1: Content & Distribution */}
            <TabsContent value="content" className="space-y-4 pt-3">
              <div className="space-y-2">
                <Label htmlFor="title">Article Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Panduan Lengkap Content Marketing dengan Wontent"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    placeholder="panduan-lengkap-content-marketing"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setIsSlugCustom(true);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Article Body Content *</Label>
                <Textarea
                  id="body"
                  rows={6}
                  placeholder="Write article content here..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="featuredImage">Featured Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="featuredImage"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                  />
                  {featuredImage && (
                    <div className="size-10 rounded border overflow-hidden shrink-0">
                      <img
                        src={featuredImage}
                        alt="Preview"
                        className="size-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Target Adapters Checkboxes */}
              <div className="space-y-2 rounded-lg border p-4 bg-muted/30">
                <Label className="text-sm font-semibold flex items-center gap-1.5">
                  <Globe className="size-4 text-blue-500" />
                  Target Publishing Adapters
                </Label>
                <p className="text-xs text-muted-foreground">
                  Select platforms where this article will be published upon release.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                  {AVAILABLE_ADAPTERS.map((adapter) => (
                    <div
                      key={adapter.id}
                      className="flex items-center space-x-2 rounded border bg-card p-2 hover:bg-muted/50 cursor-pointer"
                      onClick={() => toggleAdapter(adapter.id)}
                    >
                      <Checkbox
                        id={`adapter-${adapter.id}`}
                        checked={selectedAdapters.includes(adapter.id)}
                        onCheckedChange={() => toggleAdapter(adapter.id)}
                      />
                      <label
                        htmlFor={`adapter-${adapter.id}`}
                        className="text-xs font-medium cursor-pointer"
                      >
                        {adapter.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status and Schedule */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="space-y-2">
                  <Label htmlFor="status">Publish Status</Label>
                  <Select
                    value={status}
                    onValueChange={(val) => setStatus(val as ContentItem["status"])}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft (Save offline)</SelectItem>
                      <SelectItem value="scheduled">Scheduled (Set release date)</SelectItem>
                      <SelectItem value="published">Published (Live everywhere)</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {status === "scheduled" && (
                  <div className="space-y-2">
                    <Label htmlFor="publishDate">Scheduled Date & Time</Label>
                    <Input
                      id="publishDate"
                      type="datetime-local"
                      value={publishDate}
                      onChange={(e) => setPublishDate(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            {/* TAB 2: SEO & GEO Optimization */}
            <TabsContent value="seo" className="space-y-4 pt-3">
              <div className="space-y-2">
                <Label htmlFor="seoTitle" className="flex items-center gap-1.5">
                  <Search className="size-4 text-amber-500" />
                  SEO Title
                </Label>
                <Input
                  id="seoTitle"
                  placeholder="Title optimized for Google search"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Recommended length: 50-60 characters ({seoTitle.length} chars)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  rows={3}
                  placeholder="Summary snippet displayed in search result pages..."
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Recommended length: 140-160 characters ({metaDescription.length} chars)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Focus Keywords</Label>
                <Input
                  id="keywords"
                  placeholder="cms, content marketing, write once publish everywhere"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>

              <div className="rounded-lg border bg-purple-500/5 p-4 space-y-2 border-purple-500/20">
                <div className="flex items-center gap-2 font-semibold text-sm text-purple-600 dark:text-purple-400">
                  <Sparkles className="size-4" />
                  GEO (Generative Engine Optimization) Recommendation
                </div>
                <p className="text-xs text-muted-foreground">
                  Our AI engine will analyze entities, structured FAQs, and citation sources automatically before publishing to optimize LLM search readiness.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Save Changes" : "Create Content"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
