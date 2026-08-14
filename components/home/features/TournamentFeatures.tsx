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
              grid-cols-1
              sm:grid-cols-2
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
                    min-h-[130px]
                    items-center
                    gap-4
                    px-5
                    py-5
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
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-amber-50
                      text-amber-600
                      ring-1
                      ring-amber-200
                    "
                  >
                    <Icon
                      className="h-5 w-5"
                      strokeWidth={2}
                    />
                  </div>

                  <div className="min-w-0">
                    <h3
                      className="
                        text-sm
                        font-black
                        uppercase
                        tracking-wide
                        text-slate-950
                      "
                    >
                      {title}
                    </h3>

                    <p
                      className="
                        mt-1
                        text-xs
                        font-semibold
                        uppercase
                        leading-5
                        text-slate-500
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