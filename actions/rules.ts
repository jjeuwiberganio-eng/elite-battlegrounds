"use server";

import { prisma } from "@/lib/prisma";

export interface RulesTournament {
  name: string;
  season: string;
}

export async function getTournamentControl(): Promise<RulesTournament> {
  const tournament = await prisma.tournament.findFirst({
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      season: true,
    },
  });

  if (!tournament) {
    return {
      name: "Elite Battlegrounds Series",
      season: "Season 1",
    };
  }

  return {
    name: tournament.name,
    season: tournament.season.name,
  };
}

export interface RuleCategory {
  id: string;
  label: string;
}

export interface RuleItem {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: string;
}

export interface RulesData {
  categories: RuleCategory[];
  defaultCategory: string;
  items: RuleItem[];
}

export async function getTournamentRules(): Promise<RulesData> {
  const categories: RuleCategory[] = [
    { id: "general", label: "General" },
    {
      id: "match-day",
      label: "Match Day",
    },
    {
      id: "fair-play",
      label: "Fair Play",
    },
    {
      id: "conduct",
      label: "Conduct",
    },
  ];

  const items: RuleItem[] = [
    {
      id: "follow-rules",
      category: "general",
      title:
        "Follow All Tournament Rules",
      description:
        "Follow all tournament rules and decisions made by the Tournament Organizer.",
      icon: "clipboard",
    },
    {
      id: "final-decision",
      category: "general",
      title:
        "Organizer's Decision Is Final",
      description:
        "The Tournament Organizer's decision is final in all disputes and match rulings.",
      icon: "scale",
    },
    {
      id: "registration",
      category: "general",
      title:
        "Complete Registration Required",
      description:
        "Teams must complete registration with a full roster before the tournament's registration deadline to be eligible to compete.",
      icon: "clipboard-check",
    },
    {
      id: "ready",
      category: "match-day",
      title:
        "All Teams Must Be Ready",
      description:
        "All teams must be ready at least 10 minutes before their scheduled match.",
      icon: "clock",
    },
    {
      id: "default-loss",
      category: "match-day",
      title: "Default Loss",
      description:
        "Teams that fail to complete their lineup or do not report within the allotted waiting time will automatically forfeit the match (Default Loss).",
      icon: "x-circle",
    },
    {
      id: "stable-internet",
      category: "match-day",
      title:
        "Stable Internet Required",
      description:
        "Stable internet connection is the responsibility of each player. Technical issues caused by a player's own connection may lead to a match loss or disqualification, depending on the situation.",
      icon: "wifi",
    },
    {
      id: "rescheduling",
      category: "match-day",
      title:
        "Rescheduling Requests",
      description:
        "Any request to reschedule a match must be submitted to the Tournament Organizer well in advance and is granted only under exceptional circumstances.",
      icon: "calendar-clock",
    },
    {
      id: "no-cheating",
      category: "fair-play",
      title: "No Cheating",
      description:
        "The use of Map Hack, Scripts, Cheats, Exploits, Third-Party Apps, or any unfair advantage is strictly prohibited and will result in immediate disqualification.",
      icon: "user-x",
    },
    {
      id: "identity-verification",
      category: "fair-play",
      title:
        "Identity Verification",
      description:
        "Players may be required to join a video call or enable their camera for identity verification and fair play.",
      icon: "video",
    },
    {
      id: "roster-lock",
      category: "fair-play",
      title: "Roster Lock",
      description:
        "Registered rosters are locked once the group stage begins. Substitute players may only be used if they were registered before the deadline.",
      icon: "lock",
    },
    {
      id: "respect-everyone",
      category: "conduct",
      title: "Respect Everyone",
      description:
        "Respect all players, referees, organizers, and spectators. Toxic behavior, harassment, hate speech, and offensive language will not be tolerated.",
      icon: "handshake",
    },
    {
      id: "sportsmanship",
      category: "conduct",
      title: "Good Sportsmanship",
      description:
        "Win or lose, all participants are expected to conduct themselves with good sportsmanship, on stream, in game, and across official tournament channels.",
      icon: "star",
    },
  ];

  return {
    categories,
    defaultCategory: "general",
    items,
  };
}
