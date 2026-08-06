export default function RootLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">

        {/* Logo */}
        <div className="relative flex h-32 w-32 items-center justify-center">
          <div className="absolute h-32 w-32 animate-ping rounded-full bg-amber-200 opacity-20" />

          <img
            src="/logo/elite-battlegrounds-logo.png"
            alt="Elite Battlegrounds Series"
            className="relative h-24 w-24 object-contain"
            draggable={false}
          />
        </div>

        {/* Spinner */}
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200" />

          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-amber-500" />
        </div>

        {/* Loading Text */}
        <div className="text-center">

          <h2 className="text-lg font-bold text-slate-900">
            Elite Battlegrounds Series
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Preparing the battlefield...
          </p>

        </div>

      </div>
    </main>
  );
}