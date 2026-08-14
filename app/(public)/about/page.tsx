import type { Metadata } from "next";

import {
  getAboutPage,
  getTournamentRulesSummary,
} from "@/actions/about";

import AboutHeroSection from "@/components/about/AboutHeroSection";
import MissionVisionSection from "@/components/about/MissionVisionSection";
import ValuesSection from "@/components/about/ValuesSection";
import ExpectationsSection from "@/components/about/ExpectationsSection";
import RulesSummarySection from "@/components/about/RulesSummarySection";
import DisclaimerSection from "@/components/about/DisclaimerSection";
import FacebookCTASection from "@/components/home/cta/FacebookCTASection";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Elite Battlegrounds Series, our mission, tournament values, community vision, and official tournament disclaimer.",
};

export const revalidate = 60;

export default async function AboutPage() {
  const [about, rules] = await Promise.all([
    getAboutPage(),
    getTournamentRulesSummary(),
  ]);

  return (
    <>
      <AboutHeroSection
        hero={about.hero}
      />

      <MissionVisionSection
        mission={about.mission}
        vision={about.vision}
      />

      <ValuesSection
        values={about.values}
      />

      <ExpectationsSection
        expectations={about.expectations}
      />

      <RulesSummarySection
        rules={rules}
      />

      <DisclaimerSection
        disclaimer={about.disclaimer}
      />

    <FacebookCTASection
      communityName={homepage.community.name}
      communityDescription={homepage.community.description}
    />
    </>
  );
}