"use client";

import { useState } from "react";

import {
  closeRegistration,
  openRegistration,
  updateRegistrationSettings,
} from "@/actions/registration";

interface RegistrationControlProps {
  initialData: {
    tournamentId: string;
    tournamentName: string;
    status: "OPEN" | "CLOSED" | "NOT_STARTED";
    registrationOpensAt: string | null;
    registrationClosesAt: string | null;
    registrationUrl: string;
  };
}

function toDateTimeLocal(value: string | null) {
  if (!value) return "";

  const date = new Date(value);

  const offset = date.getTimezoneOffset();
  const localDate = new Date(
    date.getTime() - offset * 60 * 1000,
  );

  return localDate.toISOString().slice(0, 16);
}

export default function RegistrationControl({
  initialData,
}: Readonly<RegistrationControlProps>) {
  const [status, setStatus] = useState(initialData.status);

  const [opensAt, setOpensAt] = useState(
    toDateTimeLocal(initialData.registrationOpensAt),
  );

  const [closesAt, setClosesAt] = useState(
    toDateTimeLocal(initialData.registrationClosesAt),
  );

  const [registrationUrl, setRegistrationUrl] =
    useState(initialData.registrationUrl);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave() {
    try {
      setLoading(true);
      setMessage("");

      await updateRegistrationSettings({
        registrationOpensAt: opensAt || undefined,
        registrationClosesAt: closesAt || undefined,
        registrationUrl,
      });

      setMessage("Registration settings saved successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save registration settings.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleOpen() {
    try {
      setLoading(true);
      setMessage("");

      await openRegistration();

      setStatus("OPEN");
      setMessage("Registration is now OPEN.");

      setOpensAt(toDateTimeLocal(new Date().toISOString()));
      setClosesAt("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to open registration.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleClose() {
    try {
      setLoading(true);
      setMessage("");

      await closeRegistration();

      setStatus("CLOSED");
      setMessage("Registration is now CLOSED.");

      setClosesAt(toDateTimeLocal(new Date().toISOString()));
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to close registration.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">
            Registration Control
          </p>

          <h2 className="mt-1 text-2xl font-bold text-white">
            {initialData.tournamentName}
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Control when tournament registration is available
            to the public.
          </p>
        </div>

        <div
          className={`w-fit rounded-full px-4 py-2 text-sm font-bold ${
            status === "OPEN"
              ? "bg-emerald-500/20 text-emerald-400"
              : status === "NOT_STARTED"
                ? "bg-amber-500/20 text-amber-400"
                : "bg-red-500/20 text-red-400"
          }`}
        >
          {status === "OPEN"
            ? "● OPEN"
            : status === "NOT_STARTED"
              ? "● NOT STARTED"
              : "● CLOSED"}
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="registration-opens"
            className="mb-2 block text-sm font-semibold text-slate-300"
          >
            Registration Opens
          </label>

          <input
            id="registration-opens"
            type="datetime-local"
            value={opensAt}
            onChange={(event) =>
              setOpensAt(event.target.value)
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label
            htmlFor="registration-closes"
            className="mb-2 block text-sm font-semibold text-slate-300"
          >
            Registration Closes
          </label>

          <input
            id="registration-closes"
            type="datetime-local"
            value={closesAt}
            onChange={(event) =>
              setClosesAt(event.target.value)
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-amber-500"
          />
        </div>
      </div>

      <div className="mt-6">
        <label
          htmlFor="registration-url"
          className="mb-2 block text-sm font-semibold text-slate-300"
        >
          Register Now URL
        </label>

        <input
          id="registration-url"
          type="url"
          value={registrationUrl}
          onChange={(event) =>
            setRegistrationUrl(event.target.value)
          }
          placeholder="https://forms.google.com/..."
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-amber-500"
        />

        <p className="mt-2 text-xs text-slate-500">
          This is where visitors will be sent when they
          click the public Register Now button.
        </p>
      </div>

      {message && (
        <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300">
          {message}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="rounded-xl bg-amber-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>

        {status === "OPEN" ? (
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-3 font-bold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Close Registration
          </button>
        ) : (
          <button
            type="button"
            onClick={handleOpen}
            disabled={loading}
            className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3 font-bold text-emerald-400 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Open Registration
          </button>
        )}
      </div>
    </section>
  );
}