"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface MobileNavigationProps {
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

export default function MobileNavigation({
  pathname,
}: Readonly<MobileNavigationProps>) {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <div className="lg:hidden">

      {/* Menu Button */}
      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
        className="rounded-xl border border-slate-200 p-2 transition hover:bg-slate-100"
      >
        <Menu className="h-6 w-6 text-slate-800" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={closeMenu}
        />
      )}

      {/* Drawer */}
      <aside
        className={[
          "fixed right-0 top-0 z-50",
          "flex h-screen w-80 max-w-full flex-col",
          "bg-white shadow-2xl",
          "transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >

        {/* Header */}
        <div className="flex items-center justify-between border-b p-5">

          <h2 className="text-lg font-bold text-slate-900">
            Navigation
          </h2>

          <button
            type="button"
            aria-label="Close navigation"
            onClick={closeMenu}
            className="rounded-lg p-2 transition hover:bg-slate-100"
          >
            <X className="h-6 w-6" />
          </button>

        </div>

        {/* Navigation */}
        <nav className="flex-1 px-5 py-6">

          <ul className="space-y-2">

            {navigation.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className={[
                      "block rounded-xl px-4 py-3",
                      "font-semibold transition-all duration-200",
                      isActive
                        ? "bg-amber-500 text-white"
                        : "text-slate-700 hover:bg-slate-100",
                    ].join(" ")}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}

          </ul>

        </nav>

        {/* Footer */}
        <div className="border-t p-5">

          <p className="text-center text-sm text-slate-500">
            Elite Battlegrounds Series
          </p>

        </div>

      </aside>

    </div>
  );
}