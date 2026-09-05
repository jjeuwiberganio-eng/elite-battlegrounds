import Link from "next/link";

import { getLiveStatus } from "@/actions/livestream";

export default async function LiveButton() {
  const live = await getLiveStatus();

  if (!live.enabled) {
    return null;
  }

  return (
    <Link
      href={live.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Watch Live Tournament Stream"
      className={[
        "hidden md:inline-flex",
        "items-center gap-2",
        "rounded-xl",
        "bg-red-600",
        "px-4 py-2",
        "font-semibold text-white",
        "shadow-lg",
        "transition-all duration-200",
        "hover:bg-red-700",
        "hover:shadow-xl",
        "focus:outline-none",
        "focus:ring-2",
        "focus:ring-red-500",
        "focus:ring-offset-2",
      ].join(" ")}
    >
      <span className="relative flex h-3 w-3">

        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />

        <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />

      </span>

      <span>LIVE NOW</span>
    </Link>
  );
}