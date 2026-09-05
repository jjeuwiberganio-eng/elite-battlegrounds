import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface AdminNavRowProps {
  href: string;
  label: string;
  description: string;
  ready: boolean;
}

export default function AdminNavRow({
  href,
  label,
  description,
  ready,
}: Readonly<AdminNavRowProps>) {
  if (!ready) {
    return (
      <div className="flex items-center justify-between gap-4 px-4 py-3 opacity-50">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-400">
            {label}
          </p>

          <p className="truncate text-xs text-slate-600">
            {description}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
          Not Ready
        </span>
      </div>
    );
  }

  return (
    <Link
      href={href}
      prefetch={false}
      className="group flex items-center justify-between gap-4 px-4 py-3 transition hover:bg-white/[0.03]"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-white">
          {label}
        </p>

        <p className="truncate text-xs text-slate-500">
          {description}
        </p>
      </div>

      <ArrowRight className="h-4 w-4 shrink-0 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-amber-400" />
    </Link>
  );
}
