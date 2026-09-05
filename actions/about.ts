"use server";

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
  return [
    {
      id: "follow-rules",
      title: "Follow All Tournament Rules",
      description:
        "Follow all tournament rules and decisions made by the Tournament Organizer.",
      icon: "clipboard",
    },
    {
      id: "ready",
      title: "All Teams Must Be Ready",
      description:
        "All teams must be ready at least 10 minutes before their scheduled match.",
      icon: "clock",
    },
    {
      id: "default-loss",
      title: "Default Loss",
      description:
        "Teams that fail to complete their lineup or do not report within the allotted waiting time will automatically forfeit the match (Default Loss).",
      icon: "x-circle",
    },
    {
      id: "no-cheating",
      title: "No Cheating",
      description:
        "The use of Map Hack, Scripts, Cheats, Exploits, Third-Party Apps, or any unfair advantage is strictly prohibited and will result in immediate disqualification.",
      icon: "user-x",
    },
    {
      id: "respect-everyone",
      title: "Respect Everyone",
      description:
        "Respect all players, referees, organizers, and spectators. Toxic behavior, harassment, hate speech, and offensive language will not be tolerated.",
      icon: "handshake",
    },
    {
      id: "stable-internet",
      title: "Stable Internet Required",
      description:
        "Stable internet connection is the responsibility of each player. Technical issues caused by a player's own connection may lead to a match loss or disqualification, depending on the situation.",
      icon: "wifi",
    },
    {
      id: "identity-verification",
      title: "Identity Verification",
      description:
        "Players may be required to join a video call or enable their camera for identity verification and fair play.",
      icon: "video",
    },
    {
      id: "final-decision",
      title:
        "Organizer's Decision Is Final",
      description:
        "The Tournament Organizer's decision is final in all disputes and match rulings.",
      icon: "scale",
    },
  ];
}
