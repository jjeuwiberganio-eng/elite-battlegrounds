"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

import {
  getGroupsForStage,
  createGroup,
  updateGroup,
  deleteGroup,
  type AdminGroup,
} from "@/actions/tournament-groups";

interface GroupManagementProps {
  stageId: string;
  stageName: string;
}

export default function GroupManagement({
  stageId,
  stageName,
}: Readonly<GroupManagementProps>) {
  const [groups, setGroups] = useState<
    AdminGroup[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [busy, setBusy] = useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  const [newName, setNewName] =
    useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [editingName, setEditingName] =
    useState("");

  async function loadGroups() {
    try {
      setLoading(true);
      setError(null);

      const data =
        await getGroupsForStage(stageId);

      setGroups(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load groups.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageId]);

  async function handleCreate() {
    if (!newName.trim()) {
      setError(
        "Enter a group name first.",
      );
      return;
    }

    try {
      setBusy(true);
      setError(null);

      await createGroup({
        stageId,
        name: newName.trim(),
      });

      setNewName("");
      await loadGroups();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create group.",
      );
    } finally {
      setBusy(false);
    }
  }

  function startEditing(group: AdminGroup) {
    setEditingId(group.id);
    setEditingName(group.name);
    setError(null);
  }

  async function handleSaveEdit() {
    if (!editingId) {
      return;
    }

    if (!editingName.trim()) {
      setError(
        "Group name can't be empty.",
      );
      return;
    }

    try {
      setBusy(true);
      setError(null);

      await updateGroup({
        groupId: editingId,
        name: editingName.trim(),
      });

      setEditingId(null);
      await loadGroups();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update group.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(
    group: AdminGroup,
  ) {
    const confirmed = window.confirm(
      `Delete "${group.name}"? This can't be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setBusy(true);
      setError(null);

      await deleteGroup(group.id);

      await loadGroups();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete group.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-400">
        Groups in {stageName}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        Teams get assigned to one of these
        groups in Team Management. These are
        the real groups the public Standings
        page reads from.
      </p>

      {error && (
        <p className="mt-3 text-xs font-semibold text-red-400">
          {error}
        </p>
      )}

      <div className="mt-4 space-y-2">
        {loading ? (
          <p className="text-sm text-slate-500">
            Loading groups...
          </p>
        ) : groups.length === 0 ? (
          <p className="text-sm text-slate-500">
            No groups yet - add your first
            one below (e.g. "Group A").
          </p>
        ) : (
          groups.map((group) => (
            <div
              key={group.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-slate-950 px-4 py-2.5"
            >
              {editingId === group.id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(event) =>
                      setEditingName(
                        event.target
                          .value,
                      )
                    }
                    autoFocus
                    className="min-w-0 flex-1 rounded-lg border border-amber-500/40 bg-slate-900 px-3 py-1.5 text-sm font-bold text-white outline-none"
                  />

                  <button
                    type="button"
                    disabled={busy}
                    onClick={
                      handleSaveEdit
                    }
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500 text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      setEditingId(null)
                    }
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:text-white disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white">
                      {group.name}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {
                        group._count
                          .registrations
                      }{" "}
                      team
                      {group._count
                        .registrations === 1
                        ? ""
                        : "s"}{" "}
                      ·{" "}
                      {
                        group._count
                          .matches
                      }{" "}
                      match
                      {group._count
                        .matches === 1
                        ? ""
                        : "es"}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        startEditing(
                          group,
                        )
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:text-white disabled:opacity-50"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        handleDelete(
                          group,
                        )
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-red-500/30 text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(event) =>
            setNewName(event.target.value)
          }
          placeholder="e.g. Group A"
          disabled={busy}
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white outline-none placeholder:text-slate-600 focus:border-amber-500/40 disabled:opacity-50"
        />

        <button
          type="button"
          disabled={busy}
          onClick={handleCreate}
          className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>
    </div>
  );
}
