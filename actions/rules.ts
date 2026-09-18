"use server";

import { prisma } from "@/lib/prisma";
import { RULE_CATEGORIES, DEFAULT_RULE_CATEGORY, TOURNAMENT_RULES } from "@/lib/rules-data";

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
  return {
    categories: RULE_CATEGORIES,
    defaultCategory: DEFAULT_RULE_CATEGORY,
    items: TOURNAMENT_RULES,
  };
}