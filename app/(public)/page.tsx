import type { Metadata } from "next";

import {
  getHomepageData,
  getHomepageRules,
} from "@/actions/home";
import { getHomepageHighlights } from "@/actions/highlights";
import { getGroupStageMatches } from "@/actions/group-stage";
import { getUpcomingPlayoffMatches } from "@/actions/schedule";
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
    playoffMatches,
    registration,
  ] = await Promise.all([
    getHomepageData(),
    getHomepageHighlights(),
    getHomepageRules(),
    getGroupStageMatches(),
    getUpcomingPlayoffMatches(),
    getPublicRegistrationSettings(),
  ]);

  /*
   * Group-stage matches carry `scheduledAt`; playoff matches carry
   * `startTime` instead - the two result shapes genuinely don't
   * overlap on this field, so this reads whichever one the object
   * actually has rather than accessing a field that may not exist on
   * it.
   */
  function getMatchTime(
    match:
      | (typeof groupStageMatches)[number]
      | (typeof playoffMatches)[number],
  ) {
    return "scheduledAt" in match
      ? match.scheduledAt
      : match.startTime;
  }

  /*
   * "Upcoming Matches" should be the 4 soonest matches site-wide, not
   * just the 4 soonest group-stage ones - a Grand Final or other
   * playoff match belongs here too. Both queries already exclude
   * DRAFT/COMPLETED matches on their own; this just merges the two
   * stage-specific lists into one, sorts by time, and caps it at 4.
   */
  const upcomingMatches = [
    ...groupStageMatches,
    ...playoffMatches,
  ]
    .sort((a, b) => {
      const timeA = new Date(
        getMatchTime(a) ?? "",
      ).getTime();

      const timeB = new Date(
        getMatchTime(b) ?? "",
      ).getTime();

      return timeA - timeB;
    })
    .slice(0, 4);

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
      <UpcomingMatchSection matches={upcomingMatches} />

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
            url: item.url,
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
            url: item.url,
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