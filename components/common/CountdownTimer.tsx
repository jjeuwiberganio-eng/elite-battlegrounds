"use client";

import { useEffect, useMemo, useState } from "react";

interface CountdownTimerProps {
  targetDate: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

function calculateTimeRemaining(
  targetDate: string,
): TimeRemaining {
  const target = new Date(targetDate).getTime();

  if (Number.isNaN(target)) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      completed: true,
    };
  }

  const difference = target - Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      completed: true,
    };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor(
      (difference / (1000 * 60 * 60)) % 24,
    ),
    minutes: Math.floor(
      (difference / (1000 * 60)) % 60,
    ),
    seconds: Math.floor(
      (difference / 1000) % 60,
    ),
    completed: false,
  };
}

function CountdownItem({
  value,
  label,
}: Readonly<{
  value: number;
  label: string;
}>) {
  return (
    <div className="flex min-w-[72px] flex-col items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-4">

      <span className="text-3xl font-black text-white">
        {String(value).padStart(2, "0")}
      </span>

      <span className="mt-2 text-xs uppercase tracking-widest text-slate-400">
        {label}
      </span>

    </div>
  );
}

export default function CountdownTimer({
  targetDate,
}: Readonly<CountdownTimerProps>) {
  const [time, setTime] = useState(
    calculateTimeRemaining(targetDate),
  );

  useEffect(() => {
    setTime(calculateTimeRemaining(targetDate));

    const interval = window.setInterval(() => {
      setTime(calculateTimeRemaining(targetDate));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [targetDate]);

  const countdown = useMemo(
    () => [
      {
        label: "Days",
        value: time.days,
      },
      {
        label: "Hours",
        value: time.hours,
      },
      {
        label: "Minutes",
        value: time.minutes,
      },
      {
        label: "Seconds",
        value: time.seconds,
      },
    ],
    [time],
  );

  if (time.completed) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-6 py-5 text-center">

        <p className="text-lg font-bold text-amber-400">
          Match In Progress or Finished
        </p>

      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">

      {countdown.map((item) => (
        <CountdownItem
          key={item.label}
          value={item.value}
          label={item.label}
        />
      ))}

    </div>
  );
}