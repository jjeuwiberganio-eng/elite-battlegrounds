"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const userSchema = z.object({
  name: z
    .string()
    .min(2, "Name is required."),

  email: z
    .string()
    .email("Invalid email address."),

  role: z.enum([
    "super_admin",
    "admin",
    "referee",
    "shoutcaster",
  ]),

  status: z.enum([
    "active",
    "inactive",
  ]),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .optional()
    .or(z.literal("")),
});

export type UserFormValues = z.infer<
  typeof userSchema
>;

interface UserFormProps {
  defaultValues?: Partial<UserFormValues>;

  loading?: boolean;

  submitLabel?: string;

  requirePassword?: boolean;

  onSubmit: (
    values: UserFormValues,
  ) => void | Promise<void>;
}

export default function UserForm({
  defaultValues,
  loading = false,
  submitLabel = "Save User",
  requirePassword = true,
  onSubmit,
}: Readonly<UserFormProps>) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "admin",
      status: "active",
      password: "",
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        name: "",
        email: "",
        role: "admin",
        status: "active",
        password: "",
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
      {/* Name */}

      <div>

        <label
          htmlFor="name"
          className="mb-2 block font-semibold text-white"
        >
          Full Name
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

      {/* Email */}

      <div>

        <label
          htmlFor="email"
          className="mb-2 block font-semibold text-white"
        >
          Email Address
        </label>

        <input
          id="email"
          type="email"
          {...register("email")}
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

        {errors.email && (
          <p className="mt-2 text-sm text-red-400">
            {errors.email.message}
          </p>
        )}

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Role */}

        <div>

          <label
            htmlFor="role"
            className="mb-2 block font-semibold text-white"
          >
            Role
          </label>

          <select
            id="role"
            {...register("role")}
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
            <option value="super_admin">
              Super Admin
            </option>

            <option value="admin">
              Admin
            </option>

            <option value="referee">
              Referee
            </option>

            <option value="shoutcaster">
              Shoutcaster
            </option>

          </select>

        </div>

        {/* Status */}

        <div>

          <label
            htmlFor="status"
            className="mb-2 block font-semibold text-white"
          >
            Account Status
          </label>

          <select
            id="status"
            {...register("status")}
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
            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>

          </select>

        </div>

      </div>

      {/* Password */}

      <div>

        <label
          htmlFor="password"
          className="mb-2 block font-semibold text-white"
        >
          Password
          {!requirePassword &&
            " (Leave blank to keep current password)"}
        </label>

        <input
          id="password"
          type="password"
          {...register("password")}
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

        {errors.password && (
          <p className="mt-2 text-sm text-red-400">
            {errors.password.message}
          </p>
        )}

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
          {loading
            ? "Saving..."
            : submitLabel}
        </button>

      </div>

    </form>
  );
}