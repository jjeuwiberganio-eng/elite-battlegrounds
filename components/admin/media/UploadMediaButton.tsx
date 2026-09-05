"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Check, X } from "lucide-react";

import {
  getUploadSignature,
  saveUploadedMedia,
} from "@/actions/media";

interface FileStatus {
  name: string;
  status: "uploading" | "done" | "error";
  error?: string;
}

/*
 * Uploads go straight from the browser to Cloudinary (one hop)
 * instead of routing the full file through this app's own server
 * first. getUploadSignature() only returns a small signed token -
 * it never touches the file. Only the small JSON result afterward
 * comes back through the server, to save the DB record.
 */
async function uploadFileDirectly(
  file: File,
) {
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

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.error?.message ??
        "Upload to Cloudinary failed.",
    );
  }

  return saveUploadedMedia({
    secureUrl: result.secure_url,
    publicId: result.public_id,
    bytes: result.bytes,
    width: result.width,
    height: result.height,
    format: result.format,
    originalFileName: file.name,
    mimeType: file.type,
  });
}

export default function UploadMediaButton() {
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<
    FileStatus[]
  >([]);

  const [uploading, setUploading] =
    useState(false);

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const selected = Array.from(
      event.target.files ?? [],
    );

    if (selected.length === 0) {
      return;
    }

    setUploading(true);

    setFiles(
      selected.map((file) => ({
        name: file.name,
        status: "uploading" as const,
      })),
    );

    // Uploaded a couple at a time rather than all at once - kinder
    // to a constrained machine/connection than firing everything
    // in parallel, while still being far faster than one-at-a-time.
    const CONCURRENCY = 2;
    let cursor = 0;

    async function worker() {
      while (cursor < selected.length) {
        const index = cursor;
        cursor += 1;

        const file = selected[index];

        try {
          await uploadFileDirectly(file);

          setFiles((prev) =>
            prev.map((entry, i) =>
              i === index
                ? {
                    ...entry,
                    status: "done",
                  }
                : entry,
            ),
          );
        } catch (error) {
          setFiles((prev) =>
            prev.map((entry, i) =>
              i === index
                ? {
                    ...entry,
                    status: "error",
                    error:
                      error instanceof
                      Error
                        ? error.message
                        : "Upload failed.",
                  }
                : entry,
            ),
          );
        }
      }
    }

    await Promise.all(
      Array.from(
        { length: CONCURRENCY },
        worker,
      ),
    );

    setUploading(false);
    event.target.value = "";
    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-amber-500
          px-5
          py-3
          text-sm
          font-bold
          text-slate-950
          transition
          hover:bg-amber-400
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ImagePlus className="h-4 w-4" />
        )}

        {uploading
          ? "Uploading..."
          : "Upload Media"}
      </button>

      {files.length > 0 && (
        <div className="w-full max-w-xs space-y-1">
          {files.map((file) => (
            <div
              key={file.name}
              className="flex items-center gap-2 text-xs text-slate-400"
            >
              {file.status ===
                "uploading" && (
                <Loader2 className="h-3 w-3 shrink-0 animate-spin text-amber-400" />
              )}

              {file.status === "done" && (
                <Check className="h-3 w-3 shrink-0 text-emerald-400" />
              )}

              {file.status === "error" && (
                <X className="h-3 w-3 shrink-0 text-red-400" />
              )}

              <span className="truncate">
                {file.name}
                {file.status ===
                  "error" &&
                  file.error &&
                  ` - ${file.error}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
