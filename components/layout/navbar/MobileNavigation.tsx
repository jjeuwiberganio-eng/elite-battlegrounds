import Link from "next/link";
import { CalendarDays, Home, Info, Trophy } from "lucide-react";

const navigationItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/standings", label: "Standing", icon: Trophy },
  { href: "/about", label: "About", icon: Info },
];

export default function MobileNavigation() {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="
        fixed
        inset-x-0
        bottom-0
        z-[100]
        border-t
        border-slate-200
        bg-white/95
        shadow-[0_-6px_24px_rgba(15,23,42,0.10)]
        backdrop-blur-md
        lg:hidden
      "
    >
      <div className="mx-auto flex h-16 max-w-md">
        {navigationItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="
              flex
              flex-1
              flex-col
              items-center
              justify-center
              gap-0.5
              text-[10px]
              font-bold
              text-slate-600
              transition
              hover:text-amber-600
              active:text-amber-600
            "
          >
            <Icon className="h-5 w-5" strokeWidth={2.3} />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
