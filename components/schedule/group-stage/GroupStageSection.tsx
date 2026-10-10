"use client";

import {
  CalendarDays,
  Clock3,
} from "lucide-react";
import { useState } from "react";

interface Match {
  id: string;
  startTime: string;

  teamA: {
    name: string;
    logo: string | null;
  };

  teamB: {
    name: string;
    logo: string | null;
  };

  bestOf: string;

  streamUrl?: string;
}

interface Day {
  id: string;
  title: string;
  date: string;
  matches: Match[];
}

interface GroupStageSectionProps {
  days: Day[];
}

export default function GroupStageSection({
  days,
}: Readonly<GroupStageSectionProps>) {
  const [requestedDayId, setSelectedDayId] =
    useState<string | null>(
      days[0]?.id ?? null,
    );

  /*
   * Derived, not synced via an effect: if the requested day no longer
   * exists in the current data, fall back to the first available day
   * - recomputes automatically in the same render whenever `days` or
   * `requestedDayId` changes.
   */
  const selectedDay =
    days.find(
      (day) =>
        day.id === requestedDayId,
    ) ?? days[0];

  const selectedDayId =
    selectedDay?.id ?? null;

  return (
    <section className="bg-white py-14">
      <div className="container mx-auto max-w-7xl px-6">

        {/* =========================
            DAY NAVIGATION
        ========================== */}
        {days.length > 0 && (
          <div className="mb-8 overflow-x-auto pb-2">
            <div className="flex min-w-max justify-center gap-2">

              {days.map((day) => {
                const isSelected =
                  day.id ===
                  selectedDayId;

                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() =>
                      setSelectedDayId(
                        day.id,
                      )
                    }
                    className={`rounded-xl px-6 py-3 text-sm font-bold uppercase transition ${
                      isSelected
                        ? "bg-amber-500 text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {day.title}
                  </button>
                );
              })}

            </div>
          </div>
        )}

        {/* =========================
            NO SCHEDULE DAYS
        ========================== */}
        {days.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white px-8 py-12 text-center shadow-sm">
            <p className="font-semibold text-slate-500">
              No schedule days available
              yet.
            </p>
          </div>
        )}

        {/* =========================
            SELECTED DAY
        ========================== */}
        {selectedDay && (
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* Day Header */}
            <div className="flex flex-wrap items-center gap-3 border-b px-8 py-6">

              <CalendarDays className="h-6 w-6 text-amber-500" />

              <h2 className="text-2xl font-black">
                {selectedDay.title}
              </h2>

              {selectedDay.date && (
                <span className="text-slate-500">
                  {selectedDay.date}
                </span>
              )}

            </div>

            {/* =========================
                NO MATCHES FOR THIS DAY
            ========================== */}
            {selectedDay.matches.length ===
            0 ? (
              <div className="px-8 py-12 text-center">
                <p className="font-semibold text-slate-500">
                  No matches scheduled for{" "}
                  {selectedDay.title} yet.
                </p>
              </div>
            ) : (

              /* =========================
                 MATCHES FOR SELECTED DAY
                 Grouped by exact start time, so matches scheduled
                 simultaneously (e.g. 4 matches all at 7:00 PM) share
                 ONE row instead of stacking as separate rows. Within
                 a row, every match is a uniform-size card - team name
                 length no longer shifts the VS position, since each
                 card uses a fixed [1fr_auto_1fr] grid with truncation
                 instead of content-sized flex.
              ========================== */
              <div className="divide-y">

                {Object.entries(
                  selectedDay.matches.reduce(
                    (
                      groups: Record<
                        string,
                        typeof selectedDay.matches
                      >,
                      match,
                    ) => {
                      const key =
                        match.startTime ??
                        "TBD";

                      groups[key] = [
                        ...(groups[key] ??
                          []),
                        match,
                      ];

                      return groups;
                    },
                    {},
                  ),
                ).map(
                  ([
                    startTime,
                    matchesAtTime,
                  ]) => (
                    <div
                      key={startTime}
                      className="flex flex-col gap-6 px-8 py-8 lg:flex-row lg:items-start"
                    >

                      {/* Time - shown once per row, not per match */}
                      <div className="flex shrink-0 items-center gap-2 text-slate-500 lg:w-[160px] lg:flex-col lg:items-start lg:gap-1">
                        <div className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4" />

                          Match Time
                        </div>

                        <p className="text-2xl font-black text-slate-900">
                          {startTime !==
                          "TBD"
                            ? new Date(
                                startTime,
                              ).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute:
                                    "2-digit",
                                },
                              )
                            : "TBD"}
                        </p>
                      </div>

                      {/* Matches at this time - uniform-size cards */}
                      <div className="grid flex-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        {matchesAtTime.map(
                          (match) => (
                            <div
                              key={
                                match.id
                              }
                              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                            >

                              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">

                                {/* Team A */}
                                <div className="flex flex-col items-center text-center">

                                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white ring-1 ring-slate-200">
                                    {match
                                      .teamA
                                      .logo ? (
                                      <img
                                        src={
                                          match
                                            .teamA
                                            .logo
                                        }
                                        alt={
                                          match
                                            .teamA
                                            .name
                                        }
                                        className="h-11 w-11 object-contain"
                                      />
                                    ) : null}
                                  </div>

                                  <p className="mt-2 w-full truncate text-sm font-bold">
                                    {
                                      match
                                        .teamA
                                        .name
                                    }
                                  </p>

                                </div>

                                {/* VS */}
                                <span className="px-1 text-lg font-black text-amber-500">
                                  VS
                                </span>

                                {/* Team B */}
                                <div className="flex flex-col items-center text-center">

                                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white ring-1 ring-slate-200">
                                    {match
                                      .teamB
                                      .logo ? (
                                      <img
                                        src={
                                          match
                                            .teamB
                                            .logo
                                        }
                                        alt={
                                          match
                                            .teamB
                                            .name
                                        }
                                        className="h-11 w-11 object-contain"
                                      />
                                    ) : null}
                                  </div>

                                  <p className="mt-2 w-full truncate text-sm font-bold">
                                    {
                                      match
                                        .teamB
                                        .name
                                    }
                                  </p>

                                </div>

                              </div>

                              {/* Best Of */}
                              <div className="mt-4 flex justify-center">
                                <span className="rounded-full border border-amber-500 px-4 py-1 text-xs font-bold uppercase text-amber-600">
                                  {
                                    match.bestOf
                                  }
                                </span>
                              </div>

                            </div>
                          ),
                        )}

                      </div>

                    </div>
                  ),
                )}

              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
}