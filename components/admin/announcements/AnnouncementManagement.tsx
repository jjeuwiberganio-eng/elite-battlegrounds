"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Megaphone } from "lucide-react";

import {
  createAnnouncement,
  updateAnnouncementStatus,
  deleteAnnouncement,
  type AdminAnnouncement,
} from "@/actions/announcements";

interface AnnouncementManagementProps {
  announcements: AdminAnnouncement[];
}

const STATUS_STYLES: Record<
  string,
  string
> = {
  PUBLISHED:
    "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
  DRAFT: "border-white/10 bg-white/5 text-slate-400",
  ARCHIVED:
    "border-slate-500/30 bg-slate-500/10 text-slate-500",
};

export default function AnnouncementManagement({
  announcements,
}: Readonly<AnnouncementManagementProps>) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<
    string | null
  >(null);

  async function handleCreate() {
    if (!title.trim()) {
      setError(
        "Announcement text is required.",
      );
      return;
    }

    try {
      setBusy(true);
      setError(null);

      await createAnnouncement({
        title: title.trim(),
        summary: summary.trim(),
      });

      setTitle("");
      setSummary("");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleStatusChange(
    announcement: AdminAnnouncement,
    status:
      | "DRAFT"
      | "PUBLISHED"
      | "ARCHIVED",
  ) {
    try {
      setBusy(true);

      await updateAnnouncementStatus(
        announcement.id,
        status,
      );

      router.refresh();
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Failed to update.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(
    announcement: AdminAnnouncement,
  ) {
    const confirmed = window.confirm(
      "Delete this announcement?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setBusy(true);

      await deleteAnnouncement(
        announcement.id,
      );

      router.refresh();
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Failed to delete.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-amber-400">
          New Announcement
        </p>

        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Main message (shown in the bar)"
            maxLength={200}
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white outline-none placeholder:text-slate-600 focus:border-amber-500/40"
          />

          <input
            type="text"
            value={summary}
            onChange={(event) =>
              setSummary(
                event.target.value,
              )
            }
            placeholder="Optional detail (shown after a dash)"
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white outline-none placeholder:text-slate-600 focus:border-amber-500/40"
          />

          {error && (
            <p className="text-xs font-semibold text-red-400">
              {error}
            </p>
          )}

          <button
            type="button"
            disabled={busy}
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-black uppercase text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            Create (as Draft)
          </button>
        </div>
      </div>

      {announcements.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-16 text-center">
          <Megaphone className="mx-auto mb-3 h-8 w-8 text-slate-600" />
          <p className="text-slate-400">
            No announcements yet.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
          {announcements.map(
            (announcement) => (
              <div
                key={announcement.id}
                className="flex items-center gap-4 px-5 py-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-white">
                    {announcement.title}
                  </p>

                  {announcement.summary && (
                    <p className="truncate text-xs text-slate-500">
                      {
                        announcement.summary
                      }
                    </p>
                  )}
                </div>

                <span
                  className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wide ${STATUS_STYLES[announcement.status]}`}
                >
                  {announcement.status}
                </span>

                <div className="flex shrink-0 gap-2">
                  {announcement.status !==
                    "PUBLISHED" && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        handleStatusChange(
                          announcement,
                          "PUBLISHED",
                        )
                      }
                      className="rounded-lg border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500/10 disabled:opacity-50"
                    >
                      Publish
                    </button>
                  )}

                  {announcement.status ===
                    "PUBLISHED" && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        handleStatusChange(
                          announcement,
                          "ARCHIVED",
                        )
                      }
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold text-slate-400 transition hover:text-white disabled:opacity-50"
                    >
                      Archive
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      handleDelete(
                        announcement,
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/30 text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
