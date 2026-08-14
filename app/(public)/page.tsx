import type { Metadata } from "next";

import {
  getHomepageData,
  getHomepageHighlights,
  getHomepageRules,
} from "@/actions/home";
import { getGroupStageMatches } from "@/actions/group-stage";
import { getPublicRegistrationSettings } from "@/actions/registration";

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

export const revalidate = 30;

export default async function HomePage() {
  const [
    homepage,
    highlights,
    rules,
    groupStageMatches,
    registration,
  ] = await Promise.all([
    getHomepageData(),
    getHomepageHighlights(),
    getHomepageRules(),
    getGroupStageMatches(),
    getPublicRegistrationSettings(),
  ]);

    const heroTournament = {
      ...homepage.tournament,
      registrationOpen: registration.registrationOpen,
      registrationUrl:
        registration.registrationUrl ?? undefined,
    };

  return (
    <>
      {/* Hero */}
      <HeroSection
        hero={homepage.hero}
        tournament={heroTournament}
      />

      {/* Tournament Features */}
      <TournamentFeatures
        features={[
          {
            id: "team-up",
            title: "Team Up",
            description: "Build your team and compete together.",
            icon: "community",
          },
          {
            id: "friendly",
            title: "Friendly",
            description: "A welcoming tournament experience for everyone.",
            icon: "trophy",
          },
          {
            id: "organized",
            title: "Organized",
            description: "Clear schedules and organized matches.",
            icon: "calendar",
          },
          {
            id: "fair-play",
            title: "Fair Play",
            description: "Competitive matches built around fair play.",
            icon: "playoffs",
          },
          {
            id: "livestream",
            title: "Live",
            description: "Follow the action through livestream coverage.",
            icon: "livestream",
          },
          {
            id: "standings",
            title: "Standings",
            description: "Keep track of tournament standings and progress.",
            icon: "standings",
          },
        ]}
      />

      {/* Upcoming Match */}
      <UpcomingMatchSection matches={groupStageMatches} />

      {/* Highlights */}
      <HighlightsSection
        posters={highlights
          .filter((item) => item.type === "poster")
          .map((item) => ({
            id: item.id,
            title: item.title,
            description: item.title,
            mediaUrl: item.image,
            mediaType: "image" as const,
            featured: false,
            publishedAt: new Date().toISOString(),
          }))}
        videos={highlights
          .filter((item) => item.type === "video")
          .map((item) => ({
            id: item.id,
            title: item.title,
            description: item.title,
            mediaUrl: item.image,
            mediaType: "video" as const,
            featured: false,
            publishedAt: new Date().toISOString(),
          }))}
      />

      {/* Tournament Rules */}
      <RulesPreviewSection rules={rules} />

      {/* Facebook Community */}
      <FacebookCTASection
      communityName={homepage.community.name}
      communityDescription={homepage.community.description}
    />
    </>
  );
}