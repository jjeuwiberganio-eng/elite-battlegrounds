interface MediaItem {
  id: string;
  fileName: string;
  originalFileName: string;
  mimeType: string;
  extension: string;
  path: string;
  url: string;
  type: "IMAGE" | "VIDEO" | "DOCUMENT";
  size: string;
  width: number | null;
  height: number | null;
  createdAt: Date;
}

interface MediaGridProps {
  media: MediaItem[];
}

function formatFileSize(size: string) {
  const bytes = Number(size);

  if (!Number.isFinite(bytes)) {
    return "Unknown size";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaGrid({
  media,
}: Readonly<MediaGridProps>) {
  if (media.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-slate-900 p-10 text-center">
        <p className="text-lg font-bold text-white">
          No media uploaded yet
        </p>

        <p className="mt-2 text-sm text-slate-500">
          Upload your first team logo, poster, banner, or
          other media asset.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {media.map((item) => (
        <div
          key={item.id}
          className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900"
        >
          <div className="flex aspect-square items-center justify-center bg-slate-950 p-4">
            {item.type === "IMAGE" ? (
              <img
                src={item.url}
                alt={item.originalFileName}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="text-center">
                <p className="text-sm font-bold uppercase text-slate-400">
                  {item.type}
                </p>
              </div>
            )}
          </div>

          <div className="p-4">
            <p
              className="truncate text-sm font-bold text-white"
              title={item.originalFileName}
            >
              {item.originalFileName}
            </p>

            <div className="mt-2 flex items-center justify-between gap-2 text-xs text-slate-500">
              <span>
                {item.width && item.height
                  ? `${item.width} × ${item.height}`
                  : item.extension.toUpperCase()}
              </span>

              <span>
                {formatFileSize(item.size)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}