import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Grid,
  List,
  Copy,
  Check,
  Trash2,
  FileText,
  Eye,
  Download,
  Folder,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { mediaApi } from "@/lib/api-client";

export const Route = createFileRoute("/(main)/dashboard/media")({
  component: MediaPage,
});

interface MediaItem {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number; // in KB
  altText?: string;
  caption?: string;
  createdAt: string;
}

const INITIAL_MEDIA: MediaItem[] = [
  {
    id: "med_101",
    fileName: "seo-geo-banner.jpg",
    fileUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
    fileType: "image/jpeg",
    fileSize: 342,
    altText: "SEO & GEO Optimization Banner",
    caption: "Banner image for CMS optimization tutorial",
    createdAt: "2026-08-01 10:15",
  },
  {
    id: "med_102",
    fileName: "content-strategy-dashboard.jpg",
    fileUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    fileType: "image/jpeg",
    fileSize: 512,
    altText: "Analytics Dashboard Overview",
    caption: "Marketing strategy content performance chart",
    createdAt: "2026-07-31 14:00",
  },
  {
    id: "med_103",
    fileName: "code-editor-astro.jpg",
    fileUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    fileType: "image/jpeg",
    fileSize: 280,
    altText: "Headless CMS Astro Integration Code",
    caption: "Developer workstation setup",
    createdAt: "2026-07-30 09:30",
  },
  {
    id: "med_104",
    fileName: "ai-brain-network.jpg",
    fileUrl: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&q=80",
    fileType: "image/jpeg",
    fileSize: 610,
    altText: "AI Writing Assistant Visualization",
    caption: "Generative AI graph connection",
    createdAt: "2026-07-28 16:45",
  },
  {
    id: "med_105",
    fileName: "ux-micro-animations.jpg",
    fileUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80",
    fileType: "image/jpeg",
    fileSize: 425,
    altText: "Modern Web Design Layout",
    caption: "User interface micro animation design showcase",
    createdAt: "2026-07-25 11:10",
  },
];

function MediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "image" | "document">("all");
  
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newFileUrl, setNewFileUrl] = useState("");
  const [newFileName, setNewFileName] = useState("");

  // Fetch API
  useEffect(() => {
    mediaApi.list()
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setMediaList(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.add({ type: "success", title: "Image URL copied to clipboard" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteMedia = async (id: string) => {
    setMediaList((prev) => prev.filter((m) => m.id !== id));
    if (selectedMedia?.id === id) setSelectedMedia(null);
    await mediaApi.delete(id);
    toast.add({ type: "success", title: "Media asset deleted" });
  };

  const handleUploadSubmit = async () => {
    if (!newFileUrl.trim()) return;
    const fileName = newFileName.trim() || newFileUrl.split("/").pop() || "uploaded-image.jpg";
    const newMedia: MediaItem = {
      id: `med_${Date.now()}`,
      fileName,
      fileUrl: newFileUrl,
      fileType: fileName.endsWith(".png") ? "image/png" : "image/jpeg",
      fileSize: Math.floor(Math.random() * 400) + 150,
      createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
    };

    setMediaList((prev) => [newMedia, ...prev]);
    await mediaApi.upload({
      fileName: newMedia.fileName,
      fileType: newMedia.fileType,
      fileSize: newMedia.fileSize,
      fileUrl: newMedia.fileUrl,
    });
    toast.add({ type: "success", title: "Media uploaded successfully" });

    setNewFileUrl("");
    setNewFileName("");
    setIsUploadOpen(false);
  };

  const filteredMedia = mediaList.filter((m) => {
    const matchesSearch = m.fileName.toLowerCase().includes(search.toLowerCase()) || (m.altText && m.altText.toLowerCase().includes(search.toLowerCase()));
    if (filterType === "image") return matchesSearch && m.fileType.startsWith("image/");
    if (filterType === "document") return matchesSearch && !m.fileType.startsWith("image/");
    return matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12 font-sans">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ImageIcon className="size-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Media Assets Library</h1>
          </div>
          <p className="text-muted-foreground text-xs mt-1">
            Upload, manage, and attach images and media assets to your articles across connected platform adapters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-56">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search media assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs rounded-md"
            />
          </div>

          <div className="flex items-center border rounded-md p-0.5 bg-card">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="size-8"
            >
              <Grid className="size-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="size-8"
            >
              <List className="size-4" />
            </Button>
          </div>

          <Button onClick={() => setIsUploadOpen(true)} size="sm" className="rounded-md">
            <Upload className="mr-1.5 size-4" />
            Upload Media
          </Button>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <Button
            variant={filterType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("all")}
            className="h-8 text-xs px-3 rounded-md"
          >
            All Assets ({mediaList.length})
          </Button>
          <Button
            variant={filterType === "image" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("image")}
            className="h-8 text-xs px-3 rounded-md"
          >
            Images
          </Button>
          <Button
            variant={filterType === "document" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("document")}
            className="h-8 text-xs px-3 rounded-md"
          >
            Documents
          </Button>
        </div>

        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Folder className="size-3.5 text-primary" />
          <span>Storage: <strong>MinIO S3 Bucket</strong></span>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((media) => (
            <Card
              key={media.id}
              onClick={() => setSelectedMedia(media)}
              className="group cursor-pointer overflow-hidden border hover:border-primary/80 transition-all shadow-xs rounded-xl"
            >
              <div className="aspect-square bg-muted/60 relative overflow-hidden flex items-center justify-center">
                {media.fileType.startsWith("image/") ? (
                  <img
                    src={media.fileUrl}
                    alt={media.altText || media.fileName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <FileText className="size-12 text-muted-foreground" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="icon" variant="secondary" className="size-8 rounded-full shadow">
                    <Eye className="size-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="size-8 rounded-full shadow" onClick={(e) => { e.stopPropagation(); handleCopyUrl(media.fileUrl, media.id); }}>
                    <Copy className="size-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-xs font-semibold truncate">{media.fileName}</p>
                <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground">
                  <span>{media.fileSize} KB</span>
                  <Badge variant="outline" className="text-[10px] py-0 px-1 font-mono">
                    {media.fileType.split("/")[1]?.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <Card className="shadow-xs rounded-xl overflow-hidden border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-16 font-semibold text-xs">Preview</TableHead>
                <TableHead className="font-semibold text-xs">File Name</TableHead>
                <TableHead className="font-semibold text-xs">Type</TableHead>
                <TableHead className="font-semibold text-xs">Size</TableHead>
                <TableHead className="font-semibold text-xs">Uploaded At</TableHead>
                <TableHead className="text-right font-semibold text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedia.map((media) => (
                <TableRow key={media.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="size-10 rounded-md bg-muted overflow-hidden flex items-center justify-center border">
                      {media.fileType.startsWith("image/") ? (
                        <img src={media.fileUrl} alt={media.fileName} className="w-full h-full object-cover" />
                      ) : (
                        <FileText className="size-5 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-xs">
                    <p className="font-semibold text-sm">{media.fileName}</p>
                    <p className="text-[11px] text-muted-foreground truncate max-w-xs">{media.fileUrl}</p>
                  </TableCell>
                  <TableCell className="text-xs">
                    <Badge variant="secondary" className="font-mono text-[10px]">{media.fileType}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{media.fileSize} KB</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{media.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="size-8" onClick={() => handleCopyUrl(media.fileUrl, media.id)}>
                        {copiedId === media.id ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8" onClick={() => setSelectedMedia(media)}>
                        <Eye className="size-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8" onClick={() => handleDeleteMedia(media.id)}>
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Media Detail Drawer / Sheet */}
      <Sheet open={!!selectedMedia} onOpenChange={(open) => !open && setSelectedMedia(null)}>
        {selectedMedia && (
          <SheetContent className="sm:max-w-md overflow-y-auto p-6 rounded-l-xl">
            <SheetHeader>
              <SheetTitle className="text-lg font-bold">Media Asset Details</SheetTitle>
              <SheetDescription className="text-xs">
                Asset metadata and URL integration info.
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 py-4">
              {/* Preview */}
              <div className="rounded-xl border bg-muted/60 p-2 flex items-center justify-center max-h-64 overflow-hidden">
                {selectedMedia.fileType.startsWith("image/") ? (
                  <img
                    src={selectedMedia.fileUrl}
                    alt={selectedMedia.fileName}
                    className="max-h-56 object-contain rounded-lg shadow-xs"
                  />
                ) : (
                  <FileText className="size-16 text-muted-foreground py-8" />
                )}
              </div>

              {/* Info grid */}
              <div className="space-y-3 text-xs">
                <div>
                  <Label className="text-muted-foreground text-[11px] font-semibold">File Name</Label>
                  <p className="font-semibold text-sm">{selectedMedia.fileName}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground text-[11px] font-semibold">Direct File URL</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input value={selectedMedia.fileUrl} readOnly className="text-xs font-mono h-8 rounded-md" />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyUrl(selectedMedia.fileUrl, selectedMedia.id)}
                      className="rounded-md"
                    >
                      {copiedId === selectedMedia.id ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-3">
                  <div>
                    <Label className="text-muted-foreground text-[11px] font-semibold">File Size</Label>
                    <p className="font-medium">{selectedMedia.fileSize} KB</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-[11px] font-semibold">Format</Label>
                    <p className="font-medium font-mono">{selectedMedia.fileType}</p>
                  </div>
                </div>

                {selectedMedia.altText && (
                  <div>
                    <Label className="text-muted-foreground text-[11px] font-semibold">Alt Text</Label>
                    <p className="font-medium">{selectedMedia.altText}</p>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 flex items-center justify-between">
                <Button variant="destructive" size="sm" onClick={() => handleDeleteMedia(selectedMedia.id)} className="rounded-md">
                  <Trash2 className="mr-1.5 size-4" />
                  Delete Asset
                </Button>
                <a href={selectedMedia.fileUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="rounded-md">
                    <Download className="mr-1.5 size-4" />
                    Open Original
                  </Button>
                </a>
              </div>
            </div>
          </SheetContent>
        )}
      </Sheet>

      {/* Upload Modal */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-md rounded-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Upload Media Asset</DialogTitle>
            <DialogDescription className="text-xs">
              Add a new image URL or asset link to your Wontent media library.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">File URL / Image Link</Label>
              <Input
                placeholder="https://images.unsplash.com/..."
                value={newFileUrl}
                onChange={(e) => setNewFileUrl(e.target.value)}
                className="text-xs rounded-md font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">File Name (Optional)</Label>
              <Input
                placeholder="e.g. hero-banner.jpg"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                className="text-xs rounded-md"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsUploadOpen(false)} className="rounded-md">
              Cancel
            </Button>
            <Button onClick={handleUploadSubmit} className="rounded-md">Upload Asset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
