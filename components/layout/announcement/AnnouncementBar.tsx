"use client";

import { Megaphone } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="bg-[#0B1220] border-b border-amber-500/20">
      <div className="container flex h-10 items-center justify-center gap-2 text-sm text-white">
        <Megaphone className="h-4 w-4 text-amber-400" />

        <span>
          Welcome to the Elite Battlegrounds Series MLBB Tournament.
        </span>
      </div>
    </div>
  );
}