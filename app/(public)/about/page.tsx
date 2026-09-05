import type { Metadata } from "next";

import {
  getAboutPage,
  getTournamentRulesSummary,
} from "@/actions/about";
import { getHomepageData } from "@/actions/home";

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
  const [about, rules, homepage] = await Promise.all([
    getAboutPage(),
    getTournamentRulesSummary(),
    getHomepageData(),
  ]);

  return (
    <>
      <AboutHeroSection hero={about.hero} />

      <section className="bg-white pb-16 lg:pb-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px] lg:items-start">
            <div className="space-y-8">
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
            </div>

            <RulesSummarySection
              rules={rules}
            />
          </div>
        </div>
      </section>

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
