import { useState } from "react";
import {
  Copy,
  Folder,
  Grid,
  Image as ImageIcon,
  List,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Video,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import type { MediaAsset } from "./media-upload-dialog";

interface MediaLibraryProps {
  data: MediaAsset[];
  onUploadNew: () => void;
  onEdit: (asset: MediaAsset) => void;
  onDelete: (id: string) => void;
  onCompressWebP: (id: string, mediaUrl: string) => void;
}

export function MediaLibrary({
  data,
  onUploadNew,
  onEdit,
  onDelete,
  onCompressWebP,
}: MediaLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFolder, setActiveFolder] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredData = data.filter((asset) => {
    const matchesSearch =
      asset.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.altText && asset.altText.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (asset.caption && asset.caption.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFolder =
      activeFolder === "all" || asset.folder.toLowerCase() === activeFolder.toLowerCase();

    return matchesSearch && matchesFolder;
  });

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search assets by file name or alt text..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center rounded-lg border p-1 bg-muted/40">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="size-7"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="size-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="size-7"
              onClick={() => setViewMode("list")}
            >
              <List className="size-4" />
            </Button>
          </div>

          <Button onClick={onUploadNew}>
            <Plus className="mr-1.5 size-4" />
            Upload Asset
          </Button>
        </div>
      </div>

      {/* Folder Tabs */}
      <Tabs
        defaultValue="all"
        value={activeFolder}
        onValueChange={setActiveFolder}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4 max-w-xl">
          <TabsTrigger value="all">
            <Folder className="mr-1.5 size-3.5" />
            All ({data.length})
          </TabsTrigger>
          <TabsTrigger value="Blog Assets">
            Blog Assets ({data.filter((d) => d.folder === "Blog Assets").length})
          </TabsTrigger>
          <TabsTrigger value="Social Media">
            Social ({data.filter((d) => d.folder === "Social Media").length})
          </TabsTrigger>
          <TabsTrigger value="Product Banners">
            Banners ({data.filter((d) => d.folder === "Product Banners").length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* GRID VIEW */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredData.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground border rounded-lg">
              No media assets found in this folder. Click Upload Asset to add media.
            </div>
          ) : (
            filteredData.map((asset) => (
              <Card
                key={asset.id}
                className="overflow-hidden group hover:border-primary/50 transition-colors"
              >
                <div className="relative aspect-video bg-muted/30 flex items-center justify-center overflow-hidden border-b">
                  <img
                    src={asset.fileUrl}
                    alt={asset.altText || asset.fileName}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />

                  {/* Format & WebP Badges */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    <Badge variant="secondary" className="text-[10px] uppercase backdrop-blur-md bg-background/80">
                      {asset.fileType.split("/")[1]}
                    </Badge>
                    {asset.isCompressed && (
                      <Badge variant="outline" className="text-[10px] bg-purple-500/20 text-purple-600 dark:text-purple-300 border-purple-500/30 backdrop-blur-md">
                        <Sparkles className="size-2.5 mr-0.5" /> WebP
                      </Badge>
                    )}
                  </div>

                  {/* Card Quick Overlay */}
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleCopyUrl(asset.id, asset.fileUrl)}
                    >
                      <Copy className="size-3.5 mr-1" />
                      {copiedId === asset.id ? "Copied!" : "Copy URL"}
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onEdit(asset)}
                    >
                      Inspect
                    </Button>
                  </div>
                </div>

                <CardContent className="p-3 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-xs truncate max-w-[180px]" title={asset.fileName}>
                      {asset.fileName}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-6">
                          <MoreHorizontal className="size-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Media Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(asset)}>
                          Inspect & Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopyUrl(asset.id, asset.fileUrl)}>
                          Copy S3 URL
                        </DropdownMenuItem>
                        {!asset.isCompressed && (
                          <DropdownMenuItem onClick={() => onCompressWebP(asset.id, asset.fileUrl)}>
                            <Sparkles className="mr-2 size-4 text-purple-500" />
                            Compress to WebP
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(asset.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 size-4" />
                          Delete Asset
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{asset.folder}</span>
                    <span>{asset.fileSize} KB</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="rounded-md border bg-card overflow-x-auto shadow-xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset Preview & Name</TableHead>
                <TableHead>Folder</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Alt Text</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded border overflow-hidden shrink-0 bg-muted">
                        <img
                          src={asset.fileUrl}
                          alt=""
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate max-w-xs">{asset.fileName}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-xs">{asset.fileUrl}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{asset.folder}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="uppercase text-xs">
                      {asset.fileType.split("/")[1]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {asset.fileSize} KB
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground truncate max-w-xs">
                    {asset.altText || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyUrl(asset.id, asset.fileUrl)}
                      >
                        <Copy className="size-3.5 mr-1" />
                        {copiedId === asset.id ? "Copied" : "URL"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(asset)}
                      >
                        Inspect
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
