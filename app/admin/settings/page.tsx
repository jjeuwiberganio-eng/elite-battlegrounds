import type { Metadata } from "next";

import {
  getWebsiteSettings,
  getSocialLinks,
} from "@/actions/settings";

import SettingsForm from "@/components/admin/settings/SettingsForm";

export const metadata: Metadata = {
  title: "Settings",
};

export const revalidate = 30;

export default async function SettingsPage() {
  const [settings, socials] = await Promise.all([
    getWebsiteSettings(),
    getSocialLinks(),
  ]);

  return (
    <main className="space-y-6 p-6 lg:p-10">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-400">
          Super Admin
        </p>

        <h1 className="mt-2 text-3xl font-black text-white">
          Website Settings
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Site-wide info shown across the public pages - names, tagline, and social links.
        </p>
      </div>

      <SettingsForm
        initialSettings={settings}
        initialSocials={socials}
      />
    </main>
  );
}
