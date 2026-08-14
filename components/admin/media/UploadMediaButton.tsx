"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";

import { uploadMedia } from "@/actions/media";

export default function UploadMediaButton() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(
    null,
  );

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const result = await uploadMedia(file);

      setMessage(
        `Uploaded: ${result.fileName}`,
      );

      event.target.value = "";
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Upload failed.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <input
        ref={inputRef}
        type="file"
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

      {message && (
        <p className="max-w-xs text-right text-xs text-slate-400">
          {message}
        </p>
      )}
    </div>
  );
}