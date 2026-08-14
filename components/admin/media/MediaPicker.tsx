"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Image as ImageIcon, Search, X } from "lucide-react";

import { getMediaLibrary } from "@/actions/media";

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

interface MediaPickerProps {
  value: string;
  onChange: (mediaId: string) => void;
  label: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
}

export default function MediaPicker({
  value,
  onChange,
  label,
  required = false,
  disabled = false,
  description,
}: Readonly<MediaPickerProps>) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;

    async function loadMedia() {
      try {
        const result = await getMediaLibrary();

        if (active) {
          setMedia(
            result.filter(
              (item) => item.type === "IMAGE",
            ) as MediaItem[],
          );
        }
      } catch (error) {
        console.error("Failed to load media:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadMedia();

    return () => {
      active = false;
    };
  }, []);

  const selectedMedia = media.find(
    (item) => item.id === value,
  );

  const filteredMedia = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return media;
    }

    return media.filter((item) =>
      item.originalFileName
        .toLowerCase()
        .includes(query),
    );
  }, [media, search]);

  function handleSelect(mediaId: string) {
    onChange(mediaId);
    setOpen(false);
    setSearch("");
  }

  function clearSelection() {
    onChange("");
  }

  return (
    <div>
      <label className="mb-2 block font-semibold text-white">
        {label}
        {required && " *"}
      </label>

      {/* Selected Media */}
      {selectedMedia ? (
        <div className="overflow-hidden rounded-2xl border border-amber-500/40 bg-slate-950">
          <div className="flex items-center gap-4 p-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-slate-900">
              <img
                src={selectedMedia.url}
                alt={selectedMedia.originalFileName}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-white">
                {selectedMedia.originalFileName}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {selectedMedia.extension.toUpperCase()}
                {" • "}
                {selectedMedia.width ?? "?"} ×{" "}
                {selectedMedia.height ?? "?"}
              </p>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => setOpen(true)}
                  className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
                >
                  Change
                </button>

                {!required && (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={clearSelection}
                    className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled || loading}
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-4 rounded-2xl border border-dashed border-slate-700 bg-slate-950 px-4 py-5 text-left transition hover:border-amber-500/50 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-900">
            <ImageIcon className="h-6 w-6 text-slate-500" />
          </div>

          <div>
            <p className="font-bold text-white">
              {loading
                ? "Loading media..."
                : "Select an image"}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Choose from your Media Library
            </p>
          </div>
        </button>
      )}

      {description && (
        <p className="mt-2 text-xs text-slate-500">
          {description}
        </p>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-400">
                  Media Library
                </p>

                <h2 className="mt-1 text-xl font-black text-white">
                  Select {label}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search */}
            <div className="border-b border-white/10 p-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search images..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-amber-500"
                />
              </div>
            </div>

            {/* Media */}
            <div className="overflow-y-auto p-6">
              {filteredMedia.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 px-6 py-12 text-center">
                  <ImageIcon className="mx-auto h-10 w-10 text-slate-600" />

                  <p className="mt-4 font-bold text-white">
                    No images found
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Upload an image to the Media Library
                    first.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {filteredMedia.map((item) => {
                    const selected =
                      item.id === value;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          handleSelect(item.id)
                        }
                        className={`group overflow-hidden rounded-2xl border text-left transition ${
                          selected
                            ? "border-amber-500 bg-amber-500/10"
                            : "border-white/10 bg-slate-950 hover:border-amber-500/50"
                        }`}
                      >
                        <div className="relative aspect-square overflow-hidden bg-slate-900">
                          <img
                            src={item.url}
                            alt={item.originalFileName}
                            className="h-full w-full object-contain p-3 transition group-hover:scale-105"
                          />

                          {selected && (
                            <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-slate-950">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                        </div>

                        <div className="p-3">
                          <p className="truncate text-sm font-bold text-white">
                            {item.originalFileName}
                          </p>

                          <p className="mt-1 text-[10px] text-slate-500">
                            {item.width ?? "?"} ×{" "}
                            {item.height ?? "?"}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}