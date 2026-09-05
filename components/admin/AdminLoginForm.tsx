"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { requestLoginOtp } from "@/actions/login";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [stage, setStage] = useState<
    "credentials" | "otp"
  >("credentials");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function handleRequestOtp(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setInfo("");

    try {
      const result = await requestLoginOtp({
        email,
        password,
      });

      setInfo(result.message);
      setStage("otp");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const callbackUrl =
      searchParams.get("callbackUrl") || "/admin";

    const result = await signIn("credentials", {
      email,
      password,
      otpCode,
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      setError(
        "That code didn't work - it may be wrong or expired. Try again or go back to resend.",
      );
      setLoading(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  if (stage === "otp") {
    return (
      <form
        onSubmit={handleVerifyOtp}
        className="space-y-5"
      >
        <div className="flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-3">
          <ShieldCheck className="h-5 w-5 shrink-0 text-amber-500" />

          <p className="text-sm text-slate-600">
            {info ||
              `A login code was sent to ${email}.`}
          </p>
        </div>

        <div>
          <label
            htmlFor="otpCode"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Login Code
          </label>

          <input
            id="otpCode"
            type="text"
            inputMode="numeric"
            value={otpCode}
            onChange={(event) =>
              setOtpCode(event.target.value)
            }
            required
            autoFocus
            maxLength={6}
            placeholder="000000"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-center text-2xl font-black tracking-[0.5em] text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
          />
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-amber-500 px-4 py-3 font-bold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Verifying..."
            : "Verify & Sign In"}
        </button>

        <button
          type="button"
          onClick={() => {
            setStage("credentials");
            setOtpCode("");
            setError("");
          }}
          className="w-full text-center text-sm font-semibold text-slate-500 transition hover:text-slate-700"
        >
          ← Back
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleRequestOtp}
      className="space-y-5"
    >
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          required
          autoComplete="email"
          placeholder="admin@example.com"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Password
        </label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          required
          autoComplete="current-password"
          placeholder="Enter your password"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
        />
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-amber-500 px-4 py-3 font-bold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Sending code..." : "Continue"}
      </button>
    </form>
  );
}
