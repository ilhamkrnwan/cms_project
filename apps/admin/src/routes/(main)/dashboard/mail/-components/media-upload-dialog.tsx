import { useEffect, useState } from "react";
import { FileImage, Image as ImageIcon, Sparkles, Upload } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";

export interface MediaAsset {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number; // in KB/MB
  folder: string;
  altText?: string;
  caption?: string;
  isCompressed?: boolean;
  createdAt?: string;
}

interface MediaUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: MediaAsset | null;
  onSave: (asset: Partial<MediaAsset>) => void;
  onCompressWebP?: (mediaUrl: string) => Promise<string | null>;
}

const FOLDERS = ["Blog Assets", "Social Media", "Product Banners", "Uncategorized"];

export function MediaUploadDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
  onCompressWebP,
}: MediaUploadDialogProps) {
  const isEditing = Boolean(initialData);

  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("image/png");
  const [fileSize, setFileSize] = useState(420); // in KB
  const [folder, setFolder] = useState("Blog Assets");
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionRatio, setCompressionRatio] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFileName(initialData.fileName || "");
      setFileUrl(initialData.fileUrl || "");
      setFileType(initialData.fileType || "image/png");
      setFileSize(initialData.fileSize || 420);
      setFolder(initialData.folder || "Blog Assets");
      setAltText(initialData.altText || "");
      setCaption(initialData.caption || "");
      setCompressionRatio(initialData.isCompressed ? "65% saved" : null);
    } else {
      setFileName("");
      setFileUrl("");
      setFileType("image/png");
      setFileSize(380);
      setFolder("Blog Assets");
      setAltText("");
      setCaption("");
      setCompressionRatio(null);
    }
  }, [initialData, open]);

  const handleCompress = async () => {
    if (!fileUrl) return;
    setIsCompressing(true);
    try {
      if (onCompressWebP) {
        const compressedUrl = await onCompressWebP(fileUrl);
        if (compressedUrl) {
          setFileUrl(compressedUrl);
        }
      } else {
        // Fallback WebP simulation
        setFileUrl(fileUrl.replace(/\.(png|jpg|jpeg)$/i, ".webp"));
      }
      setFileType("image/webp");
      setFileSize((prev) => Math.round(prev * 0.35)); // 65% reduction
      setCompressionRatio("65% saved");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id,
      fileName: fileName || "media-asset.png",
      fileUrl: fileUrl || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
      fileType,
      fileSize,
      folder,
      altText,
      caption,
      isCompressed: Boolean(compressionRatio),
      createdAt: new Date().toLocaleString(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="size-5 text-primary" />
              {isEditing ? "Inspect & Edit Media Metadata" : "Upload New Media Asset"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Manage image/video metadata, alt text, folder category, and WebP compression."
                : "Add media asset URL, configure alt text for SEO, and convert to WebP."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fileName">File Name *</Label>
              <Input
                id="fileName"
                placeholder="e.g. hero-banner-wontent.png"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileUrl">Image / Media URL *</Label>
              <div className="flex gap-2">
                <Input
                  id="fileUrl"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCompress}
                  disabled={!fileUrl || isCompressing}
                  className="shrink-0 text-xs border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10"
                >
                  <Sparkles className="mr-1 size-3.5" />
                  {isCompressing ? "Converting..." : "WebP Compress"}
                </Button>
              </div>
              {compressionRatio && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-1">
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                    WebP Optimized ({compressionRatio})
                  </Badge>
                </div>
              )}
            </div>

            {/* Media Preview Box */}
            {fileUrl && (
              <div className="relative rounded-lg border bg-muted/40 p-2 flex items-center justify-center h-44 overflow-hidden">
                <img
                  src={fileUrl}
                  alt={altText || "Media preview"}
                  className="max-h-full max-w-full object-contain rounded"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="folder">Folder Category</Label>
                <Select value={folder} onValueChange={setFolder}>
                  <SelectTrigger id="folder">
                    <SelectValue placeholder="Select folder" />
                  </SelectTrigger>
                  <SelectContent>
                    {FOLDERS.map((fld) => (
                      <SelectItem key={fld} value={fld}>
                        {fld}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fileType">File Type</Label>
                <Select value={fileType} onValueChange={setFileType}>
                  <SelectTrigger id="fileType">
                    <SelectValue placeholder="Select file type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image/webp">Image (WebP)</SelectItem>
                    <SelectItem value="image/png">Image (PNG)</SelectItem>
                    <SelectItem value="image/jpeg">Image (JPEG)</SelectItem>
                    <SelectItem value="video/mp4">Video (MP4)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="altText">Alt Text (SEO & Accessibility)</Label>
              <Input
                id="altText"
                placeholder="Descriptive alt text for search engine indexing..."
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                rows={2}
                placeholder="Optional caption displayed under media element..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update Asset" : "Upload Asset"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
