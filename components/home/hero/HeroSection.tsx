import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import FeaturedMatchCard from "./FeaturedMatchCard";
import HeroActions from "./HeroActions";

interface HeroSectionProps {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };

  tournament: {
    name: string;
    season: string;
    registrationOpen: boolean;
  };

  featuredMatch: {
    id: string;
    teamA: {
      name: string;
      logo?: string | null;
    };
    teamB: {
      name: string;
      logo?: string | null;
    };
    matchTime: string;
    bestOf: string;
  } | null;

  liveStatus: {
    enabled: boolean;
    url?: string;
  };
}

export default function HeroSection({
  hero,
  tournament,
  featuredMatch,
  liveStatus,
}: Readonly<HeroSectionProps>) {
  return (
    <section className="relative isolate overflow-hidden">

      <HeroBackground
        image={hero.backgroundImage}
      />

      <div className="relative z-10">

        <div className="container py-20 lg:py-32">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* Left */}
            <div className="space-y-8">

              <HeroContent
                hero={hero}
                tournament={tournament}
                liveStatus={liveStatus}
              />

              <HeroActions
                registrationOpen={
                  tournament.registrationOpen
                }
              />

            </div>

            {/* Right */}
            <FeaturedMatchCard
              match={featuredMatch}
            />

          </div>

        </div>

      </div>

    </section>
  );
}