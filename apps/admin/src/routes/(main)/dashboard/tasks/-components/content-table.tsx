import { useState } from "react";
import {
  Archive,
  CheckCircle2,
  Clock,
  Edit,
  Eye,
  Globe,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
  onCreateNew: () => void;
}

const statusStyles: Record<
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
  onCreateNew,
}: ContentTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = activeTab === "all" || item.status === activeTab;

    return matchesSearch && matchesTab;
  });

  const getCount = (status: string) => {
    if (status === "all") return data.length;
    return data.filter((d) => d.status === status).length;
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar: Search & Create Button */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search articles by title, slug or category..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={onCreateNew}>
          <Plus className="mr-1.5 size-4" />
          Create Article
        </Button>
      </div>

      {/* Filter Tabs */}
      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-5 max-w-xl">
          <TabsTrigger value="all">
            All ({getCount("all")})
          </TabsTrigger>
          <TabsTrigger value="published">
            Published ({getCount("published")})
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            Scheduled ({getCount("scheduled")})
          </TabsTrigger>
          <TabsTrigger value="draft">
            Drafts ({getCount("draft")})
          </TabsTrigger>
          <TabsTrigger value="archived">
            Archived ({getCount("archived")})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Content Table */}
      <div className="rounded-md border bg-card overflow-x-auto shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Article Title & Slug</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Target Adapters</TableHead>
              <TableHead className="text-center">SEO Score</TableHead>
              <TableHead className="text-center">GEO Score</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-32 text-center text-muted-foreground"
                >
                  No articles found. Try adjusting your search or create a new article.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {article.featuredImage && (
                        <div className="size-8 rounded border overflow-hidden shrink-0 hidden sm:block">
                          <img
                            src={article.featuredImage}
                            alt=""
                            className="size-full object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate max-w-xs">
                          {article.title}
                        </div>
                        <div className="text-xs text-muted-foreground truncate max-w-xs">
                          /{article.slug}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">{article.category}</Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusStyles[article.status].className}
                    >
                      {statusStyles[article.status].label}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {article.adapters.map((adapter) => (
                        <Badge
                          key={adapter}
                          variant="secondary"
                          className="text-xs font-normal"
                        >
                          <Globe className="mr-1 size-3 text-muted-foreground" />
                          {adapter}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1 font-semibold text-xs text-emerald-600 dark:text-emerald-400">
                      <Search className="size-3" />
                      {article.seoScore ?? 92}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1 font-semibold text-xs text-purple-600 dark:text-purple-400">
                      <Sparkles className="size-3" />
                      {article.geoScore ?? 88}
                    </span>
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {article.publishDate || article.updatedAt || article.createdAt || "N/A"}
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(article)}>
                          <Edit className="mr-2 size-4 text-blue-500" />
                          Edit Article
                        </DropdownMenuItem>
                        {article.status !== "published" && (
                          <DropdownMenuItem onClick={() => onPublish(article.id)}>
                            <Send className="mr-2 size-4 text-emerald-500" />
                            Quick Publish
                          </DropdownMenuItem>
                        )}
                        {article.status !== "archived" && (
                          <DropdownMenuItem onClick={() => onArchive(article.id)}>
                            <Archive className="mr-2 size-4 text-amber-500" />
                            Archive Article
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(article.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 size-4" />
                          Delete Article
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
