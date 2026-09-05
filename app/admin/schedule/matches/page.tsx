import { redirect } from "next/navigation";

/*
 * This was a duplicate, never-linked match-management scaffold.
 * /admin/matches is the real, working one (with result recording).
 */
export default function ScheduleMatchesPage() {
  redirect("/admin/matches");
}
