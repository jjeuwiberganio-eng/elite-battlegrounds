"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, type LoginInput } from "@/src/lib/validations/auth";

export default function LoginPage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

async function onSubmit(data: LoginInput) {
  setError("");
  setIsSubmitting(true);

  try {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (!result) {
      setError("Unable to sign in.");
      return;
    }

    if (result.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  } catch {
    setError("Something went wrong. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
}

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 py-10">

      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl">

        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold text-white">
            Elite Battlegrounds
          </h1>

          <p className="mt-2 text-sm text-neutral-400">
            Sign in to your account
          </p>

        </div>

                <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-neutral-200"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register("email")}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white outline-none transition focus:border-red-600"
            />

            {errors.email && (
              <p className="mt-2 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-neutral-200"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register("password")}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white outline-none transition focus:border-red-600"
            />

            {errors.password && (
              <p className="mt-2 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <div className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

                    <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}

        