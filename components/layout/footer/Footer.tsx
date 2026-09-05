import Link from "next/link";

import {
  getWebsiteSettings,
  getSocialLinks,
} from "@/actions/settings";

import FooterLinks from "./FooterLinks";
import FooterSocials from "./FooterSocials";
import FooterDisclaimer from "./FooterDisclaimer";

export default async function Footer() {
  const [
    settings,
    socials,
  ] = await Promise.all([
    getWebsiteSettings(),
    getSocialLinks(),
  ]);

  const currentYear = new Date().getFullYear();

  const socialsByPlatform = {
    facebook: socials.find((s) => s.icon === "facebook")?.url,
    youtube: socials.find((s) => s.icon === "youtube")?.url,
    discord: socials.find((s) => s.icon === "discord")?.url,
    tiktok: socials.find((s) => s.icon === "tiktok")?.url,
    instagram: socials.find((s) => s.icon === "instagram")?.url,
    website: socials.find((s) => s.icon === "website")?.url,
  };

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">

      <div className="container py-16">

        <div className="grid gap-12 lg:grid-cols-3">

          {/* Branding */}
          <div className="space-y-5">

            <h2 className="text-2xl font-black">
              {settings.websiteName}
            </h2>

            <p className="max-w-sm text-sm leading-7 text-slate-300">
              {settings.tagline}
            </p>

            <FooterSocials
              socials={socialsByPlatform}
            />

          </div>

          {/* Navigation */}
          <FooterLinks />

          {/* Tournament Disclaimer */}
          <FooterDisclaimer />

        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-sm text-slate-400 md:flex-row">

          <p>
            © {currentYear} {settings.websiteName}. All rights reserved.
          </p>

          <p>
            Developed for Elite Battlegrounds Series.
          </p>

        </div>

      </div>

    </footer>
  );
}