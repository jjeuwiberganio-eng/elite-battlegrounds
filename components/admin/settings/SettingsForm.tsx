"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";

import {
  updateWebsiteSettings,
  updateSocialLinks,
  type WebsiteSettings,
  type SocialLink,
} from "@/actions/settings";

interface SettingsFormProps {
  initialSettings: WebsiteSettings;
  initialSocials: SocialLink[];
}

export default function SettingsForm({
  initialSettings,
  initialSocials,
}: Readonly<SettingsFormProps>) {
  const router = useRouter();

  const [settings, setSettings] =
    useState(initialSettings);

  const [socials, setSocials] = useState(
    initialSocials,
  );

  const [saving, setSaving] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  function updateField(
    field: keyof WebsiteSettings,
    value: string,
  ) {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateSocial(
    index: number,
    field: keyof SocialLink,
    value: string,
  ) {
    setSocials((prev) =>
      prev.map((social, i) =>
        i === index
          ? { ...social, [field]: value }
          : social,
      ),
    );
  }

  function addSocial() {
    setSocials((prev) => [
      ...prev,
      {
        id: `social-${Date.now()}`,
        name: "",
        url: "",
        icon: "website",
      },
    ]);
  }

  function removeSocial(index: number) {
    setSocials((prev) =>
      prev.filter((_, i) => i !== index),
    );
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError(null);

      await updateWebsiteSettings(
        settings,
      );

      await updateSocialLinks(socials);

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save settings.",
      );
    } finally {
      setSaving(false);
    }
  }

  const fields: {
    key: keyof WebsiteSettings;
    label: string;
  }[] = [
    {
      key: "websiteName",
      label: "Website Name",
    },
    {
      key: "tournamentName",
      label: "Tournament Name",
    },
    { key: "season", label: "Season" },
    {
      key: "tagline",
      label: "Tagline",
    },
    {
      key: "facebookPage",
      label: "Facebook Page URL",
    },
    {
      key: "discordInvite",
      label: "Discord Invite URL",
    },
    {
      key: "email",
      label: "Contact Email",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
        <p className="mb-5 text-xs font-black uppercase tracking-[0.25em] text-amber-400">
          General
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
                {field.label}
              </label>

              <input
                type="text"
                value={
                  settings[field.key]
                }
                onChange={(event) =>
                  updateField(
                    field.key,
                    event.target
                      .value,
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white outline-none focus:border-amber-500/40"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-400">
            Social Links
          </p>

          <button
            type="button"
            onClick={addSocial}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>

        <div className="space-y-3">
          {socials.map(
            (social, index) => (
              <div
                key={social.id}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={social.name}
                  onChange={(event) =>
                    updateSocial(
                      index,
                      "name",
                      event.target
                        .value,
                    )
                  }
                  placeholder="Name"
                  className="w-32 shrink-0 rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm font-semibold text-white outline-none focus:border-amber-500/40"
                />

                <input
                  type="text"
                  value={social.url}
                  onChange={(event) =>
                    updateSocial(
                      index,
                      "url",
                      event.target
                        .value,
                    )
                  }
                  placeholder="https://..."
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm font-semibold text-white outline-none focus:border-amber-500/40"
                />

                <button
                  type="button"
                  onClick={() =>
                    removeSocial(index)
                  }
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/30 text-red-400 transition hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ),
          )}

          {socials.length === 0 && (
            <p className="text-sm text-slate-500">
              No social links yet.
            </p>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm font-semibold text-red-400">
          {error}
        </p>
      )}

      <button
        type="button"
        disabled={saving}
        onClick={handleSave}
        className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-black uppercase text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {saving
          ? "Saving..."
          : "Save Settings"}
      </button>
    </div>
  );
}
