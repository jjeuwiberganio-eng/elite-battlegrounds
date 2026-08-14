"use server";

export interface WebsiteSettings {
  websiteName: string;
  tournamentName: string;
  season: string;
  tagline: string;
  facebookPage: string;
  discordInvite: string;
  email: string;
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  return {
    websiteName: "Elite Battlegrounds Series",
    tournamentName: "Elite Battlegrounds Series",
    season: "MLBB Tournament S1",
    tagline: "Play Together. Win Together. Have Fun.",
    facebookPage: "https://facebook.com/elitebattlegrounds",
    discordInvite: "https://discord.gg/elitebg",
    email: "elitebgs.tournament@gmail.com",
  };
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  return [
    {
      id: "facebook",
      name: "Facebook",
      url: "https://facebook.com/elitebattlegrounds",
      icon: "facebook",
    },
    {
      id: "youtube",
      name: "YouTube",
      url: "https://youtube.com",
      icon: "youtube",
    },
    {
      id: "discord",
      name: "Discord",
      url: "https://discord.gg/elitebg",
      icon: "discord",
    },
  ];
}