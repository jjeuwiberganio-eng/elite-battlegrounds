"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import DesktopNavigation from "./DesktopNavigation";
import MobileNavigation from "./MobileNavigation";
import NavLogo from "./NavLogo";
import LiveButton from "./LiveButton";

import { useScrollPosition } from "@/hooks/useScrollPosition";

export default function Navbar() {
  const pathname = usePathname();

  const isScrolled = useScrollPosition(20);

  return (
    <header
      className={[
        "sticky top-0 z-50",
        "border-b",
        "transition-all duration-300",
        isScrolled
          ? "border-slate-200 bg-white/95 shadow-lg backdrop-blur"
          : "border-transparent bg-white",
      ].join(" ")}
    >
      <div className="container">

        <div className="flex h-[72px] items-center justify-between">

          {/* Logo */}
          <NavLogo />

          {/* Desktop Navigation */}
          <DesktopNavigation
            pathname={pathname}
          />

          {/* Right Side */}
          <div className="flex items-center gap-3">

            <LiveButton />

            <MobileNavigation
              pathname={pathname}
            />

          </div>

        </div>

      </div>
    </header>
  );
}