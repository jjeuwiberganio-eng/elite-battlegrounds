"use server";

import { TOURNAMENT_RULES } from "@/lib/rules-data";

export interface AboutPageData {
  hero: {
    title: string;
    highlight: string;
    tagline: string;
  };
  mission: string;
  vision: string;
  values: {
    id: string;
    title: string;
    description: string;
    icon: string;
  }[];
  expectations: {
    id: string;
    title: string;
    description: string;
    icon: string;
  }[];
  disclaimer: string;
}

export async function getAboutPage(): Promise<AboutPageData> {
  return {
    hero: {
      title: "About",
      highlight:
        "Elite Battlegrounds Series",
      tagline:
        "More than a game. It's a battle for glory.",
    },
    mission:
      "Elite Battlegrounds Series was created to bring together passionate players and teams from different communities to compete, grow, and showcase their skills on a fair and exciting battleground.",
    vision:
      "To build a strong and respectful esports community where every player has the opportunity to shine and every match inspires.",
    values: [
      {
        id: "fair-play",
        title: "Fair Play",
        description:
          "We promote honesty, respect, and integrity in every match.",
        icon: "handshake",
      },
      {
        id: "respect",
        title: "Respect",
        description:
          "All players, teams, and organizers deserve respect on and off the stage.",
        icon: "shield",
      },
      {
        id: "compete",
        title: "Compete",
        description:
          "We encourage a competitive spirit and the drive to be better every day.",
        icon: "trophy",
      },
      {
        id: "community",
        title: "Community",
        description:
          "We unite communities through esports and shared passion.",
        icon: "users",
      },
      {
        id: "growth",
        title: "Growth",
        description:
          "We support players and teams in their journey to improve and succeed.",
        icon: "star",
      },
    ],
    expectations: [
      {
        id: "organized",
        title:
          "Well-Organized Tournaments",
        description:
          "Structured tournaments with clear rules, schedules, and updates.",
        icon: "calendar",
      },
      {
        id: "competitive",
        title:
          "Competitive Experience",
        description:
          "Experience intense matches and high-level competition at every stage.",
        icon: "trophy",
      },
      {
        id: "transparent",
        title:
          "Fair & Transparent Management",
        description:
          "Committed to fair play, equality, and transparent management.",
        icon: "shield",
      },
      {
        id: "engagement",
        title:
          "Community Engagement",
        description:
          "We value our community and keep everyone informed and involved.",
        icon: "megaphone",
      },
    ],
    disclaimer:
      "Elite Battlegrounds Series is an independent community tournament and is not affiliated with, sponsored by, or endorsed by Moonton Games. Mobile Legends: Bang Bang and all related trademarks are the property of their respective owners.",
  };
}

export interface TournamentRuleSummary {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export async function getTournamentRulesSummary(): Promise<
  TournamentRuleSummary[]
> {
  return TOURNAMENT_RULES.filter((rule) => rule.aboutSummary).map(
    ({ id, title, description, icon }) => ({
      id,
      title,
      description,
      icon,
    }),
  );
}