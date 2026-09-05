"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/src/auth/permissions";
import { USER_ROLES } from "@/src/lib/constants";

const SUPER_ADMIN = USER_ROLES.SUPER_ADMIN;

const WEBSITE_SETTINGS_KEY = "website_settings";
const SOCIAL_LINKS_KEY = "social_links";

export interface WebsiteSettings {
  websiteName: string;
  tournamentName: string;
  season: string;
  tagline: string;
  facebookPage: string;
  discordInvite: string;
  email: string;
}

const DEFAULT_WEBSITE_SETTINGS: WebsiteSettings =
  {
    websiteName:
      "Elite Battlegrounds Series",
    tournamentName:
      "Elite Battlegrounds Series",
    season: "MLBB Tournament S1",
    tagline:
      "Play Together. Win Together. Have Fun.",
    facebookPage:
      "https://facebook.com/elitebattlegrounds",
    discordInvite:
      "https://discord.gg/elitebg",
    email:
      "elitebgs.tournament@gmail.com",
  };

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}

const DEFAULT_SOCIAL_LINKS: SocialLink[] =
  [
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

export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  const setting =
    await prisma.setting.findUnique({
      where: {
        key: WEBSITE_SETTINGS_KEY,
      },
    });

  if (!setting) {
    return DEFAULT_WEBSITE_SETTINGS;
  }

  return {
    ...DEFAULT_WEBSITE_SETTINGS,
    ...(setting.value as Partial<WebsiteSettings>),
  };
}

export async function getSocialLinks(): Promise<
  SocialLink[]
> {
  const setting =
    await prisma.setting.findUnique({
      where: {
        key: SOCIAL_LINKS_KEY,
      },
    });

  if (!setting) {
    return DEFAULT_SOCIAL_LINKS;
  }

  return setting.value as unknown as SocialLink[];
}

export async function updateWebsiteSettings(
  data: WebsiteSettings,
) {
  const user = await requireRole(SUPER_ADMIN);

  if (!data.websiteName?.trim()) {
    throw new Error(
      "Website name is required.",
    );
  }

  await prisma.setting.upsert({
    where: {
      key: WEBSITE_SETTINGS_KEY,
    },
    create: {
      key: WEBSITE_SETTINGS_KEY,
      name: "Website Settings",
      value: data as unknown as Prisma.InputJsonValue,
      dataType: "JSON",
      category: "general",
      updatedById: user.id,
    },
    update: {
      value: data as unknown as Prisma.InputJsonValue,
      updatedById: user.id,
    },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");

  return {
    success: true,
    message: "Settings saved.",
  };
}

export async function updateSocialLinks(
  links: SocialLink[],
) {
  const user = await requireRole(SUPER_ADMIN);

  await prisma.setting.upsert({
    where: {
      key: SOCIAL_LINKS_KEY,
    },
    create: {
      key: SOCIAL_LINKS_KEY,
      name: "Social Links",
      value: links as unknown as Prisma.InputJsonValue,
      dataType: "JSON",
      category: "social",
      updatedById: user.id,
    },
    update: {
      value: links as unknown as Prisma.InputJsonValue,
      updatedById: user.id,
    },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");

  return {
    success: true,
    message: "Social links saved.",
  };
}
