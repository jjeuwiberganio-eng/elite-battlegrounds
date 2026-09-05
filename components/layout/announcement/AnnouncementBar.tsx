import { Megaphone } from "lucide-react";

import { getActiveAnnouncement } from "@/actions/announcements";

export default async function AnnouncementBar() {
  const announcement = await getActiveAnnouncement();

  if (!announcement) {
    return null;
  }

  return (
    <div className="border-b border-amber-500/20 bg-[#0B1220]">
      <div className="container flex h-10 items-center justify-center gap-2 px-4 text-center text-sm text-white">
        <Megaphone className="h-4 w-4 shrink-0 text-amber-400" />

        <span className="truncate">
          {announcement.title}
          {announcement.summary
            ? ` - ${announcement.summary}`
            : ""}
        </span>
      </div>
    </div>
  );
}
