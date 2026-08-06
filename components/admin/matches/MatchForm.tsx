"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const matchSchema = z.object({
  matchNumber: z.coerce.number().min(1),
  teamAId: z.string().min(1, "Team A is required."),
  teamBId: z.string().min(1, "Team B is required."),
  stage: z.string().min(1, "Stage is required."),
  bestOf: z.enum(["BO1", "BO3", "BO5", "BO7"]),
  scheduledAt: z.string().min(1, "Schedule is required."),
  referee: z.string().optional(),
  streamUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum([
    "upcoming",
    "live",
    "completed",
  ]),
}).refine(
  (data) => data.teamAId !== data.teamBId,
  {
    message: "Teams must be different.",
    path: ["teamBId"],
  },
);

export type MatchFormValues = z.infer<typeof matchSchema>;

interface TeamOption {
  id: string;
  name: string;
}

interface MatchFormProps {
  teams: TeamOption[];
  stages: string[];
  defaultValues?: Partial<MatchFormValues>;
  loading?: boolean;
  submitLabel?: string;
  onSubmit: (
    values: MatchFormValues,
  ) => void | Promise<void>;
}

export default function MatchForm({
  teams,
  stages,
  defaultValues,
  loading = false,
  submitLabel = "Save Match",
  onSubmit,
}: Readonly<MatchFormProps>) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MatchFormValues>({
    resolver: zodResolver(matchSchema),
    defaultValues: {
      matchNumber: 1,
      teamAId: "",
      teamBId: "",
      stage: "",
      bestOf: "BO3",
      scheduledAt: "",
      referee: "",
      streamUrl: "",
      status: "upcoming",
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        matchNumber: 1,
        teamAId: "",
        teamBId: "",
        stage: "",
        bestOf: "BO3",
        scheduledAt: "",
        referee: "",
        streamUrl: "",
        status: "upcoming",
        ...defaultValues,
      });
    }
  }, [defaultValues, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-3xl border border-white/10 bg-slate-900 p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">

        {/* Match Number */}

        <div>
          <label className="mb-2 block font-semibold text-white">
            Match Number
          </label>

          <input
            type="number"
            {...register("matchNumber")}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
          />

          {errors.matchNumber && (
            <p className="mt-2 text-sm text-red-400">
              {errors.matchNumber.message}
            </p>
          )}
        </div>

        {/* Stage */}

        <div>
          <label className="mb-2 block font-semibold text-white">
            Stage
          </label>

          <select
            {...register("stage")}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
          >
            <option value="">
              Select Stage
            </option>

            {stages.map((stage) => (
              <option
                key={stage}
                value={stage}
              >
                {stage}
              </option>
            ))}
          </select>

          {errors.stage && (
            <p className="mt-2 text-sm text-red-400">
              {errors.stage.message}
            </p>
          )}
        </div>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Team A */}

        <div>
          <label className="mb-2 block font-semibold text-white">
            Team A
          </label>

          <select
            {...register("teamAId")}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
          >
            <option value="">
              Select Team
            </option>

            {teams.map((team) => (
              <option
                key={team.id}
                value={team.id}
              >
                {team.name}
              </option>
            ))}
          </select>

          {errors.teamAId && (
            <p className="mt-2 text-sm text-red-400">
              {errors.teamAId.message}
            </p>
          )}
        </div>

        {/* Team B */}

        <div>
          <label className="mb-2 block font-semibold text-white">
            Team B
          </label>

          <select
            {...register("teamBId")}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
          >
            <option value="">
              Select Team
            </option>

            {teams.map((team) => (
              <option
                key={team.id}
                value={team.id}
              >
                {team.name}
              </option>
            ))}
          </select>

          {errors.teamBId && (
            <p className="mt-2 text-sm text-red-400">
              {errors.teamBId.message}
            </p>
          )}
        </div>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Best Of */}

        <div>
          <label className="mb-2 block font-semibold text-white">
            Match Format
          </label>

          <select
            {...register("bestOf")}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
          >
            <option value="BO1">BO1</option>
            <option value="BO3">BO3</option>
            <option value="BO5">BO5</option>
            <option value="BO7">BO7</option>
          </select>
        </div>

        {/* Status */}

        <div>
          <label className="mb-2 block font-semibold text-white">
            Status
          </label>

          <select
            {...register("status")}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
          >
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
          </select>
        </div>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Schedule */}

        <div>
          <label className="mb-2 block font-semibold text-white">
            Scheduled Date & Time
          </label>

          <input
            type="datetime-local"
            {...register("scheduledAt")}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Referee */}

        <div>
          <label className="mb-2 block font-semibold text-white">
            Referee (Optional)
          </label>

          <input
            type="text"
            {...register("referee")}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
          />
        </div>

      </div>

      {/* Stream URL */}

      <div>
        <label className="mb-2 block font-semibold text-white">
          Stream URL (Optional)
        </label>

        <input
          type="url"
          {...register("streamUrl")}
          placeholder="https://..."
          className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
        />
      </div>

      <div className="flex justify-end">

        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-amber-500 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving..." : submitLabel}
        </button>

      </div>

    </form>
  );
}