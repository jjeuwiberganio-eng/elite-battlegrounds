import Link from "next/link";

const quickLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Schedule",
    href: "/schedule",
  },
  {
    label: "Standings",
    href: "/standings",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Rules",
    href: "/rules",
  },
];

const adminLinks = [
  {
    label: "Tournament Rules",
    href: "/rules",
  },
  {
    label: "Match Schedule",
    href: "/schedule",
  },
  {
    label: "Current Standings",
    href: "/standings",
  },
];

export default function FooterLinks() {
  return (
    <div className="grid gap-10 sm:grid-cols-2">

      {/* Quick Links */}
      <section>

        <h3 className="mb-5 text-lg font-bold text-white">
          Quick Links
        </h3>

        <ul className="space-y-3">

          {quickLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-slate-300 transition-colors duration-200 hover:text-amber-400"
              >
                {link.label}
              </Link>
            </li>
          ))}

        </ul>

      </section>

      {/* Tournament */}
      <section>

        <h3 className="mb-5 text-lg font-bold text-white">
          Tournament
        </h3>

        <ul className="space-y-3">

          {adminLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-slate-300 transition-colors duration-200 hover:text-amber-400"
              >
                {link.label}
              </Link>
            </li>
          ))}

        </ul>

      </section>

    </div>
  );
}