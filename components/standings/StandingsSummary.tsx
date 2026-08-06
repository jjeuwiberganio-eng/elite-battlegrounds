import {
  Trophy,
  Users,
  Swords,
  Clock3,
  Flag,
} from "lucide-react";

interface StandingsSummaryProps {
  totalTeams: number;
  qualifiedTeams: number;
  matchesPlayed: number;
  remainingMatches: number;
  currentStage: string;
}

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

function SummaryCard({
  title,
  value,
  icon,
}: Readonly<SummaryCardProps>) {
  return (
    <article
      className="
        rounded-3xl
        border
        border-white/10
        bg-white/[0.05]
        p-6
        backdrop-blur-xl
        transition-all
        duration-300
        hover:border-amber-500/40
        hover:-translate-y-1
      "
    >
      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm uppercase tracking-widest text-slate-400">
            {title}
          </p>

          <h3 className="mt-3 text-3xl font-black text-white">
            {value}
          </h3>

        </div>

        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-amber-500/10
            text-amber-400
          "
        >
          {icon}
        </div>

      </div>
    </article>
  );
}

export default function StandingsSummary({
  totalTeams,
  qualifiedTeams,
  matchesPlayed,
  remainingMatches,
  currentStage,
}: Readonly<StandingsSummaryProps>) {
  return (
    <section className="mb-10">

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">

        <SummaryCard
          title="Teams"
          value={totalTeams}
          icon={<Users className="h-7 w-7" />}
        />

        <SummaryCard
          title="Qualified"
          value={qualifiedTeams}
          icon={<Trophy className="h-7 w-7" />}
        />

        <SummaryCard
          title="Played"
          value={matchesPlayed}
          icon={<Swords className="h-7 w-7" />}
        />

        <SummaryCard
          title="Remaining"
          value={remainingMatches}
          icon={<Clock3 className="h-7 w-7" />}
        />

        <SummaryCard
          title="Stage"
          value={currentStage}
          icon={<Flag className="h-7 w-7" />}
        />

      </div>

    </section>
  );
}