"use client";

import Link from "next/link";
import {
  Edit,
  Shield,
  Users,
} from "lucide-react";

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

interface TeamTableProps {
  teams: TeamData[];
}

function statusLabel(status: string) {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return "Active";

    case "DISQUALIFIED":
      return "Disqualified";

    case "INACTIVE":
      return "Inactive";

    default:
      return status;
  }
}

function registrationLabel(
  status: string | null,
) {
  if (!status) {
    return "Not registered";
  }

  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

export default function TeamTable({
  teams,
}: Readonly<TeamTableProps>) {
  if (teams.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-950 p-12 text-center">
        <Shield className="mx-auto h-10 w-10 text-slate-600" />

        <h3 className="mt-4 text-lg font-black text-white">
          No teams found
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Create a team or adjust your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950">
      {/* Desktop table */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left">
          <thead className="border-b border-white/10 bg-white/[0.03]">
            <tr>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                Team
              </th>

              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                Group
              </th>

              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                Players
              </th>

              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                Registration
              </th>

              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                Status
              </th>

              <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider text-slate-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {teams.map((team) => (
              <tr
                key={team.id}
                className="transition hover:bg-white/[0.025]"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
                      {team.logo ? (
                        <img
                          src={team.logo}
                          alt={`${team.name} logo`}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <Shield className="h-6 w-6 text-slate-500" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="font-black text-white">
                        {team.name}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {team.abbreviation
                          ? `${team.abbreviation} · `
                          : ""}
                        {team.slug}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5">
                  {team.group ? (
                    <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300">
                      {team.group.name}
                    </span>
                  ) : (
                    <span className="text-sm text-slate-600">
                      —
                    </span>
                  )}
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                    <Users className="h-4 w-4 text-slate-500" />

                    {team.playerCount} / 6
                  </div>
                </td>

                <td className="px-6 py-5">
                  <span className="text-sm text-slate-400">
                    {registrationLabel(
                      team.registrationStatus,
                    )}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <span className="text-sm font-bold text-slate-300">
                    {statusLabel(team.status)}
                  </span>
                </td>

                <td className="px-6 py-5 text-right">
                  <Link
                    href={`/admin/teams/${team.id}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-amber-500/50 hover:text-amber-400"
                  >
                    <Edit className="h-4 w-4" />

                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}

      <div className="divide-y divide-white/5 md:hidden">
        {teams.map((team) => (
          <div
            key={team.id}
            className="p-5"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
                {team.logo ? (
                  <img
                    src={team.logo}
                    alt={`${team.name} logo`}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <Shield className="h-7 w-7 text-slate-500" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-black text-white">
                  {team.name}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {team.abbreviation
                    ? `${team.abbreviation} · `
                    : ""}
                  {team.slug}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {team.group && (
                    <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300">
                      {team.group.name}
                    </span>
                  )}

                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-slate-400">
                    {team.playerCount} / 6 players
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-white/[0.03] p-3">
                <p className="text-xs text-slate-600">
                  Registration
                </p>

                <p className="mt-1 font-semibold text-slate-300">
                  {registrationLabel(
                    team.registrationStatus,
                  )}
                </p>
              </div>

              <div className="rounded-2xl bg-white/[0.03] p-3">
                <p className="text-xs text-slate-600">
                  Status
                </p>

                <p className="mt-1 font-semibold text-slate-300">
                  {statusLabel(team.status)}
                </p>
              </div>
            </div>

            <Link
              href={`/admin/teams/${team.id}`}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-700 px-4 py-3 text-sm font-bold text-slate-300 transition hover:border-amber-500/50 hover:text-amber-400"
            >
              <Edit className="h-4 w-4" />

              Edit Team
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}