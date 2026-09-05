import {
  Trophy,
  ClipboardList,
  Clock,
  XCircle,
  UserX,
  Handshake,
  Wifi,
  Video,
  Scale,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  clipboard: ClipboardList,
  clock: Clock,
  "x-circle": XCircle,
  "user-x": UserX,
  handshake: Handshake,
  wifi: Wifi,
  video: Video,
  scale: Scale,
};

interface RulesSummarySectionProps {
  rules: {
    id: string;
    title: string;
    description: string;
    icon: string;
  }[];
}

export default function RulesSummarySection({
  rules,
}: Readonly<RulesSummarySectionProps>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-amber-500/30 bg-slate-950">
      {/* Header */}
      <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.25),transparent_65%)] px-6 pb-6 pt-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-amber-400/40 bg-amber-500/10">
          <Trophy className="h-6 w-6 text-amber-400" />
        </div>

        <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-amber-400">
          Elite Battlegrounds Series
        </p>

        <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-white">
          Tournament Rules
        </h2>

        <p className="text-sm font-bold uppercase tracking-widest text-amber-400/80">
          (Summary)
        </p>
      </div>

      {/* Rules List */}
      <div className="divide-y divide-white/5 border-t border-white/5">
        {rules.map((rule) => {
          const Icon =
            ICONS[rule.icon] ??
            ClipboardList;

          return (
            <div
              key={rule.id}
              className="flex gap-3 px-5 py-4"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400">
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-black uppercase tracking-wide text-amber-400">
                  {rule.title}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  {rule.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Facebook CTA */}
      <div className="flex items-center gap-3 border-t border-white/5 bg-blue-600 px-5 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
          <span className="text-lg font-black leading-none">
            f
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-xs font-black uppercase leading-tight text-white">
            All Players Are Required To{" "}
            <span className="text-amber-300">
              Follow The Facebook Page
            </span>
          </p>

          <p className="mt-1 text-[10px] leading-4 text-blue-100">
            Upang makatanggap ng lahat ng
            official announcements,
            schedules, brackets, at iba
            pang tournament updates.
          </p>
        </div>
      </div>
    </div>
  );
}
