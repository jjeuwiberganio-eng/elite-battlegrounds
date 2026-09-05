"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  ClipboardList,
  Clock,
  XCircle,
  UserX,
  Handshake,
  Wifi,
  Video,
  Scale,
  ClipboardCheck,
  CalendarClock,
  Lock,
  Star,
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
  "clipboard-check": ClipboardCheck,
  "calendar-clock": CalendarClock,
  lock: Lock,
  star: Star,
};

interface RuleItem {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: string;
}

interface RulesListSectionProps {
  rules: RuleItem[];
}

export default function RulesListSection({
  rules,
}: Readonly<RulesListSectionProps>) {
  const searchParams = useSearchParams();
  const activeCategory =
    searchParams.get("category") || "general";

  const filtered = useMemo(() => {
    return rules.filter(
      (rule) => rule.category === activeCategory,
    );
  }, [rules, activeCategory]);

  return (
    <section className="bg-white py-10">
      <div className="container mx-auto max-w-4xl px-6">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center text-slate-500">
            No rules in this category yet.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((rule) => {
              const Icon =
                ICONS[rule.icon] ?? ClipboardList;

              return (
                <div
                  key={rule.id}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">
                      {rule.title}
                    </h3>

                    <p className="mt-1.5 text-sm leading-6 text-slate-600">
                      {rule.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
