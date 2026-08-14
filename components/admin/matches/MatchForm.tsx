"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const matchSchema = z
  .object({
    matchNumber: z.coerce.number().min(1),

    teamAId: z
      .string()
      .min(1, "Team A is required."),

    teamBId: z
      .string()
      .min(1, "Team B is required."),

    tournamentStageId: z
      .string()
      .min(1, "Stage is required."),

    scheduleDayId: z
    .string()
    .optional(),

    bestOf: z.enum([
      "BO1",
      "BO3",
      "BO5",
      "BO7",
    ]),

    scheduledAt: z
      .string()
      .min(1, "Schedule is required."),

    referee: z
      .string()
      .optional(),

    streamUrl: z
      .string()
      .url("Please enter a valid URL.")
      .optional()
      .or(z.literal("")),

    status: z.enum([
      "upcoming",
      "live",
      "completed",
    ]),
  })
  .refine(
    (data) =>
      data.teamAId !== data.teamBId,
    {
      message: "Teams must be different.",
      path: ["teamBId"],
    },
  );

export type MatchFormValues =
  z.infer<typeof matchSchema>;

interface TeamOption {
  id: string;
  name: string;
}

interface StageOption {
  id: string;
  name: string;
}

interface ScheduleDayOption {
  id: string;
  name: string;
  dayNumber: number;
}

interface MatchFormProps {
  teams: TeamOption[];
  stages: StageOption[];
  scheduleDays?: ScheduleDayOption[];
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
  scheduleDays = [],
  defaultValues,
  loading = false,
  submitLabel = "Save Match",
  onSubmit,
}: Readonly<MatchFormProps>) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<
  z.input<typeof matchSchema>,
  unknown,
  MatchFormValues
  >({
    resolver: zodResolver(matchSchema),

    defaultValues: {
      scheduleDayId: "",
      matchNumber: 1,
      teamAId: "",
      teamBId: "",
      tournamentStageId: "",
      bestOf: "BO3",
      scheduledAt: "",
      referee: "",
      streamUrl: "",
      status: "upcoming",
      ...defaultValues,
    },
  });
const selectedStageId = watch("tournamentStageId");
const selectedStage =
  stages.find(
    (stage) => stage.id === selectedStageId,
  );

const isGroupStage =
  selectedStage?.name
    .trim()
    .toLowerCase() === "group stage";

  useEffect(() => {
    if (defaultValues) {
      reset({
        scheduleDayId: "",
        matchNumber: 1,
        teamAId: "",
        teamBId: "",
        tournamentStageId: "",
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
      {/* Match Number + Stage */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Match Number */}
        <div>
          <label className="mb-2 block font-semibold text-white">
            Match Number
          </label>

          <input
            type="number"
            min="1"
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
            {...register("tournamentStageId")}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
          >
            <option value="">
              Select Stage
            </option>

            {stages.map((stage) => (
              <option
                key={stage.id}
                value={stage.id}
              >
                {stage.name}
              </option>
            ))}
          </select>

          {errors.tournamentStageId && (
            <p className="mt-2 text-sm text-red-400">
              {errors.tournamentStageId.message}
            </p>
          )}
        </div>
      </div>

      {/* Schedule Day - Group Stage Only */}
      {isGroupStage && (
        <div>
          <label className="mb-2 block font-semibold text-white">
            Schedule Day
          </label>

          <select
            {...register("scheduleDayId")}
            disabled={scheduleDays.length === 0}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-amber-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">
              {scheduleDays.length > 0
                ? "Select Day"
                : "No Schedule Days Available"}
            </option>

            {scheduleDays.map((day) => (
              <option
                key={day.id}
                value={day.id}
              >
                {day.name}
              </option>
            ))}
          </select>

          <p className="mt-2 text-sm text-slate-500">
            Select which Group Stage day this match belongs to.
          </p>
        </div>
      )}
      {/* Team A + Team B */}
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

      {/* Best Of + Status */}
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
            <option value="BO1">
              BO1
            </option>

            <option value="BO3">
              BO3
            </option>

            <option value="BO5">
              BO5
            </option>

            <option value="BO7">
              BO7
            </option>
          </select>

          {errors.bestOf && (
            <p className="mt-2 text-sm text-red-400">
              {errors.bestOf.message}
            </p>
          )}
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
            <option value="upcoming">
              Upcoming
            </option>

            <option value="live">
              Live
            </option>

            <option value="completed">
              Completed
            </option>
          </select>

          {errors.status && (
            <p className="mt-2 text-sm text-red-400">
              {errors.status.message}
            </p>
          )}
        </div>
      </div>

      {/* Schedule + Referee */}
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

          {errors.scheduledAt && (
            <p className="mt-2 text-sm text-red-400">
              {errors.scheduledAt.message}
            </p>
          )}
        </div>

        {/* Referee */}
        <div>
          <label className="mb-2 block font-semibold text-white">
            Referee (Optional)
          </label>

          <input
            type="text"
            {...register("referee")}
            placeholder="Enter referee name"
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
          />

          {errors.referee && (
            <p className="mt-2 text-sm text-red-400">
              {errors.referee.message}
            </p>
          )}
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
          placeholder="https://facebook.com/..."
          className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
        />

        {errors.streamUrl && (
          <p className="mt-2 text-sm text-red-400">
            {errors.streamUrl.message}
          </p>
        )}

        <p className="mt-2 text-sm text-slate-500">
          Add the Facebook Live or livestream URL
          for this specific match.
        </p>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-amber-500 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : submitLabel}
        </button>
      </div>
    </form>
  );
}