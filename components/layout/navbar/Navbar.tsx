import NavLogo from "./NavLogo";
import DesktopNavigation from "./DesktopNavigation";
import MobileNavigation from "./MobileNavigation";

export default function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
    <div className="mx-auto flex w-full max-w-[1500px] items-center gap-6 px-6 py-4 lg:gap-8 lg:px-8">
        <NavLogo />
        <DesktopNavigation />
        <MobileNavigation />
      </div>
    </header>
  );
}