import { useState } from "react";
import {
  Archive,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Globe,
  MoreHorizontal,
  Search,
  Send,
  Sparkles,
  Tag as TagIcon,
  Trash2,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ContentItem } from "./content-editor";

interface ContentTableProps {
  data: ContentItem[];
  onEdit: (item: ContentItem) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onArchive: (id: string) => void;
  onStatusChange: (id: string, newStatus: ContentItem["status"]) => void;
  onBulkPublish?: (ids: string[]) => void;
  onBulkArchive?: (ids: string[]) => void;
  onBulkDelete?: (ids: string[]) => void;
}

const statusBadgeStyles: Record<
  ContentItem["status"],
  { label: string; className: string }
> = {
  published: {
    label: "Published",
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  scheduled: {
    label: "Scheduled",
    className:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  draft: {
    label: "Draft",
    className:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  archived: {
    label: "Archived",
    className:
      "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  },
};

export function ContentTable({
  data,
  onEdit,
  onDelete,
  onPublish,
  onArchive,
  onStatusChange,
  onBulkPublish,
  onBulkArchive,
  onBulkDelete,
}: ContentTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [previewArticle, setPreviewArticle] = useState<ContentItem | null>(null);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination state
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesTab = activeTab === "all" || item.status === activeTab;

    return matchesSearch && matchesTab;
  });

  // Calculate pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const getCount = (status: string) => {
    if (status === "all") return data.length;
    return data.filter((d) => d.status === status).length;
  };

  // Bulk selection handlers
  const isAllPaginatedSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) => selectedIds.includes(item.id));

  const toggleSelectAll = () => {
    if (isAllPaginatedSelected) {
      const paginatedIds = paginatedData.map((d) => d.id);
      setSelectedIds(selectedIds.filter((id) => !paginatedIds.includes(id)));
    } else {
      const paginatedIds = paginatedData.map((d) => d.id);
      const combined = new Set([...selectedIds, ...paginatedIds]);
      setSelectedIds(Array.from(combined));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleExecuteBulkPublish = () => {
    if (onBulkPublish && selectedIds.length > 0) {
      onBulkPublish(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleExecuteBulkArchive = () => {
    if (onBulkArchive && selectedIds.length > 0) {
      onBulkArchive(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleExecuteBulkDelete = () => {
    if (onBulkDelete && selectedIds.length > 0) {
      onBulkDelete(selectedIds);
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar: Search & Status Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, slug, category, or #tag..."
            className="pl-9 h-9 text-xs rounded-md"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Status Filter Tabs */}
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={(val) => {
            setActiveTab(val);
            setCurrentPage(1);
          }}
          className="w-full md:w-auto"
        >
          <TabsList className="grid grid-cols-5 h-9 p-0.5 rounded-md bg-muted/60 text-xs">
            <TabsTrigger value="all" className="rounded-xs text-xs px-2.5">
              All ({getCount("all")})
            </TabsTrigger>
            <TabsTrigger value="published" className="rounded-xs text-xs px-2.5">
              Published ({getCount("published")})
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="rounded-xs text-xs px-2.5">
              Scheduled ({getCount("scheduled")})
            </TabsTrigger>
            <TabsTrigger value="draft" className="rounded-xs text-xs px-2.5">
              Drafts ({getCount("draft")})
            </TabsTrigger>
            <TabsTrigger value="archived" className="rounded-xs text-xs px-2.5">
              Archived ({getCount("archived")})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* FLOATING / STICKY BULK ACTIONS BAR */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <CheckCircle2 className="size-4" />
            <span>{selectedIds.length} article(s) selected</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleExecuteBulkPublish}
              className="h-8 text-xs border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 gap-1 rounded-md"
            >
              <Send className="size-3.5" />
              Bulk Publish
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleExecuteBulkArchive}
              className="h-8 text-xs border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 gap-1 rounded-md"
            >
              <Archive className="size-3.5" />
              Bulk Archive
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleExecuteBulkDelete}
              className="h-8 text-xs gap-1 rounded-md"
            >
              <Trash2 className="size-3.5" />
              Bulk Delete
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedIds([])}
              className="h-8 text-xs text-muted-foreground rounded-md"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Neat Rounded Card Container for Table & Sticky Footer */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto max-h-[620px]">
          <Table>
            <TableHeader className="bg-muted/40 sticky top-0 z-10 backdrop-blur-xs">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="w-10 py-2.5 pl-4 pr-1">
                  <Checkbox
                    checked={isAllPaginatedSelected}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-[300px] text-xs font-semibold py-2.5">Article Title & Slug</TableHead>
                <TableHead className="text-xs font-semibold py-2.5">Category & Tags</TableHead>
                <TableHead className="text-xs font-semibold py-2.5">Inline Status</TableHead>
                <TableHead className="text-xs font-semibold py-2.5">Target Adapters</TableHead>
                <TableHead className="text-center text-xs font-semibold py-2.5">SEO</TableHead>
                <TableHead className="text-center text-xs font-semibold py-2.5">GEO</TableHead>
                <TableHead className="text-xs font-semibold py-2.5">Date</TableHead>
                <TableHead className="text-right text-xs font-semibold py-2.5 pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-32 text-center text-muted-foreground text-xs"
                  >
                    No articles match your search or filter.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((article) => {
                  const isSelected = selectedIds.includes(article.id);
                  return (
                    <TableRow
                      key={article.id}
                      className={`hover:bg-muted/30 border-b ${isSelected ? "bg-primary/5" : ""}`}
                    >
                      {/* Checkbox Column */}
                      <TableCell className="py-2.5 pl-4 pr-1">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSelectRow(article.id)}
                        />
                      </TableCell>

                      {/* Title & Slug Column */}
                      <TableCell className="py-2.5">
                        <div className="flex items-center gap-2.5">
                          {article.featuredImage && (
                            <div className="size-8 rounded border overflow-hidden shrink-0 hidden sm:block bg-muted">
                              <img
                                src={article.featuredImage}
                                alt=""
                                className="size-full object-cover"
                              />
                            </div>
                          )}
                          <div className="min-w-0 space-y-0.5">
                            <div
                              onClick={() => onEdit(article)}
                              className="font-semibold text-xs truncate max-w-xs hover:text-primary cursor-pointer"
                              title={article.title}
                            >
                              {article.title}
                            </div>
                            <div className="text-[11px] text-muted-foreground font-mono truncate max-w-xs">
                              /{article.slug}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Category & Tags Column */}
                      <TableCell className="py-2.5 px-3">
                        <div className="flex flex-col gap-1 items-start">
                          <Badge variant="outline" className="text-[11px] font-medium rounded-xs px-1.5 py-0">
                            {article.category}
                          </Badge>
                          {article.tags && article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {article.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] text-muted-foreground font-medium bg-muted/60 px-1 rounded-xs"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* INLINE STATUS SELECTOR DROPDOWN */}
                      <TableCell className="py-2.5 px-3">
                        <Select
                          value={article.status}
                          onValueChange={(val) =>
                            onStatusChange(article.id, val as ContentItem["status"])
                          }
                        >
                          <SelectTrigger
                            className={`h-7 text-xs font-medium rounded-xs border w-28 px-2 py-0 ${statusBadgeStyles[article.status].className}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent align="start">
                            <SelectItem value="draft" className="text-xs">Draft</SelectItem>
                            <SelectItem value="scheduled" className="text-xs">Scheduled</SelectItem>
                            <SelectItem value="published" className="text-xs">Published</SelectItem>
                            <SelectItem value="archived" className="text-xs">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>

                      {/* Target Adapters Badges */}
                      <TableCell className="py-2.5 px-3">
                        <div className="flex flex-wrap gap-1">
                          {article.adapters.map((adapter) => (
                            <Badge
                              key={adapter}
                              variant="secondary"
                              className="text-[10px] font-normal rounded-xs px-1.5 py-0"
                            >
                              <Globe className="mr-0.5 size-2.5 text-muted-foreground" />
                              {adapter}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>

                      {/* SEO Score */}
                      <TableCell className="text-center py-2.5 px-3">
                        <span className="inline-flex items-center gap-0.5 font-semibold text-[11px] text-emerald-600 dark:text-emerald-400">
                          <Search className="size-3" />
                          {article.seoScore ?? 94}
                        </span>
                      </TableCell>

                      {/* GEO Score */}
                      <TableCell className="text-center py-2.5 px-3">
                        <span className="inline-flex items-center gap-0.5 font-semibold text-[11px] text-purple-600 dark:text-purple-400">
                          <Sparkles className="size-3" />
                          {article.geoScore ?? 90}
                        </span>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="text-[11px] text-muted-foreground whitespace-nowrap py-2.5 px-3">
                        {article.publishDate || article.updatedAt || article.createdAt || "N/A"}
                      </TableCell>

                      {/* Actions Menu + Live Preview Button */}
                      <TableCell className="text-right py-2.5 pr-4">
                        <div className="flex items-center justify-end gap-1">
                          {/* Live Preview Drawer Trigger */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 rounded-xs text-muted-foreground hover:text-foreground"
                            title="Quick Live Preview"
                            onClick={() => setPreviewArticle(article)}
                          >
                            <Eye className="size-3.5" />
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-7 rounded-xs">
                                <MoreHorizontal className="size-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onEdit(article)}>
                                <Edit className="mr-2 size-3.5 text-blue-500" />
                                Edit Article
                              </DropdownMenuItem>
                              {article.status !== "published" && (
                                <DropdownMenuItem onClick={() => onPublish(article.id)}>
                                  <Send className="mr-2 size-3.5 text-emerald-500" />
                                  Quick Publish
                                </DropdownMenuItem>
                              )}
                              {article.status !== "archived" && (
                                <DropdownMenuItem onClick={() => onArchive(article.id)}>
                                  <Archive className="mr-2 size-3.5 text-amber-500" />
                                  Archive Article
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => onDelete(article.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 size-3.5" />
                                Delete Article
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* STICKY FOOTER PAGINATION BAR */}
        <div className="sticky bottom-0 bg-card border-t z-10 px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(val) => {
                setPageSize(Number(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-7 w-16 text-xs rounded-xs border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>

            <span className="hidden sm:inline-block ml-2 border-l pl-3">
              Showing {totalItems === 0 ? 0 : startIndex + 1}–
              {Math.min(startIndex + pageSize, totalItems)} of {totalItems} articles
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="size-7 rounded-xs"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                <ChevronLeft className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-7 rounded-xs"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* LIVE ARTICLE PREVIEW MODAL / DRAWER */}
      <Dialog
        open={Boolean(previewArticle)}
        onOpenChange={(open) => !open && setPreviewArticle(null)}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <Badge variant="outline" className="rounded-xs">
                {previewArticle?.category}
              </Badge>
              {previewArticle?.tags?.map((t) => (
                <span key={t} className="text-muted-foreground">#{t}</span>
              ))}
            </div>
            <DialogTitle className="text-xl font-bold pt-1">
              {previewArticle?.title}
            </DialogTitle>
            <DialogDescription className="text-xs font-mono">
              /{previewArticle?.slug}
            </DialogDescription>
          </DialogHeader>

          {previewArticle && (
            <div className="space-y-4 py-2">
              {previewArticle.featuredImage && (
                <div className="relative h-48 rounded-lg overflow-hidden border bg-muted">
                  <img
                    src={previewArticle.featuredImage}
                    alt=""
                    className="size-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-2 rounded-md border p-3 bg-muted/20 text-xs">
                <div className="font-semibold flex items-center justify-between">
                  <span>Target Adapters & SEO Metrics</span>
                  <span className="text-emerald-600 font-semibold">SEO: {previewArticle.seoScore}/100</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {previewArticle.adapters.map((adp) => (
                    <Badge key={adp} variant="secondary" className="text-[10px] rounded-xs">
                      {adp}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap rounded-md border p-4 bg-card">
                {previewArticle.body}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
