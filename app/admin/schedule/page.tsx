import { redirect } from "next/navigation";

/*
 * This route used to duplicate Schedule Days almost entirely (same
 * data, same "add day" action, just a table view instead of cards).
 * Consolidated into one real page instead of maintaining two.
 */
export default function ScheduleManagementPage() {
  redirect("/admin/schedule/days");
}
