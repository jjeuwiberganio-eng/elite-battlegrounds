import Image from "next/image";
import Link from "next/link";

export default function NavLogo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 transition-opacity hover:opacity-90"
      aria-label="Elite Battlegrounds Series Home"
    >
      <div className="relative h-12 w-12 overflow-hidden rounded-xl">

        <Image
          src="/images/branding/logo.png"
          alt="Elite Battlegrounds Series Logo"
          fill
          priority
          sizes="48px"
          className="object-contain"
        />

      </div>

      <div className="hidden sm:flex flex-col leading-none">

        <span className="text-lg font-black tracking-tight text-slate-900">
          Elite Battlegrounds
        </span>

        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">
          Series
        </span>

      </div>
    </Link>
  );
}