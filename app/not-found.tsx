import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">

        {/* 404 */}
        <span className="rounded-full bg-amber-100 px-4 py-1 text-sm font-semibold tracking-wide text-amber-700">
          ERROR 404
        </span>

        <h1 className="mt-6 text-6xl font-black tracking-tight text-slate-900 md:text-8xl">
          Page Not Found
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
          The page you're looking for doesn't exist or may have been moved.
          Return to the homepage to continue browsing the Elite Battlegrounds
          Series tournament.
        </p>

        {/* Divider */}
        <div className="my-10 h-1 w-28 rounded-full bg-amber-500" />

        {/* Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">

          <Link
            href="/"
            className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Back to Home
          </Link>

          <Link
            href="/schedule"
            className="rounded-xl border border-amber-500 px-6 py-3 font-semibold text-amber-600 transition hover:bg-amber-500 hover:text-white"
          >
            Tournament Schedule
          </Link>

        </div>

        {/* Footer */}
        <p className="mt-14 text-sm text-slate-400">
          Elite Battlegrounds Series
        </p>

      </div>
    </main>
  );
}