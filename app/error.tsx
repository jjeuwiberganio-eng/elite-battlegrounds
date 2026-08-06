"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">

        {/* Badge */}
        <span className="rounded-full bg-red-100 px-4 py-1 text-sm font-semibold tracking-wide text-red-700">
          APPLICATION ERROR
        </span>

        {/* Title */}
        <h1 className="mt-6 text-5xl font-black tracking-tight text-slate-900 md:text-6xl">
          Something Went Wrong
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
          An unexpected error occurred while loading this page.
          Please try again. If the problem persists,
          contact the tournament administrator.
        </p>

        {/* Divider */}
        <div className="my-10 h-1 w-28 rounded-full bg-red-500" />

        {/* Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">

          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Return Home
          </Link>

        </div>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-10 w-full rounded-xl border border-red-200 bg-red-50 p-4 text-left">

            <h2 className="mb-2 font-semibold text-red-700">
              Development Error
            </h2>

            <pre className="overflow-x-auto whitespace-pre-wrap break-words text-sm text-red-600">
              {error.message}
            </pre>

            {error.digest && (
              <p className="mt-3 text-xs text-red-500">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <p className="mt-12 text-sm text-slate-400">
          Elite Battlegrounds Series
        </p>

      </div>
    </main>
  );
}