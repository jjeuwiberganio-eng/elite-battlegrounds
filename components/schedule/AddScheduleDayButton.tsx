"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createNextScheduleDay } from "@/actions/schedule-days";

export default function AddScheduleDayButton() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  async function handleAddDay() {
    try {
      setLoading(true);

      await createNextScheduleDay();

      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to add schedule day.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleAddDay}
      disabled={loading}
      className="
        rounded-2xl
        bg-amber-500
        px-5
        py-3
        font-bold
        text-slate-950
        transition
        hover:bg-amber-400
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
    >
      {loading
        ? "Adding..."
        : "Add Schedule Day"}
    </button>
  );
}