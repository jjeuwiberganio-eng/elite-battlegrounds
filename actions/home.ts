"use server";

import { getPublicRegistrationSettings } from "@/actions/registration";
import { prisma } from "@/lib/prisma";
import { TOURNAMENT_RULES } from "@/lib/rules-data";

export interface HomepageData {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  tournament: {
    name: string;
    season: string;
    registrationOpen: boolean;
    registrationUrl: string | null;
  };
  socials: { facebook: string };
  community: { name: string; description: string };
}

export interface RuleData {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export async function getHomepageData(): Promise<HomepageData> {
  const registration = await getPublicRegistrationSettings();

  return {
    hero: {
      title: "Elite Battlegrounds",
      subtitle: "Play Together. Win Together. Have Fun.",
      backgroundImage: "/images/home/hero-bg.jpg",
    },
    tournament: {
      name: "Elite Battlegrounds Series",
      season: "MLBB Tournament S1",
      registrationOpen: registration.registrationOpen,
      registrationUrl: registration.registrationUrl,
    },
    socials: {
      facebook: "https://facebook.com/EliteBattlegroundsPH",
    },
    community: {
      name: "Elite Battlegrounds Community",
      description: "Follow the official Facebook page for tournament updates.",
    },
  };
}

export async function getHomepageRules(): Promise<RuleData[]> {
  return TOURNAMENT_RULES.filter((rule) => rule.homepagePreview).map(
    ({ id, title, description, icon }) => ({
      id,
      title,
      description,
      icon,
    }),
  );
}

