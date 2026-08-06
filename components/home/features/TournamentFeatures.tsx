import {
  Trophy,
  CalendarDays,
  BarChart3,
  Radio,
  Swords,
  Users,
} from "lucide-react";

import FeatureCard from "./FeatureCard";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon:
    | "trophy"
    | "calendar"
    | "standings"
    | "livestream"
    | "playoffs"
    | "community";
}

interface TournamentFeaturesProps {
  features: Feature[];
}

const iconMap = {
  trophy: Trophy,
  calendar: CalendarDays,
  standings: BarChart3,
  livestream: Radio,
  playoffs: Swords,
  community: Users,
};

export default function TournamentFeatures({
  features,
}: Readonly<TournamentFeaturesProps>) {
  return (
    <section className="bg-slate-950 py-20">

      <div className="container">

        <div className="mx-auto mb-14 max-w-3xl text-center">

          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-amber-400">
            Tournament Features
          </span>

          <h2 className="mt-6 text-4xl font-black text-white md:text-5xl">
            Everything You Need
            <br />
            In One Tournament
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Elite Battlegrounds Series delivers a complete community
            tournament experience with organized schedules, automatic
            standings, livestream coverage, and competitive playoffs.
          </p>

        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

          {features.map((feature) => {
            const Icon =
              iconMap[feature.icon] ?? Trophy;

            return (
              <FeatureCard
                key={feature.id}
                title={feature.title}
                description={feature.description}
                icon={<Icon className="h-8 w-8" />}
              />
            );
          })}

        </div>

      </div>

    </section>
  );
}