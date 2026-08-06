export default function PublicLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="flex flex-col items-center">

        {/* Tournament Logo */}
        <div className="relative mb-8">

          <div className="absolute inset-0 animate-ping rounded-full bg-amber-200 opacity-20" />

          <img
            src="/logo/elite-battlegrounds-logo.png"
            alt="Elite Battlegrounds Series"
            className="relative h-28 w-auto select-none md:h-36"
            draggable={false}
          />

        </div>

        {/* Loading Spinner */}
        <div className="relative h-14 w-14">

          <div className="absolute inset-0 rounded-full border-4 border-slate-200" />

          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-amber-500" />

        </div>

        {/* Loading Text */}
        <h2 className="mt-8 text-xl font-bold text-slate-900">
          Elite Battlegrounds Series
        </h2>

        <p className="mt-2 text-sm tracking-wide text-slate-500">
          Preparing the battlefield...
        </p>

      </div>
    </main>
  );
}