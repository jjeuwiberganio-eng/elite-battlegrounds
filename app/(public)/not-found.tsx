import Link from "next/link";

export default function PublicNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-16">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">

        {/* Status Badge */}
        <span className="rounded-full bg-amber-100 px-4 py-1 text-sm font-semibold tracking-wide text-amber-700">
          PAGE NOT FOUND
        </span>

        {/* Error Code */}
        <h1 className="mt-8 text-7xl font-black tracking-tight text-slate-900 md:text-8xl">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
          This Battlefield Doesn't Exist
        </h2>

        {/* Description */}
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
          The page you are looking for could not be found. It may have been
          moved, removed, or the link you followed is incorrect.
        </p>

        {/* Divider */}
        <div className="my-10 h-1 w-28 rounded-full bg-amber-500" />

        {/* Actions */}
        <div className="flex flex-col gap-4 sm:flex-row">

          <Link
            href="/"
            className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-slate-800"
          >
            Back to Home
          </Link>

          <Link
            href="/schedule"
            className="rounded-xl border border-amber-500 px-6 py-3 font-semibold text-amber-600 transition-all duration-200 hover:bg-amber-500 hover:text-white"
          >
            View Schedule
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