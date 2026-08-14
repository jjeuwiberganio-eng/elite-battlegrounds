import Link from "next/link";

interface HeroActionsProps {
  registrationOpen: boolean;
  registrationUrl?: string;
}

export default function HeroActions({
  registrationOpen,
  registrationUrl,
}: Readonly<HeroActionsProps>) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {registrationOpen ? (
        <Link
          href={registrationUrl || "/register"}
          className="
            inline-flex
            min-h-12
            items-center
            justify-center
            rounded-lg
            bg-amber-500
            px-7
            py-3
            text-sm
            font-black
            uppercase
            tracking-wide
            text-slate-950
            shadow-lg
            shadow-amber-500/20
            transition
            hover:-translate-y-0.5
            hover:bg-amber-400
            hover:shadow-xl
            focus:outline-none
            focus:ring-2
            focus:ring-amber-400
            focus:ring-offset-2
          "
        >
          Register Now
        </Link>
      ) : (
        <span
          className="
            inline-flex
            min-h-12
            cursor-not-allowed
            items-center
            justify-center
            rounded-lg
            bg-slate-700
            px-7
            py-3
            text-sm
            font-black
            uppercase
            tracking-wide
            text-slate-300
          "
        >
          Registration Closed
        </span>
      )}

      <Link
        href="/schedule"
        className="
          inline-flex
          min-h-12
          items-center
          justify-center
          rounded-lg
          border-2
          border-slate-950
          bg-white/80
          px-7
          py-3
          text-sm
          font-black
          uppercase
          tracking-wide
          text-slate-950
          backdrop-blur-sm
          transition
          hover:-translate-y-0.5
          hover:bg-slate-950
          hover:text-white
        "
      >
        View Schedule
      </Link>
    </div>
  );
}