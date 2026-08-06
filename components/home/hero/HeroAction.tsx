import Link from "next/link";

interface HeroActionsProps {
  registrationOpen: boolean;
}

export default function HeroActions({
  registrationOpen,
}: Readonly<HeroActionsProps>) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">

      {/* Primary CTA */}
      {registrationOpen ? (
        <Link
          href="/register"
          className="
            inline-flex
            items-center
            justify-center
            rounded-2xl
            bg-amber-500
            px-8
            py-4
            text-base
            font-bold
            text-slate-950
            shadow-xl
            transition-all
            duration-200
            hover:scale-[1.02]
            hover:bg-amber-400
            focus:outline-none
            focus:ring-2
            focus:ring-amber-400
            focus:ring-offset-2
            focus:ring-offset-slate-950
          "
        >
          Register Now
        </Link>
      ) : (
        <button
          disabled
          className="
            inline-flex
            items-center
            justify-center
            rounded-2xl
            bg-slate-700
            px-8
            py-4
            text-base
            font-bold
            text-slate-300
            cursor-not-allowed
          "
        >
          Registration Closed
        </button>
      )}

      {/* Secondary CTA */}
      <Link
        href="/schedule"
        className="
          inline-flex
          items-center
          justify-center
          rounded-2xl
          border
          border-white/20
          bg-white/10
          px-8
          py-4
          text-base
          font-semibold
          text-white
          backdrop-blur
          transition-all
          duration-200
          hover:border-amber-500
          hover:bg-white/15
          focus:outline-none
          focus:ring-2
          focus:ring-amber-400
          focus:ring-offset-2
          focus:ring-offset-slate-950
        "
      >
        View Schedule
      </Link>

    </div>
  );
}