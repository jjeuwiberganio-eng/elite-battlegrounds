"use client";

import { Wifi } from "lucide-react";

interface LiveIndicatorProps {
  live?: boolean;
}

export default function LiveIndicator({
  live = true,
}: Readonly<LiveIndicatorProps>) {
  if (!live) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 shadow-lg">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
        </span>

        <Wifi className="h-4 w-4 text-white" />

        <span className="text-xs font-bold uppercase tracking-wider text-white">
          LIVE
        </span>
      </div>
    </div>
  );
}