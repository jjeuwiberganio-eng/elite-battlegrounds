"use client";

import {
  CalendarDays,
  Clock3,
} from "lucide-react";
import { useEffect, useState } from "react";

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
  const [selectedDayId, setSelectedDayId] =
    useState<string | null>(
      days[0]?.id ?? null,
    );

  /*
   * If the database data changes,
   * make sure the selected day still exists.
   */
  useEffect(() => {
    if (days.length === 0) {
      setSelectedDayId(null);
      return;
    }

    const selectedDayStillExists =
      days.some(
        (day) =>
          day.id === selectedDayId,
      );

    if (!selectedDayStillExists) {
      setSelectedDayId(days[0].id);
    }
  }, [days, selectedDayId]);

  const selectedDay = days.find(
    (day) =>
      day.id === selectedDayId,
  );

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
              ========================== */
              <div className="divide-y">

                {selectedDay.matches.map(
                  (match) => (
                    <div
                      key={match.id}
                      className="grid items-center gap-8 px-8 py-8 lg:grid-cols-[180px_1fr_auto]"
                    >

                      {/* Time */}
                      <div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <Clock3 className="h-4 w-4" />

                          Match Time
                        </div>

                        <p className="mt-2 text-2xl font-black">
                          {match.startTime
                            ? new Date(
                                match.startTime,
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

                      {/* Teams */}
                      <div className="flex items-center justify-center gap-10">

                        {/* Team A */}
                        <div className="text-center">

                          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                            {match.teamA.logo ? (
                              <img
                                src={
                                  match.teamA
                                    .logo
                                }
                                alt={
                                  match.teamA
                                    .name
                                }
                                className="h-14 w-14 object-contain"
                              />
                            ) : null}
                          </div>

                          <p className="mt-3 font-bold">
                            {
                              match.teamA
                                .name
                            }
                          </p>

                        </div>

                        {/* VS */}
                        <span className="text-3xl font-black text-amber-500">
                          VS
                        </span>

                        {/* Team B */}
                        <div className="text-center">

                          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                            {match.teamB.logo ? (
                              <img
                                src={
                                  match.teamB
                                    .logo
                                }
                                alt={
                                  match.teamB
                                    .name
                                }
                                className="h-14 w-14 object-contain"
                              />
                            ) : null}
                          </div>

                          <p className="mt-3 font-bold">
                            {
                              match.teamB
                                .name
                            }
                          </p>

                        </div>

                      </div>

                      {/* Best Of */}
                      <div>
                        <span className="rounded-full border border-amber-500 px-5 py-2 text-sm font-bold uppercase text-amber-600">
                          {match.bestOf}
                        </span>
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