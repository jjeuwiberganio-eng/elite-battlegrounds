"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const teamSchema = z.object({
  name: z.string().min(3, "Team name is required."),
  captain: z.string().min(2, "Captain name is required."),
  barangay: z.string().min(2, "Barangay is required."),
  logo: z.string().optional(),
});

export type TeamFormValues = z.infer<typeof teamSchema>;

interface TeamFormProps {
  defaultValues?: Partial<TeamFormValues>;
  barangays: string[];
  loading?: boolean;
  submitLabel?: string;
  onSubmit: (values: TeamFormValues) => void | Promise<void>;
}

export default function TeamForm({
  defaultValues,
  barangays,
  loading = false,
  submitLabel = "Save Team",
  onSubmit,
}: Readonly<TeamFormProps>) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
      captain: "",
      barangay: "",
      logo: "",
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        name: "",
        captain: "",
        barangay: "",
        logo: "",
        ...defaultValues,
      });
    }
  }, [defaultValues, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
        space-y-8
        rounded-3xl
        border
        border-white/10
        bg-slate-900
        p-8
      "
    >
      {/* Team Name */}

      <div>

        <label
          htmlFor="name"
          className="mb-2 block font-semibold text-white"
        >
          Team Name
        </label>

        <input
          id="name"
          type="text"
          {...register("name")}
          className="
            w-full
            rounded-2xl
            border
            border-slate-700
            bg-slate-950
            px-4
            py-3
            text-white
            outline-none
            transition
            focus:border-amber-500
            focus:ring-2
            focus:ring-amber-500/30
          "
        />

        {errors.name && (
          <p className="mt-2 text-sm text-red-400">
            {errors.name.message}
          </p>
        )}

      </div>

      {/* Captain */}

      <div>

        <label
          htmlFor="captain"
          className="mb-2 block font-semibold text-white"
        >
          Team Captain
        </label>

        <input
          id="captain"
          type="text"
          {...register("captain")}
          className="
            w-full
            rounded-2xl
            border
            border-slate-700
            bg-slate-950
            px-4
            py-3
            text-white
            outline-none
            transition
            focus:border-amber-500
            focus:ring-2
            focus:ring-amber-500/30
          "
        />

        {errors.captain && (
          <p className="mt-2 text-sm text-red-400">
            {errors.captain.message}
          </p>
        )}

      </div>

      {/* Barangay */}

      <div>

        <label
          htmlFor="barangay"
          className="mb-2 block font-semibold text-white"
        >
          Barangay
        </label>

        <select
          id="barangay"
          {...register("barangay")}
          className="
            w-full
            rounded-2xl
            border
            border-slate-700
            bg-slate-950
            px-4
            py-3
            text-white
            outline-none
            transition
            focus:border-amber-500
            focus:ring-2
            focus:ring-amber-500/30
          "
        >
          <option value="">
            Select Barangay
          </option>

          {barangays.map((barangay) => (
            <option
              key={barangay}
              value={barangay}
            >
              {barangay}
            </option>
          ))}

        </select>

        {errors.barangay && (
          <p className="mt-2 text-sm text-red-400">
            {errors.barangay.message}
          </p>
        )}

      </div>

      {/* Logo URL */}

      <div>

        <label
          htmlFor="logo"
          className="mb-2 block font-semibold text-white"
        >
          Team Logo URL (Optional)
        </label>

        <input
          id="logo"
          type="url"
          {...register("logo")}
          placeholder="https://..."
          className="
            w-full
            rounded-2xl
            border
            border-slate-700
            bg-slate-950
            px-4
            py-3
            text-white
            outline-none
            transition
            focus:border-amber-500
            focus:ring-2
            focus:ring-amber-500/30
          "
        />

      </div>

      {/* Submit */}

      <div className="flex justify-end">

        <button
          type="submit"
          disabled={loading}
          className="
            rounded-2xl
            bg-amber-500
            px-6
            py-3
            font-bold
            text-slate-950
            transition
            hover:bg-amber-400
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading ? "Saving..." : submitLabel}
        </button>

      </div>

    </form>
  );
}