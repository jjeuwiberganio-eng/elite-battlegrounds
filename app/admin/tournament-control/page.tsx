import { redirect } from "next/navigation";

/*
 * This page was scaffolded to duplicate settings that now live in
 * clearer, more focused places: Tournament Stages (stage/group
 * config), Website Settings (site info), Standings (recalculation),
 * and Livestream (live match control). Redirecting rather than
 * maintaining a redundant hub.
 */
export default function TournamentControlPage() {
  redirect("/admin");
}
