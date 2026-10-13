import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Radio,
} from "lucide-react";

import {
  getAdminAttention,
  type AttentionMatch,
} from "@/actions/admin-attention";

function formatWhen(value: string | null) {
  if (!value) {
    return "Not scheduled";
  }

  return new Date(value).toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  });
}

function MatchLine({
  match,
}: Readonly<{ match: AttentionMatch }>) {
  return (
    <Link
      href="/admin/matches"
      prefetch={false}
      className="flex items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-sm transition hover:bg-white/5"
    >
      <span className="min-w-0 truncate font-semibold text-white">
        #{match.matchNumber} {match.teamA}{" "}
        <span className="text-amber-400">vs</span> {match.teamB}
      </span>

      <span className="shrink-0 text-xs text-slate-500">
        {formatWhen(match.scheduledAt)}
      </span>
    </Link>
  );
}

function Section({
  title,
  tone,
  children,
}: Readonly<{
  title: string;
  tone: "live" | "warn" | "neutral";
  children: React.ReactNode;
}>) {
  const toneClass =
    tone === "live"
      ? "text-red-300"
      : tone === "warn"
        ? "text-amber-300"
        : "text-slate-300";

  return (
    <div>
      <p
        className={`mb-1 px-3 text-xs font-bold ${toneClass}`}
      >
        {title}
      </p>

      {children}
    </div>
  );
}

/*
 * Server component: "what needs me right now" at the top of the admin
 * dashboard. Shows only what applies; when nothing does it says so.
 */
export default async function AttentionPanel() {
  const attention = await getAdminAttention();

  const hasIssues =
    attention.liveMatches.length > 0 ||
    attention.needsResultCount > 0 ||
    attention.teamsWithoutGroup > 0 ||
    attention.matchesWithoutDay > 0;

  return (
    <section className="space-y-4 rounded-2xl border border-white/10 bg-slate-900 p-5">
      <div className="flex items-center gap-3">
        {hasIssues ? (
          <AlertTriangle className="h-5 w-5 text-amber-400" />
        ) : (
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
        )}

        <h2 className="font-black text-white">
          {hasIssues ? "Needs your attention" : "All clear"}
        </h2>
      </div>

      {attention.liveMatches.length > 0 && (
        <Section title="Live right now" tone="live">
          {attention.liveMatches.map((match) => (
            <MatchLine key={match.id} match={match} />
          ))}
        </Section>
      )}

      {attention.needsResultCount > 0 && (
        <Section
          title={`Needs a result (${attention.needsResultCount})`}
          tone="warn"
        >
          {attention.needsResult.map((match) => (
            <MatchLine key={match.id} match={match} />
          ))}

          {attention.needsResultCount >
            attention.needsResult.length && (
            <Link
              href="/admin/matches"
              prefetch={false}
              className="block px-3 py-2 text-xs font-bold text-amber-400 hover:text-amber-300"
            >
              See all {attention.needsResultCount} in Matches
            </Link>
          )}
        </Section>
      )}

      {attention.teamsWithoutGroup > 0 && (
        <Link
          href="/admin/teams"
          prefetch={false}
          className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-amber-200 transition hover:bg-white/5"
        >
          {attention.teamsWithoutGroup}{" "}
          {attention.teamsWithoutGroup === 1 ? "team has" : "teams have"}{" "}
          no group yet and won&apos;t appear in the standings.
        </Link>
      )}

      {attention.matchesWithoutDay > 0 && (
        <Link
          href="/admin/matches"
          prefetch={false}
          className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-amber-200 transition hover:bg-white/5"
        >
          {attention.matchesWithoutDay}{" "}
          {attention.matchesWithoutDay === 1
            ? "group-stage match has"
            : "group-stage matches have"}{" "}
          no schedule day, so{" "}
          {attention.matchesWithoutDay === 1 ? "it is" : "they are"}{" "}
          hidden from the public schedule.
        </Link>
      )}

      {attention.upNext.length > 0 && (
        <Section title="Up next" tone="neutral">
          {attention.upNext.map((match) => (
            <MatchLine key={match.id} match={match} />
          ))}
        </Section>
      )}

      {!hasIssues && attention.upNext.length === 0 && (
        <p className="flex items-center gap-2 px-3 text-sm text-slate-500">
          <Radio className="h-4 w-4" />
          No live, overdue or upcoming matches right now.
        </p>
      )}
    </section>
  );
}
