import type { Metadata } from "next";

import {
  getHomepageData,
  getFeaturedMatch,
  getUpcomingMatch,
  getHomepageHighlights,
  getHomepageRules,
  getLiveStatus,
} from "@/actions/home";

import HeroSection from "@/components/home/hero/HeroSection";
import TournamentFeatures from "@/components/home/features/TournamentFeatures";
import UpcomingMatchSection from "@/components/home/upcoming/UpcomingMatchSection";
import HighlightsSection from "@/components/home/highlights/HighlightsSection";
import RulesPreviewSection from "@/components/home/rules/RulesPreviewSection";
import FacebookCTASection from "@/components/home/cta/FacebookCTASection";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Official Elite Battlegrounds Series tournament website featuring schedules, standings, livestreams, playoffs, highlights, and tournament updates.",
};

export const revalidate = 60;

export default async function HomePage() {
  const [
    homepage,
    featuredMatch,
    upcomingMatch,
    highlights,
    rules,
    liveStatus,
  ] = await Promise.all([
    getHomepageData(),
    getFeaturedMatch(),
    getUpcomingMatch(),
    getHomepageHighlights(),
    getHomepageRules(),
    getLiveStatus(),
  ]);

  return (
    <>
          {/* Hero */}
      <HeroSection
        hero={homepage.hero}
        tournament={homepage.tournament}
        featuredMatch={featuredMatch}
        liveStatus={liveStatus}
      />

      {/* Tournament Features */}
      <TournamentFeatures
        features={homepage.features}
      />

      {/* Upcoming Match */}
      <UpcomingMatchSection
        match={upcomingMatch}
        countdown={upcomingMatch?.countdown}
        isLive={liveStatus.isLive}
      />
            {/* Highlights */}
      <HighlightsSection
        posters={highlights.posters}
        videos={highlights.videos}
      />

      {/* Tournament Rules Preview */}
      <RulesPreviewSection
        rules={rules}
      />

      {/* Facebook Community */}
      <FacebookCTASection
        facebookUrl={homepage.socials.facebook}
        communityName={homepage.community.name}
        communityDescription={homepage.community.description}
      />
      </>
  );
}