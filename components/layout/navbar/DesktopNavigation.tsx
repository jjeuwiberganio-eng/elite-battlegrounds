import Link from "next/link";
import { CalendarDays, Home, Info, Trophy } from "lucide-react";

const navigationItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/standing", label: "Standing", icon: Trophy },
  { href: "/about", label: "About", icon: Info },
];

export default function DesktopNavigation() {
  return (
    <nav
      aria-label="Primary Navigation"
      className="
        hidden
        items-center
        gap-0.5
        rounded-2xl
        border
        border-slate-200/80
        bg-white/95
        px-3
        py-2.5
        shadow-md
        backdrop-blur-md
        lg:flex
      "
    >
      {navigationItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="
            inline-flex
            items-center
            gap-2
            rounded-lg
            px-4
            py-2.5
            text-base
            font-bold
            text-slate-800
            transition
            hover:bg-slate-100
            hover:text-amber-600
            xl:px-6
            xl:text-lg
          "
        >
          <Icon
            className="h-5 w-5 xl:h-6 xl:w-6"
            strokeWidth={2.3}
          />

          {label}
        </Link>
      ))}
    </nav>
  );
}