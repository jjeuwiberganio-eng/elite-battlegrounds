import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Construction } from "lucide-react";

interface AdminNavCardProps {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  ready: boolean;
}

export default function AdminNavCard({
  href,
  label,
  description,
  icon: Icon,
  ready,
}: Readonly<AdminNavCardProps>) {
  if (!ready) {
    return (
      <div className="relative flex flex-col justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-5 opacity-60">
        <div>
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-500">
            <Icon className="h-5 w-5" />
          </div>

          <p className="font-bold text-slate-400">
            {label}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-600">
            {description}
          </p>
        </div>

        <div className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
          <Construction className="h-3 w-3" />
          Not Ready
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href}
      prefetch={false}
      className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-900 p-5 transition hover:border-amber-500/40 hover:bg-slate-900/60"
    >
      <div>
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
          <Icon className="h-5 w-5" />
        </div>

        <p className="font-bold text-white">
          {label}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-slate-500 transition group-hover:text-amber-400">
        Open
        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
