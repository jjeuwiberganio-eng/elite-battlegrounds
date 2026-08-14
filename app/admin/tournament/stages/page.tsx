import type { Metadata } from "next";

import {
  getAdminStages,
  getStageFormData,
} from "@/actions/tournament-stages";

import StageManagement from "@/components/admin/stages/StageManagement";

export const metadata: Metadata = {
  title: "Tournament Stages",
  description:
    "Manage tournament stages.",
};

export const revalidate = 30;

export default async function TournamentStagesPage() {
  const [
    stageData,
    formData,
  ] = await Promise.all([
    getAdminStages(),
    getStageFormData(),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
          Super Admin
        </p>

        <h1 className="mt-2 text-3xl font-black text-white">
          Tournament Stages
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Configure the stages of your
          tournament before creating matches.
        </p>

        {stageData.tournament && (
          <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300">
            Tournament:{" "}
            <span className="ml-1 text-amber-400">
              {
                stageData
                  .tournament.name
              }
            </span>
          </div>
        )}
      </div>

      {/* No tournament */}

      {!stageData.tournament ? (
        <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-8">
          <h2 className="text-xl font-black text-white">
            No tournament found
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Create a tournament first. Once a
            tournament exists, you can create
            its Group Stage, Playoffs,
            Semifinals, and Grand Finals here.
          </p>
        </div>
      ) : (
        <StageManagement
          initialStages={
            stageData.stages
          }
          stageTypes={
            formData.stageTypes
          }
        />
      )}
    </div>
  );
}