"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

import TeamTable from "@/components/admin/teams/TeamTable";

interface TeamPlayer {
  id: string;
  inGameName: string;
  role: string;
  isCaptain: boolean;
  isSubstitute: boolean;
}

interface TeamData {
  id: string;
  name: string;
  slug: string;
  abbreviation: string | null;
  description: string | null;
  logo: string | null;
  poster: string | null;
  status: string;
  players: TeamPlayer[];
  playerCount: number;
  registrationStatus: string | null;
  group: {
    id: string;
    name: string;
    slug: string;
  } | null;
  createdAt: string;
}

interface TeamsManagementProps {
  initialTeams: TeamData[];
  groups: string[];
}

export default function TeamsManagement({
  initialTeams,
  groups,
}: Readonly<TeamsManagementProps>) {
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] =
    useState("ALL");
  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const filteredTeams = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return initialTeams.filter((team) => {
      const matchesSearch =
        !query ||
        team.name
          .toLowerCase()
          .includes(query) ||
        team.slug
          .toLowerCase()
          .includes(query) ||
        team.abbreviation
          ?.toLowerCase()
          .includes(query);

      const matchesGroup =
        groupFilter === "ALL" ||
        team.group?.name === groupFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        team.status.toUpperCase() ===
          statusFilter;

      return (
        matchesSearch &&
        matchesGroup &&
        matchesStatus
      );
    });
  }, [
    initialTeams,
    search,
    groupFilter,
    statusFilter,
  ]);

  return (
    <section className="space-y-6">
      {/* Management Controls */}

      <div className="rounded-3xl border border-white/10 bg-slate-950 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1">
            <label
              htmlFor="team-search"
              className="mb-2 block text-sm font-semibold text-slate-300"
            >
              Search Teams
            </label>

            <input
              id="team-search"
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by team name, slug, or abbreviation..."
              className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-amber-500"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
            <div>
              <label
                htmlFor="group-filter"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Group
              </label>

              <select
                id="group-filter"
                value={groupFilter}
                onChange={(event) =>
                  setGroupFilter(
                    event.target.value,
                  )
                }
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-amber-500"
              >
                <option value="ALL">
                  All Groups
                </option>

                <option value="Group A">
                  Group A
                </option>

                <option value="Group B">
                  Group B
                </option>

                <option value="Group C">
                  Group C
                </option>

                <option value="Group D">
                  Group D
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="status-filter"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Status
              </label>

              <select
                id="status-filter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value,
                  )
                }
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-amber-500"
              >
                <option value="ALL">
                  All Status
                </option>

                <option value="ACTIVE">
                  Active
                </option>

                <option value="INACTIVE">
                  Inactive
                </option>

                <option value="DISQUALIFIED">
                  Disqualified
                </option>
              </select>
            </div>
          </div>

          <Link
            href="/admin/teams/create"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 font-black text-slate-950 transition hover:bg-amber-400"
          >
            <Plus className="h-5 w-5" />

            Create Team
          </Link>
        </div>
      </div>

      {/* Results */}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Showing{" "}
            <span className="font-bold text-white">
              {filteredTeams.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-white">
              {initialTeams.length}
            </span>{" "}
            teams
          </p>
        </div>
      </div>

      <TeamTable
        teams={filteredTeams}
      />
    </section>
  );
}