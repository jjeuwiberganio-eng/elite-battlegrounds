import type { Metadata } from "next";

import {
  getTournamentControl,
  getTournamentRules,
} from "@/actions/rules";

import RulesHeroSection from "@/components/rules/hero/RulesHeroSection";
import RulesCategoryTabs from "@/components/rules/navigation/RulesCategoryTabs";
import RulesListSection from "@/components/rules/list/RulesListSection";
import RulesReminderSection from "@/components/rules/reminder/RulesReminderSection";

export const metadata: Metadata = {
  title: "Tournament Rules",
  description:
    "Read the official Elite Battlegrounds Series tournament rules, gameplay regulations, scheduling policies, penalties, technical requirements, and fair play guidelines.",
};

export const revalidate = 60;

export default async function RulesPage() {
  const [tournament, rules] = await Promise.all([
    getTournamentControl(),
    getTournamentRules(),
  ]);

  return (
    <>
      <RulesHeroSection
        tournament={tournament}
      />

      <RulesCategoryTabs
        categories={rules.categories}
        defaultCategory={rules.defaultCategory}
      />

      <RulesListSection
        rules={rules.items}
      />

      <RulesReminderSection
        tournamentName={tournament.name}
      />
    </>
  );
}