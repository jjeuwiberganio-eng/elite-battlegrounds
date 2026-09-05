"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2 } from "lucide-react";

import {
  getUploadSignature,
  saveUploadedMedia,
} from "@/actions/media";
import { createHighlight } from "@/actions/highlights";

type HighlightType = "POSTER" | "VIDEO";

export default function AddHighlightButton() {
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] =
    useState<HighlightType>("POSTER");
  const [file, setFile] = useState<File | null>(
    null,
  );
  const [submitting, setSubmitting] =
    useState(false);
  const [error, setError] = useState<
    string | null
  >(null);

  function reset() {
    setTitle("");
    setType("POSTER");
    setFile(null);
    setError(null);
  }

  async function handleSubmit() {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!file) {
      setError(
        type === "POSTER"
          ? "Choose an image to upload."
          : "Choose a video to upload.",
      );
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const signatureData =
        await getUploadSignature();

      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "api_key",
        signatureData.apiKey,
      );
      formData.append(
        "timestamp",
        String(signatureData.timestamp),
      );
      formData.append(
        "signature",
        signatureData.signature,
      );
      formData.append(
        "folder",
        signatureData.folder,
      );

      const resourceType =
        type === "VIDEO"
          ? "video"
          : "image";

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/${resourceType}/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error?.message ??
            "Upload to Cloudinary failed.",
        );
      }

      const media = await saveUploadedMedia(
        {
          secureUrl: result.secure_url,
          publicId: result.public_id,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
          format: result.format,
          originalFileName: file.name,
          mimeType: file.type,
        },
      );

      await createHighlight({
        title: title.trim(),
        type,
        mediaId: media.id,
      });

      reset();
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-400"
      >
        <Plus className="h-4 w-4" />
        Add Highlight
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-black text-white">
                Add Highlight
              </h2>

              <button
                type="button"
                onClick={() => {
                  reset();
                  setOpen(false);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
                  Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value,
                    )
                  }
                  placeholder="e.g. Grand Finals"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white outline-none placeholder:text-slate-600 focus:border-amber-500/40"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
                  Type
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setType("POSTER");
                      setFile(null);
                    }}
                    className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
                      type === "POSTER"
                        ? "border-amber-500 bg-amber-500/15 text-amber-400"
                        : "border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    Poster (Image)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setType("VIDEO");
                      setFile(null);
                    }}
                    className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
                      type === "VIDEO"
                        ? "border-amber-500 bg-amber-500/15 text-amber-400"
                        : "border-white/10 text-slate-400 hover:text-white"
                    }`}
                  >
                    Short Video
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
                  {type === "POSTER"
                    ? "Image File"
                    : "Video File"}
                </label>

                <input
                  ref={inputRef}
                  type="file"
                  accept={
                    type === "POSTER"
                      ? "image/jpeg,image/png,image/webp,image/gif"
                      : "video/mp4,video/webm,video/quicktime"
                  }
                  onChange={(event) =>
                    setFile(
                      event.target
                        .files?.[0] ??
                        null,
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-xs text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-500 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-slate-950"
                />

                {type === "VIDEO" && (
                  <p className="mt-1.5 text-[11px] text-slate-500">
                    Video files can take a
                    bit longer to upload
                    depending on length and
                    size.
                  </p>
                )}
              </div>

              {error && (
                <p className="text-xs font-semibold text-red-400">
                  {error}
                </p>
              )}

              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-black uppercase text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Add Highlight"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
