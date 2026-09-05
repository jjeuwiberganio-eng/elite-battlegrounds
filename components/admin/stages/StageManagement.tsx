"use client";

import {
  useState,
} from "react";

import {
  createTournamentStage,
  deleteTournamentStage,
  updateTournamentStage,
} from "@/actions/tournament-stages";

import StageForm, {
  type StageFormValues,
} from "./StageForm";
import GroupManagement from "./GroupManagement";

interface StageItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  displayOrder: number;
  bestOf: string;
  maxTeams: number | null;
  isFinalStage: boolean;

  _count: {
    matches: number;
    groups: number;
    standings: number;
  };
}

interface StageManagementProps {
  initialStages: StageItem[];
  stageTypes: string[];
}

export default function StageManagement({
  initialStages,
  stageTypes,
}: Readonly<StageManagementProps>) {
  const [stages, setStages] =
    useState(initialStages);

  const [
    editingStage,
    setEditingStage,
  ] =
    useState<StageItem | null>(
      null,
    );

  const [
    showForm,
    setShowForm,
  ] = useState(
    initialStages.length === 0,
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] =
    useState<string | null>(
      null,
    );

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    openGroupsForStageId,
    setOpenGroupsForStageId,
  ] = useState<string | null>(null);

  function clearMessages() {
    setMessage(null);
    setError(null);
  }

  function openCreateForm() {
    clearMessages();
    setEditingStage(null);
    setShowForm(true);
  }

  function openEditForm(
    stage: StageItem,
  ) {
    clearMessages();
    setEditingStage(stage);
    setShowForm(true);
  }

  function closeForm() {
    if (loading) {
      return;
    }

    setEditingStage(null);
    setShowForm(false);
    clearMessages();
  }

  async function handleSubmit(
    values: StageFormValues,
  ) {
    setLoading(true);
    clearMessages();

    try {
      const maxTeams =
        values.maxTeams ===
          "" ||
        values.maxTeams ===
          undefined
          ? null
          : Number(
              values.maxTeams,
            );

      const payload = {
        name: values.name,
        slug: values.slug,
        type: values.type as any,
        displayOrder:
          values.displayOrder,
        bestOf: values.bestOf,
        maxTeams,
        isFinalStage:
          values.isFinalStage,
      };

      if (editingStage) {
        const result =
          await updateTournamentStage(
            editingStage.id,
            payload,
          );

        setStages(
          (current) =>
            current
              .map((stage) =>
                stage.id ===
                editingStage.id
                  ? {
                      ...stage,
                      ...result.stage,
                    }
                  : stage,
              )
              .sort(
                (
                  a,
                  b,
                ) =>
                  a.displayOrder -
                  b.displayOrder,
              ),
        );

        setMessage(
          "Stage updated successfully.",
        );
      } else {
        const result =
          await createTournamentStage(
            payload,
          );

        setStages(
          (current) =>
            [
              ...current,
              {
                ...result.stage,
                _count: {
                  matches: 0,
                  groups: 0,
                  standings: 0,
                },
              },
            ].sort(
              (
                a,
                b,
              ) =>
                a.displayOrder -
                b.displayOrder,
            ),
        );

        setMessage(
          "Stage created successfully.",
        );
      }

      setEditingStage(null);
      setShowForm(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(
    stage: StageItem,
  ) {
    clearMessages();

    const confirmed =
      window.confirm(
        `Delete "${stage.name}"?`,
      );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      await deleteTournamentStage(
        stage.id,
      );

      setStages(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              stage.id,
          ),
      );

      if (
        editingStage?.id ===
        stage.id
      ) {
        setEditingStage(null);
        setShowForm(false);
      }

      setMessage(
        "Stage deleted successfully.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete stage.",
      );
    } finally {
      setLoading(false);
    }
  }

const formDefaults:
  | Partial<StageFormValues>
  | undefined = editingStage
  ? {
      name: editingStage.name,
      slug: editingStage.slug,
      type: editingStage.type,
      displayOrder: editingStage.displayOrder,
      bestOf: editingStage.bestOf as
        | "BO1"
        | "BO3"
        | "BO5"
        | "BO7",
      maxTeams:
        editingStage.maxTeams === null
          ? ""
          : editingStage.maxTeams,
      isFinalStage:
        editingStage.isFinalStage,
    }
  : undefined;

  return (
    <div className="space-y-8">
      {/* Messages */}

      {message && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm font-semibold text-emerald-300">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-semibold text-red-300">
          {error}
        </div>
      )}

      {/* Form */}

      {showForm && (
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl">
          <div className="border-b border-white/10 bg-white/[0.03] px-6 py-6 md:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
              Super Admin
            </p>

            <h2 className="mt-2 text-2xl font-black text-white">
              {editingStage
                ? "Edit Stage"
                : "Create Stage"}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Configure the stage used by
              your tournament matches,
              groups, and standings.
            </p>
          </div>

          <div className="p-6 md:p-8">
            <StageForm
              stageTypes={
                stageTypes
              }
              defaultValues={
                formDefaults
              }
              loading={loading}
              submitLabel={
                editingStage
                  ? "Save Changes"
                  : "Create Stage"
              }
              onSubmit={
                handleSubmit
              }
              onCancel={
                closeForm
              }
            />
          </div>
        </section>
      )}

      {/* Stage List */}

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl">
        <div className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.03] px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
              Tournament Setup
            </p>

            <h2 className="mt-2 text-2xl font-black text-white">
              Tournament Stages
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Stages are ordered by
              display order and become
              available in Match Management.
            </p>
          </div>

          {!showForm && (
            <button
              type="button"
              onClick={
                openCreateForm
              }
              className="rounded-2xl bg-amber-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-amber-400"
            >
              + Create Stage
            </button>
          )}
        </div>

        {stages.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto max-w-md">
              <p className="text-lg font-black text-white">
                No stages yet
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Create your Group Stage,
                Playoffs, Semifinals, and
                Grand Finals here.
              </p>

              {!showForm && (
                <button
                  type="button"
                  onClick={
                    openCreateForm
                  }
                  className="mt-6 rounded-2xl bg-amber-500 px-6 py-3 font-bold text-slate-950 hover:bg-amber-400"
                >
                  Create First Stage
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {stages.map(
              (
                stage,
                index,
              ) => (
                <article
                  key={stage.id}
                  className="p-6 md:p-8"
                >
                  <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                    {/* Order */}

                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-lg font-black text-slate-950">
                        {index + 1}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-black text-white">
                            {
                              stage.name
                            }
                          </h3>

                          {stage.isFinalStage && (
                            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-black uppercase text-emerald-400">
                              Final
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          /{stage.slug}
                        </p>
                      </div>
                    </div>

                    {/* Details */}

                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-slate-300">
                        {stage.type}
                      </span>

                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-slate-300">
                        {stage.bestOf}
                      </span>

                      {stage.maxTeams !==
                        null && (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-slate-300">
                          Max{" "}
                          {
                            stage.maxTeams
                          }{" "}
                          teams
                        </span>
                      )}
                    </div>

                    {/* Usage */}

                    <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                      <span>
                        Matches:{" "}
                        <strong className="text-slate-300">
                          {
                            stage
                              ._count
                              .matches
                          }
                        </strong>
                      </span>

                      <span>
                        Groups:{" "}
                        <strong className="text-slate-300">
                          {
                            stage
                              ._count
                              .groups
                          }
                        </strong>
                      </span>

                      <span>
                        Standings:{" "}
                        <strong className="text-slate-300">
                          {
                            stage
                              ._count
                              .standings
                          }
                        </strong>
                      </span>
                    </div>

                    {/* Actions */}

                    <div className="flex gap-3">
                      <button
                        type="button"
                        disabled={
                          loading
                        }
                        onClick={() =>
                          setOpenGroupsForStageId(
                            openGroupsForStageId ===
                              stage.id
                              ? null
                              : stage.id,
                          )
                        }
                        className="rounded-xl border border-amber-500/30 px-4 py-2 text-sm font-bold text-amber-400 transition hover:bg-amber-500/10 disabled:opacity-50"
                      >
                        {openGroupsForStageId ===
                        stage.id
                          ? "Hide Groups"
                          : "Manage Groups"}
                      </button>

                      <button
                        type="button"
                        disabled={
                          loading
                        }
                        onClick={() =>
                          openEditForm(
                            stage,
                          )
                        }
                        className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={
                          loading
                        }
                        onClick={() =>
                          handleDelete(
                            stage,
                          )
                        }
                        className="rounded-xl border border-red-500/30 px-4 py-2 text-sm font-bold text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {openGroupsForStageId ===
                    stage.id && (
                    <div className="mt-6">
                      <GroupManagement
                        stageId={
                          stage.id
                        }
                        stageName={
                          stage.name
                        }
                      />
                    </div>
                  )}
                </article>
              ),
            )}
          </div>
        )}
      </section>
    </div>
  );
}