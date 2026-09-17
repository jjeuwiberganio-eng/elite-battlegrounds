import {
  Users,
  HeartHandshake,
  Trophy,
  ShieldCheck,
} from "lucide-react";

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

const fallbackFeatures = [
  {
    id: "team-up",
    title: "Team Up",
    description: "And compete",
    icon: Users,
  },
  {
    id: "friendly",
    title: "Friendly",
    description: "But competitive",
    icon: HeartHandshake,
  },
  {
    id: "prize-pool",
    title: "Exciting Prize Pool",
    description: "Organized matches and exciting competition.",
    icon: Trophy,
  },
  {
    id: "fair-play",
    title: "Fair Play",
    description: "Respect all",
    icon: ShieldCheck,
  },
  {
    id: "champions",
    title: "Prize Pool",
    description: "Awaiting the champions!",
    icon: Trophy,
  },
];

export default function TournamentFeatures({
  features,
}: Readonly<TournamentFeaturesProps>) {
  const displayFeatures = fallbackFeatures.map(
    (fallback, index) => ({
      ...fallback,
      source: features[index],
    }),
  );

  return (
    <section className="relative z-20 bg-white">
      <div className="w-full px-0">
        <div
          className="
            -mt-1
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-[0_10px_35px_rgba(15,23,42,0.08)]
          "
        >
          <div
            className="
              grid
              grid-cols-2
              lg:grid-cols-5
            "
          >
            {displayFeatures.map(
              ({ id, title, description, icon: Icon }, index) => (
                <article
                  key={id}
                  className="
                    relative
                    flex
                    min-h-[84px]
                    items-center
                    gap-2.5
                    px-3
                    py-3
                    sm:min-h-[130px]
                    sm:gap-4
                    sm:px-5
                    sm:py-5
                    sm:px-6
                    lg:min-h-[145px]
                    lg:flex-col
                    lg:justify-center
                    lg:gap-2
                    lg:px-4
                    lg:text-center
                  "
                >
                  {index > 0 && (
                    <span
                      className="
                        absolute
                        left-0
                        top-1/2
                        hidden
                        h-16
                        w-px
                        -translate-y-1/2
                        bg-amber-400/60
                        lg:block
                      "
                    />
                  )}

                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-amber-50
                      text-amber-600
                      ring-1
                      ring-amber-200
                      sm:h-11
                      sm:w-11
                    "
                  >
                    <Icon
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      strokeWidth={2}
                    />
                  </div>

                  <div className="min-w-0">
                    <h3
                      className="
                        text-xs
                        font-black
                        uppercase
                        tracking-wide
                        text-slate-950
                        sm:text-sm
                      "
                    >
                      {title}
                    </h3>

                    <p
                      className="
                        mt-0.5
                        text-[10px]
                        font-semibold
                        uppercase
                        leading-4
                        text-slate-500
                        sm:mt-1
                        sm:text-xs
                        sm:leading-5
                        lg:max-w-[170px]
                      "
                    >
                      {description}
                    </p>
                  </div>
                </article>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}