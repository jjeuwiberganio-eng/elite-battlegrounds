import type { Metadata } from "next";

import {
  getWebsiteSettings,
  getSocialLinks,
} from "@/actions/settings";

import PageHeader from "@/components/admin/shared/PageHeader";
import GeneralSettingsCard from "@/components/admin/settings/GeneralSettingsCard";
import WebsiteSettingsCard from "@/components/admin/settings/WebsiteSettingsCard";
import SocialLinksCard from "@/components/admin/settings/SocialLinksCard";
import BrandingSettingsCard from "@/components/admin/settings/BrandingSettingsCard";
import SaveSettingsButton from "@/components/admin/settings/SaveSettingsButton";

export const metadata: Metadata = {
  title: "Settings",
};

export const revalidate = 30;

export default async function SettingsPage() {
  const [
    settings,
    socials,
  ] = await Promise.all([
    getWebsiteSettings(),
    getSocialLinks(),
  ]);

  return (
    <div className="space-y-8">

      <PageHeader
        title="Settings"
        description="Configure global website settings and branding."
        breadcrumbs={[
          {
            label: "Dashboard",
            href: "/admin",
          },
          {
            label: "Settings",
          },
        ]}
      />

      <GeneralSettingsCard
        settings={settings}
      />

      <WebsiteSettingsCard
        settings={settings}
      />

      <BrandingSettingsCard
        settings={settings}
      />

      <SocialLinksCard
        socials={socials}
      />

      <div className="flex justify-end">

        <SaveSettingsButton />

      </div>

    </div>
  );
}