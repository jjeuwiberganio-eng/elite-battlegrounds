"use client";

import { useEffect } from "react";
import {
  useForm,
} from "react-hook-form";

import { z } from "zod";
import {
  zodResolver,
} from "@hookform/resolvers/zod";

const stageSchema = z.object({
  name: z
    .string()
    .min(
      1,
      "Stage name is required.",
    ),

  slug: z
    .string()
    .min(
      1,
      "Stage slug is required.",
    )
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens only.",
    ),

  type: z
    .string()
    .min(
      1,
      "Stage type is required.",
    ),

  displayOrder: z.coerce
    .number()
    .int()
    .min(
      1,
      "Display order must be at least 1.",
    ),

  bestOf: z.enum([
    "BO1",
    "BO3",
    "BO5",
    "BO7",
  ]),

  maxTeams: z
    .union([
      z.coerce
        .number()
        .int()
        .min(1),
      z.literal(""),
    ])
    .optional(),

  isFinalStage: z.boolean(),
});

export type StageFormValues =
  z.output<typeof stageSchema>;

type StageFormInput =
  z.input<typeof stageSchema>;

interface StageFormProps {
  stageTypes: string[];

  defaultValues?: Partial<StageFormValues>;

  loading?: boolean;

  submitLabel?: string;

  onSubmit: (
    values: StageFormValues,
  ) => void | Promise<void>;

  onCancel?: () => void;
}

export default function StageForm({
  stageTypes,
  defaultValues,
  loading = false,
  submitLabel = "Create Stage",
  onSubmit,
  onCancel,
}: Readonly<StageFormProps>) {
    const {
      register,
      handleSubmit,
      reset,
      formState: {
        errors,
      },
    } = useForm<
      StageFormInput,
      undefined,
      StageFormValues
    >({
      resolver:
        zodResolver(stageSchema),
        
    defaultValues: {
      name: "",
      slug: "",
      type:
        stageTypes[0] ?? "",
      displayOrder: 1,
      bestOf: "BO1",
      maxTeams: "",
      isFinalStage: false,
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        name: "",
        slug: "",
        type:
          stageTypes[0] ?? "",
        displayOrder: 1,
        bestOf: "BO1",
        maxTeams: "",
        isFinalStage: false,
        ...defaultValues,
      });
    }
  }, [
    defaultValues,
    reset,
    stageTypes,
  ]);

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit,
      )}
      className="space-y-6"
    >
      {/* Name + Slug */}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-semibold text-white">
            Stage Name
          </label>

          <input
            type="text"
            {...register("name")}
            placeholder="Group Stage"
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
          />

          {errors.name && (
            <p className="mt-2 text-sm text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-semibold text-white">
            Slug
          </label>

          <input
            type="text"
            {...register("slug")}
            placeholder="group-stage"
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
          />

          {errors.slug && (
            <p className="mt-2 text-sm text-red-400">
              {errors.slug.message}
            </p>
          )}
        </div>
      </div>

      {/* Type + Order */}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-semibold text-white">
            Stage Type
          </label>

          <select
            {...register("type")}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
          >
            <option value="">
              Select Stage Type
            </option>

            {stageTypes.map(
              (type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              ),
            )}
          </select>

          {errors.type && (
            <p className="mt-2 text-sm text-red-400">
              {errors.type.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-semibold text-white">
            Display Order
          </label>

          <input
            type="number"
            min="1"
            {...register(
              "displayOrder",
            )}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
          />

          {errors.displayOrder && (
            <p className="mt-2 text-sm text-red-400">
              {
                errors
                  .displayOrder
                  .message
              }
            </p>
          )}
        </div>
      </div>

      {/* BO + Maximum Teams */}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-semibold text-white">
            Default Best Of
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
        </div>

        <div>
          <label className="mb-2 block font-semibold text-white">
            Maximum Teams
          </label>

          <input
            type="number"
            min="1"
            {...register(
              "maxTeams",
            )}
            placeholder="Optional"
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
          />

          {errors.maxTeams && (
            <p className="mt-2 text-sm text-red-400">
              {
                errors
                  .maxTeams
                  .message
              }
            </p>
          )}
        </div>
      </div>

      {/* Final Stage */}

      <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950 p-4">
        <input
          type="checkbox"
          {...register(
            "isFinalStage",
          )}
          className="h-5 w-5 accent-amber-500"
        />

        <span>
          <span className="block font-semibold text-white">
            Final Stage
          </span>

          <span className="mt-1 block text-sm text-slate-500">
            Mark this stage as the
            tournament's final stage.
          </span>
        </span>
      </label>

      {/* Buttons */}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-2xl border border-slate-700 px-6 py-3 font-bold text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
          >
            Cancel
          </button>
        )}

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