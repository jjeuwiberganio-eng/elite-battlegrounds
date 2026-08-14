"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  createTeam,
  updateTeam,
  type CreateTeamInput,
  type UpdateTeamInput,
  type TeamPlayerInput,
} from "@/actions/teams";

import PlayerEditor, {
  type TeamPlayerFormValue,
} from "@/components/admin/teams/PlayerEditor";

import MediaPicker from "@/components/admin/media/MediaPicker";

const GROUPS = [
  "Group A",
  "Group B",
  "Group C",
  "Group D",
] as const;

type GroupName = (typeof GROUPS)[number];

interface TeamFormTeam {
  id: string;
  name: string;
  slug: string;
  abbreviation?: string | null;
  description?: string | null;
  logoMediaId?: string | null;
  posterMediaId?: string | null;
  status?: "ACTIVE" | "INACTIVE" | "DISQUALIFIED" | "ARCHIVED";
  players?: TeamPlayerFormValue[];
  group?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface TeamFormProps {
  mode: "create" | "edit";
  team?: TeamFormTeam;
}

const EMPTY_PLAYERS: TeamPlayerFormValue[] = [
  {
    inGameName: "",
    role: "",
    isCaptain: false,
    isSubstitute: false,
  },
];

export default function TeamForm({
  mode,
  team,
}: Readonly<TeamFormProps>) {
  const router = useRouter();

  const [name, setName] = useState(team?.name ?? "");
  const [slug, setSlug] = useState(team?.slug ?? "");
  const [abbreviation, setAbbreviation] =
    useState(team?.abbreviation ?? "");
  const [description, setDescription] =
    useState(team?.description ?? "");

  /*
   * Media IDs are what Prisma stores.
   *
   * For now these are entered directly because your project
   * does not currently have an upload/storage implementation.
   */
  const [posterMediaId, setPosterMediaId] =
    useState(team?.posterMediaId ?? "");

  const [logoMediaId, setLogoMediaId] =
    useState(team?.logoMediaId ?? "");

  const [groupName, setGroupName] =
    useState<GroupName>(
      (team?.group?.name as GroupName) ?? "Group A",
    );

  const [players, setPlayers] =
    useState<TeamPlayerFormValue[]>(
      team?.players?.length
        ? team.players
        : EMPTY_PLAYERS,
    );

  const [status, setStatus] =
    useState<
      "ACTIVE" | "INACTIVE" | "DISQUALIFIED" | "ARCHIVED"
    >(
      team?.status ?? "ACTIVE",
    );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!team) {
      return;
    }

    setName(team.name ?? "");
    setSlug(team.slug ?? "");
    setAbbreviation(
      team.abbreviation ?? "",
    );
    setDescription(
      team.description ?? "",
    );
    setPosterMediaId(
      team.posterMediaId ?? "",
    );
    setLogoMediaId(
      team.logoMediaId ?? "",
    );
    setGroupName(
      (team.group?.name as GroupName) ??
        "Group A",
    );
    setPlayers(
      team.players?.length
        ? team.players
        : EMPTY_PLAYERS,
    );
    setStatus(
      team.status ?? "ACTIVE",
    );
  }, [team]);

  function handleNameChange(
    value: string,
  ) {
    setName(value);

    if (mode === "create") {
      setSlug(
        value
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      );
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Team name is required.");
      return;
    }

    if (!slug.trim()) {
      setError("Team slug is required.");
      return;
    }

    if (!posterMediaId.trim()) {
      setError(
        "Team poster is required.",
      );
      return;
    }

    if (players.length < 1) {
      setError(
        "A team must have at least one player.",
      );
      return;
    }

    if (players.length > 6) {
      setError(
        "A team can have a maximum of 6 players.",
      );
      return;
    }

    setLoading(true);

    try {
      if (
        players.some(
          (player) =>
            !player.inGameName.trim() ||
            !player.role,
        )
      ) {
        setError(
          "Every player must have an IGN and role.",
        );
        setLoading(false);
        return;
      }

    const normalizedPlayers = players.map((player) => {
      if (!player.role) {
        throw new Error(
          `Please select a role for ${
            player.inGameName || "every player"
          }.`,
        );
      }

      return {
        ...player,
        inGameName: player.inGameName.trim(),
        role: player.role as TeamPlayerInput["role"],
      };
    });

    const baseData = {
      name: name.trim(),
      slug: slug.trim(),
      abbreviation:
        abbreviation.trim() || undefined,
      description:
        description.trim() || undefined,
      logoMediaId:
        logoMediaId.trim() || null,
      posterMediaId:
        posterMediaId.trim(),
      groupName,
      players: normalizedPlayers,
    };

    if (mode === "create") {
      const data: CreateTeamInput = baseData;

      await createTeam(data);
    } else {
      if (!team?.id) {
        throw new Error(
          "Team ID is missing.",
        );
      }

      if (status === "ARCHIVED") {
        throw new Error(
          "Archived teams must be restored before they can be edited.",
        );
      }

      const data: UpdateTeamInput = {
        ...baseData,
        status,
      };

      await updateTeam(
        team.id,
        data,
      );
    }

      router.push("/admin/teams");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving the team.",
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Team Information */}

      <section className="space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
            Team Information
          </p>

          <h2 className="mt-2 text-xl font-black text-white">
            Basic Details
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Team Name */}

          <div>
            <label
              htmlFor="team-name"
              className="mb-2 block font-semibold text-white"
            >
              Team Name
            </label>

            <input
              id="team-name"
              value={name}
              onChange={(event) =>
                handleNameChange(
                  event.target.value,
                )
              }
              placeholder="Enter team name"
              disabled={loading}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-500"
            />
          </div>

          {/* Slug */}

          <div>
            <label
              htmlFor="team-slug"
              className="mb-2 block font-semibold text-white"
            >
              Slug
            </label>

            <input
              id="team-slug"
              value={slug}
              onChange={(event) =>
                setSlug(event.target.value)
              }
              placeholder="team-slug"
              disabled={loading}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-500"
            />
          </div>

          {/* Abbreviation */}

          <div>
            <label
              htmlFor="team-abbreviation"
              className="mb-2 block font-semibold text-white"
            >
              Abbreviation
            </label>

            <input
              id="team-abbreviation"
              value={abbreviation}
              onChange={(event) =>
                setAbbreviation(
                  event.target.value,
                )
              }
              placeholder="ABC"
              disabled={loading}
              maxLength={20}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-500"
            />
          </div>

          {/* Group */}

          <div>
            <label
              htmlFor="team-group"
              className="mb-2 block font-semibold text-white"
            >
              Tournament Group
            </label>

            <select
              id="team-group"
              value={groupName}
              onChange={(event) =>
                setGroupName(
                  event.target.value as GroupName,
                )
              }
              disabled={loading}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-500"
            >
              {GROUPS.map((group) => (
                <option
                  key={group}
                  value={group}
                >
                  {group}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}

        <div>
          <label
            htmlFor="team-description"
            className="mb-2 block font-semibold text-white"
          >
            Description
          </label>

          <textarea
            id="team-description"
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value,
              )
            }
            rows={4}
            disabled={loading}
            placeholder="Optional team description"
            className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-500"
          />
        </div>
      </section>

 {/* Media */}

<section className="space-y-6">
  <div>
    <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
      Team Media
    </p>

    <h2 className="mt-2 text-xl font-black text-white">
      Poster & Logo
    </h2>

    <p className="mt-1 text-sm text-slate-400">
      Select the team's poster and logo from the
      Media Library.
    </p>
  </div>

  <div className="grid gap-6 md:grid-cols-2">
    <MediaPicker
      label="Team Poster"
      required
      value={posterMediaId}
      onChange={setPosterMediaId}
      disabled={loading}
      description="Required. Select the team's poster image."
    />

    <MediaPicker
      label="Team Logo"
      value={logoMediaId}
      onChange={setLogoMediaId}
      disabled={loading}
      description="Optional. Used for matches, standings, brackets, and team cards."
    />
  </div>
</section>

      {/* Players */}

      <PlayerEditor
        players={players}
        onChange={setPlayers}
        disabled={loading}
      />

      {/* Edit-only status */}

      {mode === "edit" && (
        <div>
          <label
            htmlFor="team-status"
            className="mb-2 block font-semibold text-white"
          >
            Team Status
          </label>

          <select
            id="team-status"
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as
                  | "ACTIVE"
                  | "INACTIVE"
                  | "DISQUALIFIED"
                  | "ARCHIVED",
              )
            }
        disabled={loading}
          className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-500"
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="DISQUALIFIED">
            Disqualified
          </option>
        </select>
        </div>
      )}

      {/* Actions */}

      <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() =>
            router.push("/admin/teams")
          }
          disabled={loading}
          className="rounded-2xl border border-slate-700 px-6 py-3 font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-amber-500 px-6 py-3 font-black text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : mode === "create"
              ? "Create Team"
              : "Save Changes"}
        </button>
      </div>
    </form>
  );
}