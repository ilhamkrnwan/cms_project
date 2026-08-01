import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FolderKanban, Image as ImageIcon, Plus, Sparkles, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MediaLibrary } from "./-components/media-library";
import { MediaUploadDialog, type MediaAsset } from "./-components/media-upload-dialog";

export const Route = createFileRoute("/(main)/dashboard/mail")({
  component: Page,
});

const INITIAL_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: "med_101",
    fileName: "hero-wontent-hub-dashboard.png",
    fileUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
    fileType: "image/png",
    fileSize: 520,
    folder: "Blog Assets",
    altText: "Wontent Content Hub Dashboard hero preview image",
    caption: "Hero section illustration for Wontent tutorial article.",
    isCompressed: false,
    createdAt: "2026-08-01 11:20",
  },
  {
    id: "med_102",
    fileName: "write-once-publish-everywhere-diagram.webp",
    fileUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    fileType: "image/webp",
    fileSize: 180,
    folder: "Blog Assets",
    altText: "Write Once Publish Everywhere architecture flow diagram",
    caption: "Diagram showing adapter system connecting to WordPress and Meta.",
    isCompressed: true,
    createdAt: "2026-07-31 16:45",
  },
  {
    id: "med_103",
    fileName: "meta-facebook-instagram-banner.jpg",
    fileUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80",
    fileType: "image/jpeg",
    fileSize: 640,
    folder: "Social Media",
    altText: "Social media marketing banner for Facebook and Instagram release",
    caption: "Promotional banner used for social campaigns.",
    isCompressed: false,
    createdAt: "2026-07-30 09:15",
  },
  {
    id: "med_104",
    fileName: "ai-search-geo-readability-score.webp",
    fileUrl: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&q=80",
    fileType: "image/webp",
    fileSize: 145,
    folder: "Product Banners",
    altText: "Generative Engine Optimization AI score card",
    caption: "Banner highlighting LLM AI search readiness metrics.",
    isCompressed: true,
    createdAt: "2026-07-28 14:00",
  },
];

function Page() {
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(INITIAL_MEDIA_ASSETS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);

  // Fetch media from API backend if available
  useEffect(() => {
    fetch("http://localhost:3000/media")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: MediaAsset[] = res.data.map((item: any) => ({
            id: item.id,
            fileName: item.fileName,
            fileUrl: item.fileUrl,
            fileType: item.fileType || "image/png",
            fileSize: item.fileSize || 350,
            folder: "Blog Assets",
            altText: item.altText || "",
            caption: item.caption || "",
            isCompressed: item.fileUrl.endsWith(".webp"),
            createdAt: new Date(item.createdAt).toLocaleString(),
          }));
          setMediaAssets(mapped);
        }
      })
      .catch(() => {
        // Keep initial mock assets if backend API is not directly reached
      });
  }, []);

  const handleOpenUpload = () => {
    setEditingAsset(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (asset: MediaAsset) => {
    setEditingAsset(asset);
    setDialogOpen(true);
  };

  const handleSaveAsset = (formData: Partial<MediaAsset>) => {
    if (editingAsset) {
      setMediaAssets((prev) =>
        prev.map((item) =>
          item.id === editingAsset.id ? ({ ...item, ...formData } as MediaAsset) : item
        )
      );
      fetch(`http://localhost:3000/media/${editingAsset.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }).catch(() => {});
    } else {
      const newAsset: MediaAsset = {
        id: `med_${Date.now()}`,
        fileName: formData.fileName || "new-asset.png",
        fileUrl: formData.fileUrl || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
        fileType: formData.fileType || "image/png",
        fileSize: formData.fileSize || 400,
        folder: formData.folder || "Blog Assets",
        altText: formData.altText || "",
        caption: formData.caption || "",
        isCompressed: Boolean(formData.isCompressed),
        createdAt: new Date().toLocaleString(),
      };
      setMediaAssets((prev) => [newAsset, ...prev]);
      fetch("http://localhost:3000/media/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAsset),
      }).catch(() => {});
    }
  };

  const handleDeleteAsset = (id: string) => {
    setMediaAssets((prev) => prev.filter((item) => item.id !== id));
    fetch(`http://localhost:3000/media/${id}`, {
      method: "DELETE",
    }).catch(() => {});
  };

  const handleCompressWebP = async (id: string, mediaUrl: string) => {
    try {
      const res = await fetch("http://localhost:3000/media/compress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaUrl, format: "webp" }),
      });
      const data = await res.json();
      if (data.success && data.data?.compressedUrl) {
        setMediaAssets((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  fileUrl: data.data.compressedUrl,
                  fileType: "image/webp",
                  fileSize: Math.round(item.fileSize * 0.35),
                  isCompressed: true,
                }
              : item
          )
        );
        return data.data.compressedUrl;
      }
    } catch (err) {
      // Local fallback
    }

    // Local fallback compression update
    const compressedFallback = mediaUrl.replace(/\.(png|jpg|jpeg)$/i, ".webp");
    setMediaAssets((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              fileUrl: compressedFallback,
              fileType: "image/webp",
              fileSize: Math.round(item.fileSize * 0.35),
              isCompressed: true,
            }
          : item
      )
    );
    return compressedFallback;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ImageIcon className="size-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Media Library System</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Organize digital assets, manage SEO alt text, and convert images to WebP format.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleOpenUpload}>
            <Upload className="mr-1.5 size-4" />
            Upload Asset
          </Button>
        </div>
      </div>

      {/* Media Gallery & Controls */}
      <MediaLibrary
        data={mediaAssets}
        onUploadNew={handleOpenUpload}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteAsset}
        onCompressWebP={handleCompressWebP}
      />

      {/* Upload & Inspect Dialog */}
      <MediaUploadDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingAsset}
        onSave={handleSaveAsset}
        onCompressWebP={async (url) => {
          if (editingAsset) {
            return await handleCompressWebP(editingAsset.id, url);
          }
          return url.replace(/\.(png|jpg|jpeg)$/i, ".webp");
        }}
      />
    </div>
  );
}

