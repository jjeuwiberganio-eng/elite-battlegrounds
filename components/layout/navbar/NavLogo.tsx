import Image from "next/image";
import Link from "next/link";

export default function NavLogo() {
  return (
    <Link
      href="/"
      className="relative z-10 flex shrink-0 items-center gap-4"
      aria-label="Elite Battlegrounds Series home"
    >
    <div className="relative h-20 w-20 shrink-0 sm:h-24 sm:w-24 lg:h-32 lg:w-32">
        <Image
          src="/images/branding/Logo.png"
          alt="Elite Battlegrounds Series"
          fill
          priority
          sizes="96px"
          className="object-contain"
        />
      </div>

    <div className="hidden leading-none sm:flex sm:flex-col">
      <span className="text-xl font-black tracking-tight text-slate-900 lg:text-2xl">
        Elite Battlegrounds
      </span>

      <span className="mt-1.5 text-xs font-bold uppercase tracking-[0.28em] text-amber-500">
        Series
      </span>
    </div>
    </Link>
  );
}