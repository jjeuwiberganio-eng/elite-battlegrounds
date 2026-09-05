import { redirect } from "next/navigation";

/*
 * Tournament rules content lives as static copy in actions/about.ts
 * (getTournamentRulesSummary) - it's policy text that rarely
 * changes, matching the same pattern as the homepage's static
 * values/expectations content. A full database-backed CMS for this
 * would be over-engineering; edit the source directly instead.
 */
export default function RulesPage() {
  redirect("/admin");
}
