"use server";

import { getPublicRegistrationSettings } from "@/actions/registration";
import { prisma } from "@/lib/prisma";

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
  return [
    { id: "follow-rules", title: "Follow Tournament Rules", description: "Follow all tournament rules and organizer decisions.", icon: "clipboard" },
    { id: "ready", title: "Teams Must Be Ready", description: "Teams should be ready at least 10 minutes before the scheduled match.", icon: "clock" },
    { id: "default-loss", title: "Default Loss", description: "Late or incomplete teams may receive a default loss.", icon: "x-circle" },
    { id: "no-cheating", title: "No Cheating", description: "Cheating, scripting and exploits are strictly prohibited.", icon: "shield-x" },
    { id: "respect", title: "Respect Everyone", description: "Respect players, referees, organizers and spectators.", icon: "handshake" },
  ];
}

export async function getFeaturedMatch() {
  return null;
}

export async function getUpcomingMatch() {
  const match = await prisma.match.findFirst({
    where: { status: { not: "DRAFT" } },
    orderBy: { scheduledAt: "asc" },
  });
  return match;
}
