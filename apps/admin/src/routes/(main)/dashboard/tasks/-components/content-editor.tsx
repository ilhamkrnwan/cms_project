import { useEffect, useState } from "react";
import {
  ArrowLeft,
  FileText,
  Globe,
  Image as ImageIcon,
  Plus,
  Save,
  Search,
  Send,
  Sparkles,
  Tag as TagIcon,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  body: string;
  category: string;
  tags?: string[];
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

interface ContentEditorProps {
  initialData?: ContentItem | null;
  onSave: (data: Partial<ContentItem>) => void;
  onCancel: () => void;
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

export function ContentEditor({
  initialData,
  onSave,
  onCancel,
}: ContentEditorProps) {
  const isEditing = Boolean(initialData);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugCustom, setIsSlugCustom] = useState(false);
  const [category, setCategory] = useState("Tutorial");
  const [tags, setTags] = useState<string[]>(["SEO", "CMS"]);
  const [tagInput, setTagInput] = useState("");
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
      setTags(initialData.tags || ["SEO", "CMS"]);
      setBody(initialData.body || "");
      setFeaturedImage(initialData.featuredImage || "");
      setStatus(initialData.status || "draft");
      setPublishDate(initialData.publishDate || "");
      setSelectedAdapters(initialData.adapters || ["WordPress"]);
      setSeoTitle(initialData.seoMetadata?.seoTitle || initialData.title || "");
      setMetaDescription(initialData.seoMetadata?.metaDescription || "");
      setKeywords(initialData.seoMetadata?.keywords || "");
    }
  }, [initialData]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugCustom) {
      setSlug(slugify(val));
    }
    if (!seoTitle || seoTitle === title) {
      setSeoTitle(val);
    }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const toggleAdapter = (adapterId: string) => {
    setSelectedAdapters((prev) =>
      prev.includes(adapterId)
        ? prev.filter((a) => a !== adapterId)
        : [...prev, adapterId]
    );
  };

  const handleSave = (targetStatus?: ContentItem["status"]) => {
    const finalStatus = targetStatus || status;
    onSave({
      id: initialData?.id,
      title: title || "Untitled Article",
      slug: slug || slugify(title || "untitled-article"),
      body,
      category,
      tags,
      featuredImage,
      status: finalStatus,
      publishDate: finalStatus === "published" ? new Date().toLocaleString() : publishDate,
      adapters: selectedAdapters,
      seoMetadata: {
        seoTitle,
        metaDescription,
        keywords,
      },
      seoScore: initialData?.seoScore || 94,
      geoScore: initialData?.geoScore || 90,
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12">
      {/* Top Bar Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="gap-1.5 rounded-md"
          >
            <ArrowLeft className="size-4" />
            Back to Articles
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              {isEditing ? `Edit: ${initialData?.title}` : "Create New Article"}
            </h1>
            <p className="text-xs text-muted-foreground">
              Write once, optimize with AI, and publish to connected platform adapters.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave("draft")}
            className="gap-1.5 rounded-md"
          >
            <Save className="size-4" />
            Save Draft
          </Button>
          <Button
            size="sm"
            onClick={() => handleSave("published")}
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md"
          >
            <Send className="size-4" />
            Publish Now
          </Button>
        </div>
      </div>

      {/* 2-Column Full Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT MAIN COLUMN (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Article Title & Slug Box */}
          <Card className="p-6 space-y-4 shadow-xs rounded-lg">
            <div className="space-y-2">
              <Input
                placeholder="Enter article title here..."
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="text-2xl md:text-3xl font-bold tracking-tight border-none shadow-none focus-visible:ring-0 px-0 h-auto py-1"
              />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium">URL Slug:</span>
                <span className="text-primary font-mono">/</span>
                <Input
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setIsSlugCustom(true);
                  }}
                  className="h-6 text-xs font-mono w-full max-w-md py-0 border-muted focus-visible:ring-1 rounded-sm"
                  placeholder="article-url-slug"
                />
              </div>
            </div>
          </Card>

          {/* Spacious Body Editor Canvas */}
          <Card className="p-6 space-y-3 shadow-xs rounded-lg">
            <div className="flex items-center justify-between border-b pb-2">
              <Label className="text-sm font-semibold flex items-center gap-1.5">
                <FileText className="size-4 text-primary" />
                Article Content Editor
              </Label>
              <div className="text-xs text-muted-foreground">
                {body.split(/\s+/).filter(Boolean).length} Words · {body.length} Characters
              </div>
            </div>

            <Textarea
              placeholder="Start writing your article content here... (Markdown & Rich Text supported)"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-[500px] text-base leading-relaxed border-none shadow-none focus-visible:ring-0 p-2 resize-y"
            />
          </Card>

          {/* SEO & GEO Optimization Card */}
          <Card className="p-6 space-y-4 shadow-xs rounded-lg border-purple-500/20 bg-purple-500/5">
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
              <div className="flex items-center gap-2 font-bold text-base text-purple-700 dark:text-purple-300">
                <Sparkles className="size-5 text-purple-600 dark:text-purple-400" />
                SEO & GEO Engine Optimization
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 rounded-xs">
                  SEO: {initialData?.seoScore || 94}/100
                </Badge>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20 rounded-xs">
                  GEO: {initialData?.geoScore || 90}/100
                </Badge>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              <div className="space-y-2">
                <Label htmlFor="seoTitle" className="text-xs font-semibold flex items-center gap-1.5">
                  <Search className="size-3.5 text-amber-500" />
                  SEO Title Snippet
                </Label>
                <Input
                  id="seoTitle"
                  placeholder="Optimized headline displayed in search engines"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="bg-card rounded-md"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription" className="text-xs font-semibold">
                  Meta Description
                </Label>
                <Textarea
                  id="metaDescription"
                  rows={3}
                  placeholder="Compelling description for Google search results page snippet..."
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="bg-card rounded-md"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords" className="text-xs font-semibold">
                  Focus Keywords
                </Label>
                <Input
                  id="keywords"
                  placeholder="cms, content hub, write once publish everywhere"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="bg-card rounded-md"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT SIDEBAR (1/3 width) */}
        <div className="space-y-6">
          {/* Status & Publishing Box */}
          <Card className="p-5 space-y-4 shadow-xs rounded-lg">
            <CardHeader className="p-0 border-b pb-3">
              <CardTitle className="text-sm font-semibold">Publishing Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4 pt-1">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-xs font-medium">Status</Label>
                <Select
                  value={status}
                  onValueChange={(val) => setStatus(val as ContentItem["status"])}
                >
                  <SelectTrigger id="status" className="rounded-md">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {status === "scheduled" && (
                <div className="space-y-2">
                  <Label htmlFor="publishDate" className="text-xs font-medium">Release Date & Time</Label>
                  <Input
                    id="publishDate"
                    type="datetime-local"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="rounded-md"
                  />
                </div>
              )}

              <Button
                type="button"
                className="w-full rounded-md"
                onClick={() => handleSave()}
              >
                {isEditing ? "Save Changes" : "Save Article"}
              </Button>
            </CardContent>
          </Card>

          {/* Category & Tags Box */}
          <Card className="p-5 space-y-4 shadow-xs rounded-lg">
            <CardHeader className="p-0 border-b pb-3">
              <CardTitle className="text-sm font-semibold">Category & Tags</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4 pt-1">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-xs font-medium">Article Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" className="rounded-md">
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

              {/* Tags Input Manager */}
              <div className="space-y-2">
                <Label className="text-xs font-medium flex items-center gap-1.5">
                  <TagIcon className="size-3.5 text-primary" />
                  Article Tags
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag (e.g. SEO, Bun)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="text-xs rounded-md"
                  />
                  <Button type="button" size="sm" variant="outline" onClick={handleAddTag} className="shrink-0 rounded-md">
                    <Plus className="size-3.5" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs font-normal rounded-sm px-2 py-0.5 flex items-center gap-1 bg-muted hover:bg-muted/80"
                    >
                      #{tag}
                      <X
                        className="size-3 cursor-pointer text-muted-foreground hover:text-foreground ml-0.5"
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Target Platform Adapters */}
          <Card className="p-5 space-y-4 shadow-xs rounded-lg">
            <CardHeader className="p-0 border-b pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                <Globe className="size-4 text-blue-500" />
                Target Platform Adapters
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3 pt-1">
              <p className="text-xs text-muted-foreground">
                Select platforms to publish this content upon release:
              </p>
              <div className="space-y-2">
                {AVAILABLE_ADAPTERS.map((adapter) => (
                  <div
                    key={adapter.id}
                    className="flex items-center space-x-2 rounded-md border p-2 hover:bg-muted/50 cursor-pointer"
                    onClick={() => toggleAdapter(adapter.id)}
                  >
                    <Checkbox
                      id={`editor-adapter-${adapter.id}`}
                      checked={selectedAdapters.includes(adapter.id)}
                      onCheckedChange={() => toggleAdapter(adapter.id)}
                    />
                    <label
                      htmlFor={`editor-adapter-${adapter.id}`}
                      className="text-xs font-medium cursor-pointer flex-1"
                    >
                      {adapter.label}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Featured Image Box */}
          <Card className="p-5 space-y-4 shadow-xs rounded-lg">
            <CardHeader className="p-0 border-b pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                <ImageIcon className="size-4 text-emerald-500" />
                Featured Image
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3 pt-1">
              <Input
                placeholder="https://images.unsplash.com/photo-..."
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                className="text-xs rounded-md"
              />

              {featuredImage ? (
                <div className="relative h-44 rounded-md border overflow-hidden bg-muted">
                  <img
                    src={featuredImage}
                    alt="Featured Preview"
                    className="size-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              ) : (
                <div className="h-32 rounded-md border border-dashed flex flex-col items-center justify-center text-muted-foreground text-xs gap-1">
                  <ImageIcon className="size-6 opacity-50" />
                  <span>No featured image set</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
