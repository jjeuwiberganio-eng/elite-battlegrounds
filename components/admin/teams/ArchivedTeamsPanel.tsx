"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArchiveRestore, ChevronDown } from "lucide-react";

import { restoreTeam } from "@/actions/teams";
import { useConfirm } from "@/components/admin/shared/ConfirmProvider";

export interface ArchivedTeam {
  id: string;
  name: string;
  abbreviation: string | null;
  logo: string | null;
  playerCount: number;
  deletedAt: string | null;
}

interface ArchivedTeamsPanelProps {
  teams: ArchivedTeam[];
}

function formatDeletedAt(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-PH", {
    dateStyle: "medium",
  });
}

/*
 * Teams that were deleted are only archived (soft-deleted). This lists
 * them and lets the admin bring one back, which also restores its
 * tournament registration and refreshes the standings.
 */
export default function ArchivedTeamsPanel({
  teams,
}: Readonly<ArchivedTeamsPanelProps>) {
  const router = useRouter();
  const confirm = useConfirm();

  const [open, setOpen] = useState(false);
  const [restoringId, setRestoringId] =
    useState<string | null>(null);

  async function handleRestore(team: ArchivedTeam) {
    const confirmed = await confirm({
      title: `Restore ${team.name}?`,
      description:
        "The team returns to the active roster and its tournament registration is approved again. Standings are refreshed automatically.",
      confirmLabel: "Restore team",
    });

    if (!confirmed) {
      return;
    }

    setRestoringId(team.id);

    try {
      const result = await restoreTeam(team.id);

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success(`${team.name} was restored.`);
      router.refresh();
    } catch {
      toast.error("Failed to restore the team. Please try again.");
    } finally {
      setRestoringId(null);
    }
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-6 py-5 text-left transition hover:bg-white/[0.03]"
      >
        <span className="flex items-center gap-3">
          <ArchiveRestore className="h-5 w-5 text-slate-400" />

          <span className="font-black text-white">
            Archived teams
          </span>

          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold text-slate-300">
            {teams.length}
          </span>
        </span>

        <ChevronDown
          className={`h-5 w-5 text-slate-500 transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="border-t border-white/10">
          {teams.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-slate-500">
              No archived teams. Deleted teams show up here so
              you can restore them.
            </p>
          ) : (
            <ul className="divide-y divide-white/10">
              {teams.map((team) => (
                <li
                  key={team.id}
                  className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-900 ring-1 ring-white/10">
                      {team.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={team.logo}
                          alt={team.name}
                          loading="lazy"
                          className="h-9 w-9 object-contain"
                        />
                      ) : (
                        <span className="font-black text-slate-500">
                          {team.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-bold text-white">
                        {team.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {team.playerCount}{" "}
                        {team.playerCount === 1
                          ? "player"
                          : "players"}
                        {team.deletedAt
                          ? ` · archived ${formatDeletedAt(team.deletedAt)}`
                          : ""}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={restoringId !== null}
                    onClick={() => handleRestore(team)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 px-4 py-2.5 text-sm font-bold text-emerald-300 transition hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ArchiveRestore className="h-4 w-4" />

                    {restoringId === team.id
                      ? "Restoring..."
                      : "Restore"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
