import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FolderTree, Plus, Search, Tag as TagIcon, Trash2, Edit, Layers, Hash, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { categoryApi, tagApi } from "@/lib/api-client";

export const Route = createFileRoute("/(main)/dashboard/categories")({
  component: CategoriesPage,
});

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  articleCount?: number;
}

interface TagItem {
  id: string;
  name: string;
  slug: string;
  articleCount?: number;
}

const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: "cat_1", name: "Tutorial", slug: "tutorial", description: "Panduan teknis dan tutorial langkah-demi-langkah.", articleCount: 14 },
  { id: "cat_2", name: "Marketing", slug: "marketing", description: "Strategi content marketing dan pertumbuhan digital.", articleCount: 9 },
  { id: "cat_3", name: "Engineering", slug: "engineering", description: "Pengembangan software, API integration, dan arsitektur.", articleCount: 7 },
  { id: "cat_4", name: "AI & Automation", slug: "ai-automation", description: "Pemanfaatan kecerdasan buatan dalam workflow konten.", articleCount: 12 },
  { id: "cat_5", name: "Design", slug: "design", description: "UI/UX, visual branding, dan desain antarmuka.", articleCount: 5 },
];

const INITIAL_TAGS: TagItem[] = [
  { id: "tag_1", name: "SEO", slug: "seo", articleCount: 18 },
  { id: "tag_2", name: "GEO", slug: "geo", articleCount: 11 },
  { id: "tag_3", name: "CMS", slug: "cms", articleCount: 24 },
  { id: "tag_4", name: "WordPress", slug: "wordpress", articleCount: 15 },
  { id: "tag_5", name: "Astro", slug: "astro", articleCount: 8 },
  { id: "tag_6", name: "Next.js", slug: "nextjs", articleCount: 10 },
  { id: "tag_7", name: "AI", slug: "ai", articleCount: 16 },
  { id: "tag_8", name: "Automation", slug: "automation", articleCount: 7 },
];

function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [tags, setTags] = useState<TagItem[]>(INITIAL_TAGS);
  const [search, setSearch] = useState("");
  
  // Dialog state
  const [isCatDialogOpen, setIsCatDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catDesc, setCatDesc] = useState("");

  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [tagName, setTagName] = useState("");
  const [tagSlug, setTagSlug] = useState("");

  // Fetch API
  useEffect(() => {
    categoryApi.list()
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setCategories(res.data);
        }
      })
      .catch(() => {});

    tagApi.list()
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setTags(res.data);
        }
      })
      .catch(() => {});
  }, []);

  // Category handlers
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCatName("");
    setCatSlug("");
    setCatDesc("");
    setIsCatDialogOpen(true);
  };

  const handleOpenEditCategory = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatDesc(cat.description);
    setIsCatDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!catName.trim()) return;
    const slug = catSlug.trim() || catName.toLowerCase().replace(/\s+/g, "-");

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? { ...c, name: catName, slug, description: catDesc } : c))
      );
      await categoryApi.update(editingCategory.id, { name: catName, description: catDesc });
      toast.add({ type: "success", title: "Category updated successfully" });
    } else {
      const newCat: CategoryItem = {
        id: `cat_${Date.now()}`,
        name: catName,
        slug,
        description: catDesc,
        articleCount: 0,
      };
      setCategories((prev) => [...prev, newCat]);
      await categoryApi.create({ name: catName, description: catDesc });
      toast.add({ type: "success", title: "Category created successfully" });
    }

    setIsCatDialogOpen(false);
  };

  const handleDeleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    await categoryApi.delete(id);
    toast.add({ type: "success", title: "Category deleted successfully" });
  };

  // Tag handlers
  const handleSaveTag = async () => {
    if (!tagName.trim()) return;
    const slug = tagSlug.trim() || tagName.toLowerCase().replace(/\s+/g, "-");

    const newTag: TagItem = {
      id: `tag_${Date.now()}`,
      name: tagName,
      slug,
      articleCount: 0,
    };
    setTags((prev) => [...prev, newTag]);
    await tagApi.create({ name: tagName });
    toast.add({ type: "success", title: "Tag created successfully" });

    setTagName("");
    setTagSlug("");
    setIsTagDialogOpen(false);
  };

  const handleDeleteTag = async (id: string) => {
    setTags((prev) => prev.filter((t) => t.id !== id));
    await tagApi.delete(id);
    toast.add({ type: "success", title: "Tag deleted successfully" });
  };

  const filteredCategories = categories.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTags = tags.filter(
    (t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12 font-sans">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderTree className="size-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Categories & Taxonomy Management</h1>
          </div>
          <p className="text-muted-foreground text-xs mt-1">
            Organize articles with structured categories and taxonomy tags for multi-platform distribution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search category or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs rounded-md"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="bg-muted p-1 rounded-lg inline-flex gap-1 mb-4">
          <TabsTrigger value="categories" className="flex items-center gap-2 text-xs rounded-md">
            <Layers className="size-3.5" />
            Categories ({categories.length})
          </TabsTrigger>
          <TabsTrigger value="tags" className="flex items-center gap-2 text-xs rounded-md">
            <Hash className="size-3.5" />
            Tags ({tags.length})
          </TabsTrigger>
        </TabsList>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Category Hierarchy</h2>
              <p className="text-xs text-muted-foreground">Primary topics used to categorize articles across platforms</p>
            </div>
            <Button onClick={handleOpenAddCategory} size="sm" className="rounded-md">
              <Plus className="mr-1.5 size-4" />
              Add Category
            </Button>
          </div>

          <Card className="shadow-xs rounded-xl overflow-hidden border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-semibold text-xs">Category Name</TableHead>
                  <TableHead className="font-semibold text-xs">Slug</TableHead>
                  <TableHead className="font-semibold text-xs">Description</TableHead>
                  <TableHead className="font-semibold text-xs text-center">Articles</TableHead>
                  <TableHead className="font-semibold text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs">
                      No categories found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((cat) => (
                    <TableRow key={cat.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-semibold text-sm">
                        <div className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-primary/80" />
                          {cat.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted/80 px-2 py-0.5 rounded font-mono text-muted-foreground">/{cat.slug}</code>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs max-w-md truncate">
                        {cat.description || "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="text-xs font-normal">
                          {cat.articleCount ?? 0} articles
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="size-8" onClick={() => handleOpenEditCategory(cat)}>
                            <Edit className="size-4 text-muted-foreground hover:text-foreground" />
                          </Button>
                          <Button variant="ghost" size="icon" className="size-8" onClick={() => handleDeleteCategory(cat.id)}>
                            <Trash2 className="size-4 text-destructive hover:text-destructive/80" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Tags Tab */}
        <TabsContent value="tags" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Taxonomy Tags</h2>
              <p className="text-xs text-muted-foreground">Cross-topic keywords used for search indexing and GEO optimization</p>
            </div>
            <Button onClick={() => setIsTagDialogOpen(true)} size="sm" className="rounded-md">
              <Plus className="mr-1.5 size-4" />
              Add Tag
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tag Cloud Card */}
            <Card className="md:col-span-1 shadow-xs rounded-xl border p-5 space-y-4">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="size-4 text-purple-500" />
                  Tag Cloud Overview
                </CardTitle>
                <CardDescription className="text-xs mt-1">Quick view of all active taxonomy tags</CardDescription>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {tags.map((t) => (
                  <Badge key={t.id} variant="secondary" className="text-xs py-1 px-2.5 flex items-center gap-1.5 bg-muted/80 hover:bg-muted font-normal rounded-md">
                    #{t.name}
                    <span className="text-[10px] text-muted-foreground bg-background rounded-full px-1.5 font-semibold">
                      {t.articleCount ?? 0}
                    </span>
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Tag Table */}
            <Card className="md:col-span-2 shadow-xs rounded-xl overflow-hidden border">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-semibold text-xs">Tag Name</TableHead>
                    <TableHead className="font-semibold text-xs">Slug</TableHead>
                    <TableHead className="font-semibold text-xs text-center">Articles</TableHead>
                    <TableHead className="font-semibold text-xs text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTags.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground text-xs">
                        No tags found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTags.map((t) => (
                      <TableRow key={t.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium text-sm flex items-center gap-1.5">
                          <Hash className="size-3.5 text-primary" />
                          {t.name}
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted/80 px-2 py-0.5 rounded font-mono text-muted-foreground">/{t.slug}</code>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="text-xs">{t.articleCount ?? 0}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="size-8" onClick={() => handleDeleteTag(t.id)}>
                            <Trash2 className="size-4 text-destructive hover:text-destructive/80" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog Add/Edit Category */}
      <Dialog open={isCatDialogOpen} onOpenChange={setIsCatDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
            <DialogDescription className="text-xs">
              Categories define the primary taxonomy structure of your articles across platforms.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Category Name</Label>
              <Input
                placeholder="e.g. Tutorials"
                value={catName}
                onChange={(e) => {
                  setCatName(e.target.value);
                  if (!editingCategory) {
                    setCatSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  }
                }}
                className="text-xs rounded-md"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">URL Slug</Label>
              <Input placeholder="e.g. tutorials" value={catSlug} onChange={(e) => setCatSlug(e.target.value)} className="text-xs font-mono rounded-md" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Description</Label>
              <Textarea
                placeholder="Category summary and description..."
                value={catDesc}
                onChange={(e) => setCatDesc(e.target.value)}
                className="h-20 text-xs rounded-md"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsCatDialogOpen(false)} className="rounded-md">
              Cancel
            </Button>
            <Button onClick={handleSaveCategory} className="rounded-md">Save Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Add Tag */}
      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Add New Tag</DialogTitle>
            <DialogDescription className="text-xs">Taxonomy tags help cross-reference content topics in search and AI engines.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Tag Name</Label>
              <Input
                placeholder="e.g. Next.js"
                value={tagName}
                onChange={(e) => {
                  setTagName(e.target.value);
                  setTagSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                }}
                className="text-xs rounded-md"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">URL Slug</Label>
              <Input placeholder="e.g. nextjs" value={tagSlug} onChange={(e) => setTagSlug(e.target.value)} className="text-xs font-mono rounded-md" />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsTagDialogOpen(false)} className="rounded-md">
              Cancel
            </Button>
            <Button onClick={handleSaveTag} className="rounded-md">Save Tag</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
