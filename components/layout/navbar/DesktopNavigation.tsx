import Link from "next/link";

interface DesktopNavigationProps {
  pathname: string;
}

const navigation = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Schedule",
    href: "/schedule",
  },
  {
    name: "Standings",
    href: "/standings",
  },
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Rules",
    href: "/rules",
  },
];

export default function DesktopNavigation({
  pathname,
}: Readonly<DesktopNavigationProps>) {
  return (
    <nav
      aria-label="Primary Navigation"
      className="hidden lg:flex"
    >
      <ul className="flex items-center gap-2">

        {navigation.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={[
                  "relative rounded-xl px-4 py-2",
                  "text-sm font-semibold",
                  "transition-all duration-200",
                  isActive
                    ? "bg-amber-500 text-white shadow-md"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                ].join(" ")}
                aria-current={isActive ? "page" : undefined}
              >
                {item.name}

                {isActive && (
                  <span
                    className="absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-white"
                    aria-hidden="true"
                  />
                )}
              </Link>
            </li>
          );
        })}

      </ul>
    </nav>
  );
}